import { Api } from 'telegram'
import { returnBigInt } from 'telegram/Helpers'
import { CLIENT } from './client'

async function downloadManual(
  location: Api.TypeInputFileLocation,
  offset = returnBigInt(0),
  limit = 1024 * 1024,
) {
  const result = await CLIENT.invoke(
    new Api.upload.GetFile({
      location,
      offset,
      limit,
      precise: false,
      cdnSupported: false,
    }),
  )
  return result
}

async function download(
  location: Api.TypeInputFileLocation,
  dcId: number,
) {
  const retult = await CLIENT.downloadFile(
    location,
    {
      dcId,
    },
  )
  return retult
}

export { download, downloadManual }
