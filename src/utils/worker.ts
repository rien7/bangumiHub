import { Buffer } from 'node:buffer'
import { Api } from 'telegram'
import { RPCError } from 'telegram/errors'
import { getChannel } from '../components/dashboard/searchbar/searchChannel'
import type Channel from '../models/Channel'
import db, { StoreNames } from './db'
import { download } from './download'

navigator.serviceWorker.addEventListener('message', async (event) => {
  if (event.data.type === 'img-request')
    await imageHandler(event.data.url)
})

async function imageHandler(url: string) {
  const { pathname } = new URL(url)
  const imgPath = pathname.split('/img/')[1]
  const imgType = imgPath[0]
  const imgId = imgPath.slice(1)

  let { id, accessHash, fileReference } = await db.get(StoreNames.MEDIA, imgId)

  fileReference = Buffer.from(fileReference as ArrayBuffer)

  let imgData
  if (imgType === 'm') {
    imgData = await download(new Api.InputDocumentFileLocation({
      id,
      accessHash,
      fileReference,
      thumbSize: 'v',
    })) as Api.upload.File
  }
  else {
    try {
      imgData = await download(new Api.InputPhotoFileLocation({
        id,
        accessHash,
        fileReference,
        thumbSize: 'a',
      })) as Api.upload.File
    }
    catch (error) {
      if (error instanceof RPCError && error.errorMessage === 'FILE_REFERENCE_EXPIRED') {
        const _channel = (await db.getAll(StoreNames.FAVOURITE_CHANNELS))
          .map(channel => JSON.parse(channel) as Channel)
          .filter((channel) => {
            return channel.chatPhotoId?.toString() === imgId
          })
        if (_channel.length !== 1)
          return
        const channel = await getChannel(_channel[0].username || _channel[0].id.toString())
        db.put(StoreNames.FAVOURITE_CHANNELS, JSON.stringify({
          ...channel,
          about: undefined,
        }), channel.id.toString())
        let { fileReference } = await db.get(StoreNames.MEDIA, imgId)
        fileReference = Buffer.from(fileReference as ArrayBuffer)
        imgData = await download(new Api.InputPhotoFileLocation({
          id,
          accessHash,
          fileReference,
          thumbSize: 'a',
        })) as Api.upload.File
      }
      else { throw error }
    }
  }

  navigator.serviceWorker.controller?.postMessage({
    type: 'img-result',
    url,
    imgData: imgData?.bytes,
  })
}
