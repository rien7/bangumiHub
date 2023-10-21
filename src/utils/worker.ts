import { Buffer } from 'node:buffer'
import { Api } from 'telegram'
import { RPCError } from 'telegram/errors'
import { returnBigInt } from 'telegram/Helpers'
import { getChannel } from '../components/dashboard/searchbar/searchChannel'
import type Channel from '../models/Channel'
import db, { StoreNames } from './db'
import { download, downloadManual } from './download'

navigator.serviceWorker.addEventListener('message', async (event) => {
  if (event.data.type === 'img-request')
    await imageHandler(event.data.url)
  else if (event.data.type === 'video-request')
    await videoHandler(event.data.url, event.data.start, event.data.limit)
})

async function videoHandler(url: string, start: number, limit: number) {
  const { pathname } = new URL(url)
  const videoId = pathname.split('/v/')[1]

  const { id, accessHash, fileReference, size, dcId } = await db.get(StoreNames.MEDIA, videoId)

  const [newOffset, newLimit] = adjustLimitOffset(start, limit)
  const videoData = await downloadManual(new Api.InputDocumentFileLocation({
    id,
    accessHash,
    fileReference: Buffer.from(fileReference as ArrayBuffer),
    thumbSize: '',
  }), dcId, returnBigInt(newOffset), newLimit) as Api.upload.File

  navigator.serviceWorker.controller?.postMessage({
    type: 'video-result',
    url,
    videoData: videoData.bytes,
    start: newOffset,
    fullSize: size,
  })
}

async function imageHandler(url: string) {
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
        }), channel?.id.toString())
        let { fileReference } = await db.get(StoreNames.MEDIA, imgId)
        fileReference = Buffer.from(fileReference as ArrayBuffer)
        imgData = await download(new Api.InputPhotoFileLocation({
          id,
          accessHash,
          fileReference,
          thumbSize: 'a',
        }), dcId)
      }
      else { throw error }
    }
  }

  navigator.serviceWorker.controller?.postMessage({
    type: 'img-result',
    url,
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
