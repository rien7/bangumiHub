import type { Api } from 'telegram'
import { Photo } from './Photo'

class Channel {
  id: bigInt.BigInteger
  title: string
  username?: string
  about?: string
  chatPhoto?: Photo

  constructor(data: Api.messages.ChatFull) {
    const channel = data.chats[0] as Api.Channel
    this.id = channel.id
    this.title = channel.title
    this.username = channel.username
    this.about = data.fullChat.about
    if (data.fullChat.chatPhoto)
      this.chatPhoto = new Photo(data.fullChat.chatPhoto)
  }
}

export { Channel }
