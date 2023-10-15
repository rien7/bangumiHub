import { Api } from 'telegram'
import { CLIENT } from '../../../utils/client'
import Channel from '../../../models/Channel'

async function getChannel(text: string) {
  const result = await CLIENT.invoke(
    new Api.channels.GetFullChannel({
      channel: text,
    }),
  )
  const channel = new Channel(result)
  return channel
}

export { getChannel }
