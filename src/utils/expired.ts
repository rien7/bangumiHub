import db, { StoreNames } from './db'
import type Message from '@/models/Message'
import type { Media } from '@/models/Media'
import type Channel from '@/models/Channel'

async function getMessageByMediaId(mediaId: string) {
  const media = await db.get(StoreNames.MEDIA, mediaId) as Media

  if (media.channelId && media.messageId) {
    const message = await db.get(StoreNames.TA_INDEX, `${media.channelId}+${media.messageId}`) as Message
    return message
  }

  const message = await db.getAll(StoreNames.TA_INDEX).then(messages => messages.find(message => message.mediaId === mediaId)) as Message
  return message
}

async function getChannelByMediaId(mediaId: string) {
  const media = await db.get(StoreNames.MEDIA, mediaId) as Media

  if (media.channelId) {
    const channel = await db.get(StoreNames.FAVOURITE_CHANNELS, media.channelId.toString()) as Channel
    return channel
  }

  const channel = await db.getAll(StoreNames.FAVOURITE_CHANNELS).then(channels => channels.find(channel => channel.chatPhotoId === mediaId)) as Channel
  return channel
}

export {
  getMessageByMediaId,
  getChannelByMediaId,
}
