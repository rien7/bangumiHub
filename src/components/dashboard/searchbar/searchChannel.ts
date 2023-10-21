import { Api } from 'telegram'
import { CLIENT } from '@/utils/client'
import Channel from '@/models/Channel'

async function getChannel(text: string) {
  try {
    const result = await CLIENT.invoke(
      new Api.channels.GetFullChannel({
        channel: text,
      }),
    )
    const joined = await getJoined(text)
    const channel = new Channel(result, joined)
    return channel
  }
  catch (error) {
    return undefined
  }
}

async function joinChannel(text: string) {
  await CLIENT.invoke(
    new Api.channels.JoinChannel({
      channel: text,
    }),
  )
}

async function leaveChannel(text: string) {
  await CLIENT.invoke(
    new Api.channels.LeaveChannel({
      channel: text,
    }),
  )
}

async function getJoined(text: string) {
  let joined
  try {
    await CLIENT.invoke(
      new Api.channels.GetParticipant({
        channel: text,
        participant: await CLIENT.getMe(),
      }),
    )
    joined = true
  }
  catch (error) {
    joined = false
  }
  return joined
}

export { getChannel, joinChannel, leaveChannel }
