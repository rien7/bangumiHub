import type { Api } from 'telegram'
import db, { StoreNames } from '../utils/db'
import Photo from './Photo'

class Channel {
  id: bigInt.BigInteger
  title: string
  accessHash?: bigInt.BigInteger
  username?: string
  about?: string
  chatPhotoId?: bigInt.BigInteger
  favorite: boolean
  joined?: boolean

  constructor(data: Api.messages.ChatFull, joined?: boolean) {
    const channel = data.chats[0] as Api.Channel
    this.id = channel.id
    this.title = channel.title
    this.accessHash = channel.accessHash
    this.username = channel.username
    this.about = data.fullChat.about
    this.favorite = false
    this.joined = joined
    if (data.fullChat.chatPhoto) {
      const photo = new Photo(data.fullChat.chatPhoto)
      this.chatPhotoId = photo.id
      db.put(StoreNames.MEDIA, {
        ...photo,
        id: photo.id.toString(),
        accessHash: photo.accessHash.toString(),
      }, photo.id.toString())
    }
  }
}

export default Channel
