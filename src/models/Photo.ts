import type { Buffer } from 'node:buffer'
import { Api } from 'telegram'

class Photo {
  id: bigInt.BigInteger
  accessHash: bigInt.BigInteger
  fileReference: Buffer
  tumbSizes: string[]

  channelId?: number

  constructor(photo: Api.TypePhoto) {
    if (photo instanceof Api.PhotoEmpty)
      throw new Error('Photo is empty.')

    this.id = photo.id
    this.accessHash = photo.accessHash
    this.fileReference = photo.fileReference
    this.tumbSizes = photo.sizes.map((size) => {
      if (!(size instanceof Api.PhotoSize))
        throw new Error('Photo size is empty.')

      return size.type
    })
  }
}

export default Photo
