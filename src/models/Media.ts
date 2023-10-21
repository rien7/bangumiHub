import type { Buffer } from 'node:buffer'
import type { Api } from 'telegram'

class Media {
  id: bigInt.BigInteger
  accessHash: bigInt.BigInteger
  fileReference: Buffer
  duration?: number
  w?: number
  h?: number
  size: bigInt.BigInteger
  mimeType: string
  dcId: number

  constructor(media: Api.MessageMediaDocument) {
    const document = media.document as Api.Document
    this.id = document.id
    this.accessHash = document.accessHash
    this.fileReference = document.fileReference
    const attribute = document.attributes.find((attr) => {
      return attr.className === 'DocumentAttributeVideo'
    }) as Api.DocumentAttributeVideo
    if (attribute) {
      this.duration = attribute.duration
      this.w = attribute.w
      this.h = attribute.h
    }
    this.size = document.size
    this.mimeType = document.mimeType
    this.dcId = document.dcId
  }
}

export { Media }
