import { Api } from 'telegram'
import { CLIENT } from '@/utils/client'
import Message from '@/models/Message'

async function searchMsgTelegram(channelId: bigInt.BigInteger, q: string, offsetId?: number, accessHash?: bigInt.BigInteger) {
  const result = await CLIENT.invoke(
    new Api.messages.Search({
      peer: accessHash ? new Api.InputPeerChannel({ channelId, accessHash }) : channelId,
      q,
      filter: new Api.InputMessagesFilterVideo(),
      limit: 20,
      offsetId,
    }),
  ) as Api.messages.Messages
  const messages = result.messages as Api.Message[]
  return messages.map(message => new Message(message))
}

export default searchMsgTelegram
