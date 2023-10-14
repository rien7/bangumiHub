import { Api } from 'telegram'
import { CLIENT } from '../../../utils/client'
import { Channel } from '../../../models/Channel'
import { download } from '../../../utils/download'

async function getChannel(text: string) {
  const result = await CLIENT.invoke(
    new Api.channels.GetFullChannel({
      channel: text,
    }),
  )
  const channel = new Channel(result)
  if (channel.chatPhoto) {
    const photoData = await download(channel.chatPhoto.getPhotoLocation())
    const image = photoData as Api.upload.File
    channel.chatPhoto.setPhoto(image.bytes.toString('base64'))
  }
  return channel
}

export { getChannel }
