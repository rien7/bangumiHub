import { Buffer } from 'node:buffer'
import { Api } from 'telegram'
import { returnBigInt } from 'telegram/Helpers'
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
    imgData = await download(new Api.InputPhotoFileLocation({
      id,
      accessHash,
      fileReference,
      thumbSize: 'a',
    })) as Api.upload.File
  }

  navigator.serviceWorker.controller?.postMessage({
    type: 'img-result',
    url,
    imgData: imgData?.bytes,
  })
}
