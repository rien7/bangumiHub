import { Buffer } from 'node:buffer'
import { Api } from 'telegram'
import { RPCError } from 'telegram/errors'
import { getChannel } from '../components/dashboard/searchbar/searchChannel'
import type Channel from '../models/Channel'
import db, { StoreNames } from './db'
import { download } from './download'
import { getChannelByMediaId } from './expired'
import DownloadScheduler from './downloadScheduler'
import type { Media } from '@/models/Media'

navigator.serviceWorker.addEventListener('message', async (event) => {
  if (event.data.type === 'img-request')
    imageHandler(event.data.url, event.data.randomId)
  else if (event.data.type === 'video-request')
    videoHandler(event.data.url, event.data.randomId, event.data.start)
})

async function videoHandler(url: string, randomId: string, start: number) {
  const scheduler = DownloadScheduler.SINGLETON
  scheduler.currentDownloadUrl = url

  const response = await scheduler.videoHandler(start)

  const headers = response.headers
  const range = headers.get('Content-Range')
  if (!range)
    throw new Error('Content-Range Empty')
  const regex = /bytes (\d+)-\d+\/\d+/
  const result = regex.exec(range)
  if (result?.length !== 2)
    throw new Error('Content-Range Error')

  navigator.serviceWorker.controller?.postMessage({
    type: 'video-result',
    randomId,
    videoData: await response.arrayBuffer(),
    start: Number(result[1]),
    fullSize: scheduler.mediaSize,
  })
}

async function imageHandler(url: string, randomId: string) {
  const { pathname } = new URL(url)
  const imgPath = pathname.split('/img/')[1]
  const imgType = imgPath[0]
  const imgId = imgPath.slice(1)

  let { id, accessHash, fileReference, dcId } = await db.get(StoreNames.MEDIA, imgId)

  async function downloadWithoutCatch(thumbSize: string) {
    return await download(new Api.InputDocumentFileLocation({
      id,
      accessHash,
      fileReference: Buffer.from(fileReference as ArrayBuffer),
      thumbSize,
    }), dcId)
  }

  let imgData
  if (imgType === 'm') {
    imgData = await downloadWithoutCatch('v')
  }
  else {
    try {
      imgData = await downloadWithoutCatch('a')
    }
    catch (error) {
      if (error instanceof RPCError && error.errorMessage === 'FILE_REFERENCE_EXPIRED') {
        const _channel = await getChannelByMediaId(imgId) as Channel
        if (!_channel)
          return
        const channel = await getChannel(_channel.username || _channel.id.toString())
        if (!channel)
          return
        const media = await db.get(StoreNames.MEDIA, imgId) as Media
        fileReference = media.fileReference
        imgData = await downloadWithoutCatch('a')
      }
      else { throw error }
    }
  }

  navigator.serviceWorker.controller?.postMessage({
    type: 'img-result',
    randomId,
    imgData,
  })
}
