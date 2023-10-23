import { Api } from 'telegram'
import { returnBigInt } from 'telegram/Helpers'
import { CLIENT } from './client'

async function downloadManual(
  location: Api.TypeInputFileLocation,
  dcId: number,
  offset = returnBigInt(0),
  limit = 1024 * 1024,
) {
  const sender = await CLIENT.getSender(dcId)
  const result = await CLIENT.invokeWithSender(
    new Api.upload.GetFile({
      location,
      offset,
      limit,
      precise: false,
      cdnSupported: false,
    }),
    sender,
  )
  return result
}

async function download(
  location: Api.TypeInputFileLocation,
  dcId: number,
) {
  const result = await CLIENT.downloadFile(
    location,
    {
      dcId,
    },
  )
  return result
}

export { download, downloadManual }
