import { Buffer } from 'node:buffer'
import { Api } from 'telegram'
import { RPCError } from 'telegram/errors'
import { returnBigInt } from 'telegram/Helpers'
import { getChannel } from '../components/dashboard/searchbar/searchChannel'
import type Channel from '../models/Channel'
import db, { StoreNames } from './db'
import { download, downloadManual } from './download'
import { getChannelByMediaId, getMessageByMediaId } from './expired'
import { getChannelMessagesByMessageId } from '@/components/dashboard/mainboard/messageFeed/getMessages'
import type { Media } from '@/models/Media'

navigator.serviceWorker.addEventListener('message', async (event) => {
  if (event.data.type === 'img-request')
    imageHandler(event.data.url, event.data.randomId)
  else if (event.data.type === 'video-request')
    videoHandler(event.data.url, event.data.randomId, event.data.start, event.data.limit)
})

async function videoHandler(url: string, randomId: string, start: number, limit: number) {
  const { pathname } = new URL(url)
  const videoId = pathname.split('/v/')[1]

  let { id, accessHash, fileReference, size, dcId } = await db.get(StoreNames.MEDIA, videoId)

  const [newOffset, newLimit] = adjustLimitOffset(start, limit)

  const cache = await caches.open('video')
  const cacheData = await cache.match(`${videoId}-${newOffset}`)
  if (cacheData) {
    navigator.serviceWorker.controller?.postMessage({
      type: 'video-result',
      randomId,
      videoData: await cacheData.arrayBuffer(),
      start: newOffset,
      fullSize: size,
    })
    return
  }

  let videoData
  try {
    videoData = await downloadManual(new Api.InputDocumentFileLocation({
      id,
      accessHash,
      fileReference: Buffer.from(fileReference as ArrayBuffer),
      thumbSize: '',
    }), dcId, returnBigInt(newOffset), newLimit) as Api.upload.File
  }
  catch (error) {
    if (error instanceof RPCError && error.errorMessage === 'FILE_REFERENCE_EXPIRED') {
      const _message = await getMessageByMediaId(videoId)
      if (!_message)
        return
      const message = await getChannelMessagesByMessageId(_message.channelId, [new Api.InputMessageID({ id: _message.id })])
      if (message.length !== 1)
        return
      const _media = await db.get(StoreNames.MEDIA, videoId) as Media
      id = _media.id
      accessHash = _media.accessHash
      fileReference = _media.fileReference
      dcId = _media.dcId
      videoData = await downloadManual(new Api.InputDocumentFileLocation({
        id,
        accessHash,
        fileReference: Buffer.from(fileReference as ArrayBuffer),
        thumbSize: '',
      }), dcId, returnBigInt(newOffset), newLimit) as Api.upload.File
    }
    else { throw error }
  }

  navigator.serviceWorker.controller?.postMessage({
    type: 'video-result',
    randomId,
    videoData: videoData.bytes,
    start: newOffset,
    fullSize: size,
  })

  // preload 10 chunks
  for (let i = 0; i < 10; i++) {
    const [offset, limit] = adjustLimitOffset(newOffset + newLimit * (i + 1), newLimit)
    if (offset >= size)
      break
    const cacheData = await cache.match(`${videoId}-${offset}`)
    if (cacheData)
      continue
    downloadManual(new Api.InputDocumentFileLocation({
      id,
      accessHash,
      fileReference: Buffer.from(fileReference as ArrayBuffer),
      thumbSize: '',
    }), dcId, returnBigInt(offset), limit)
      .then((_videoData) => {
        const videoData = _videoData as Api.upload.File
        cache.put(`${videoId}-${offset}`, new Response(videoData.bytes, {
          headers: new Headers({
            'Accept-Ranges': 'bytes',
            'Content-Type': 'video/mp4',
            'Content-Length': videoData.bytes.byteLength.toString(),
            'Content-Range': `bytes ${offset}-${offset + videoData.bytes.byteLength - 1}/${size}`,
          }),
        }))
      })
  }
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
