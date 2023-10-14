import { Buffer } from 'node:buffer'
import { Api } from 'telegram'

class Photo {
  id: bigInt.BigInteger
  accessHash: bigInt.BigInteger
  fileReference: ArrayBuffer
  sizes: PhotoSize[]

  constructor(photo: Api.TypePhoto) {
    if (photo instanceof Api.PhotoEmpty)
      throw new Error('Photo is empty.')

    this.id = photo.id
    this.accessHash = photo.accessHash
    this.fileReference = photo.fileReference
    this.sizes = photo.sizes.map((size) => {
      if (!(size instanceof Api.PhotoSize))
        throw new Error('Photo size is empty.')

      return new PhotoSize(size.type, size.w, size.h, size.size)
    })
  }

  getPhoto(type: string = this.sizes[0].type): string | undefined {
    return (this.sizes.find(size => size.type === type) || this.sizes[0])
      .data
  }

  setPhoto(data: string, type: string = this.sizes[0].type) {
    const size = this.sizes.find(size => size.type === type)
    if (size)
      size.data = data
  }

  getPhotoLocation(type: string = this.sizes[0].type): Api.InputPhotoFileLocation {
    return new Api.InputPhotoFileLocation({
      id: this.id,
      accessHash: this.accessHash,
      fileReference: Buffer.from(this.fileReference),
      thumbSize: type,
    })
  }
}

class PhotoSize {
  type: string
  w: number
  h: number
  size: number
  data?: string

  constructor(type: string, w: number, h: number, size: number) {
    this.type = type
    this.w = w
    this.h = h
    this.size = size
  }
}

export { Photo, PhotoSize }
