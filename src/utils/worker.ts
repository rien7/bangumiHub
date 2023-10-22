import { Buffer } from 'node:buffer'
import { Api } from 'telegram'
import { RPCError } from 'telegram/errors'
import { getChannel } from '../components/dashboard/searchbar/searchChannel'
import type Channel from '../models/Channel'
import db, { StoreNames } from './db'
import { download } from './download'
import { getChannelByMediaId } from './expired'
import DownloadScheduler from './downloadScheduler'

navigator.serviceWorker.addEventListener('message', async (event) => {
  if (event.data.type === 'img-request')
    imageHandler(event.data.url, event.data.randomId)
  else if (event.data.type === 'video-request')
    videoHandler(event.data.url, event.data.randomId, event.data.start, event.data.limit)
})

async function videoHandler(url: string, randomId: string, start: number, _limit: number) {
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

  const { id, accessHash, fileReference, dcId } = await db.get(StoreNames.MEDIA, imgId)

  let imgData
  if (imgType === 'm') {
    imgData = await download(new Api.InputDocumentFileLocation({
      id,
      accessHash,
      fileReference: Buffer.from(fileReference as ArrayBuffer),
      thumbSize: 'v',
    }), dcId)
  }
  else {
    try {
      imgData = await download(new Api.InputPhotoFileLocation({
        id,
        accessHash,
        fileReference: Buffer.from(fileReference as ArrayBuffer),
        thumbSize: 'a',
      }), dcId)
    }
    catch (error) {
      if (error instanceof RPCError && error.errorMessage === 'FILE_REFERENCE_EXPIRED') {
        const _channel = await getChannelByMediaId(imgId) as Channel
        if (!_channel)
          return
        const channel = await getChannel(_channel.username || _channel.id.toString())
        if (!channel)
          return
        const { fileReference } = await db.get(StoreNames.MEDIA, imgId)
        imgData = await download(new Api.InputPhotoFileLocation({
          id,
          accessHash,
          fileReference: Buffer.from(fileReference as ArrayBuffer),
          thumbSize: 'a',
        }), dcId)
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

// https://core.telegram.org/api/files#uploading-files
function adjustLimitOffset(offset: number, limit: number): [number, number] {
  // Ensure limit and offset are divisible by 4 KB (4 * 1024 bytes)
  limit = Math.floor(limit / (4 * 1024)) * (4 * 1024)
  offset = Math.floor(offset / (4 * 1024)) * (4 * 1024)

  // Ensure 1 MB (1048576 bytes) is divisible by limit
  if (1048576 % limit !== 0)
    limit = 1048576 / (1048576 / limit)

  // Ensure offset / (1024 * 1024) == (offset + limit - 1) / (1024 * 1024)
  while (Math.floor(offset / (1024 * 1024)) !== Math.floor((offset + limit - 1) / (1024 * 1024))) {
    if (offset <= 0) {
      offset = 0
      break
    }
    offset -= 4 * 1024
  }

  return [offset, limit]
}

export { adjustLimitOffset }
