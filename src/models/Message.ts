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
    if (data.media instanceof Api.MessageMediaDocument) {
      const media = new Media(data.media)
      db.put(StoreNames.MEDIA, {
        ...media,
        id: media.id.toString(),
        accessHash: media.accessHash.toString(),
      }, media.id.toString())
      this.mediaId = media.id
    }

    this.channelId = (data.peerId as Api.PeerChannel).channelId
  }
}

export default Message
