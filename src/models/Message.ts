import { Api } from 'telegram'
import db, { StoreNames } from '../utils/db'
import { Media } from './Media'

class Message {
  id: number
  date: number
  message: string
  mediaId?: bigInt.BigInteger
  channelId: bigInt.BigInteger

  constructor(data: Api.Message) {
    this.id = data.id
    this.date = data.date
    this.message = data.message
    this.channelId = (data.peerId as Api.PeerChannel).channelId
    if (data.media instanceof Api.MessageMediaDocument) {
      const media = new Media(data.media)
      media.channelId = this.channelId.toJSNumber()
      media.messageId = this.id
      db.put(StoreNames.MEDIA, {
        ...media,
        id: media.id.toString(),
        accessHash: media.accessHash.toString(),
        size: media.size.toJSNumber(),
      }, media.id.toString())
      this.mediaId = media.id
    }
    db.put(StoreNames.TA_INDEX, {
      ...this,
      mediaId: this.mediaId?.toString(),
      channelId: this.channelId.toString(),
    }, `${this.channelId.toString()}+${this.id}`)
  }
}

export default Message
