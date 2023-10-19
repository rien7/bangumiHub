import { Api } from 'telegram'
import { CLIENT } from '../../../../utils/client'
import Message from '../../../../models/Message'

async function getChannelMessages(channelId: bigInt.BigInteger, offsetId?: number, accessHash?: bigInt.BigInteger) {
  const result = await CLIENT.invoke(
    new Api.messages.GetHistory({
      peer: accessHash ? new Api.InputPeerChannel({ channelId, accessHash }) : channelId,
      limit: 20,
      offsetId,
    }),
  ) as Api.messages.Messages
  const messages = result.messages as Api.Message[]
  return messages.map(message => new Message(message))
}

async function getChannelMessagesByMessageId(channelId: bigInt.BigInteger, ids: Api.InputMessageID[], accessHash?: bigInt.BigInteger) {  
  const result = await CLIENT.invoke(
    new Api.channels.GetMessages({
      channel: accessHash ? new Api.InputPeerChannel({ channelId, accessHash }) : channelId,
      id: ids,
    })
  ) as Api.messages.Messages
  const messages = result.messages as Api.Message[]
  return messages.map(message => new Message(message))
}
export { getChannelMessages, getChannelMessagesByMessageId }
