import { Api } from 'telegram'
import { RPCError } from 'telegram/errors'
import { useRouter } from 'vue-router'
import { CLIENT } from '../../../../utils/client'
import Message from '../../../../models/Message'
import db, { StoreNames } from '@/utils/db'

const router = useRouter()

async function getChannelMessages(channelId: bigInt.BigInteger, offsetId?: number, accessHash?: bigInt.BigInteger) {
  try {
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
  catch (error) {
    if (error instanceof RPCError && error.errorMessage === 'AUTH_KEY_UNREGISTERED') {
      await db.delete(StoreNames.GENERAL_SETTINGS, 'session')
      router.push('/login')
    }
    else {
      throw error
    }
  }
}

async function getChannelMessagesByMessageId(channelId: bigInt.BigInteger, ids: Api.InputMessageID[], accessHash?: bigInt.BigInteger) {
  const result = await CLIENT.invoke(
    new Api.channels.GetMessages({
      channel: accessHash ? new Api.InputPeerChannel({ channelId, accessHash }) : channelId,
      id: ids,
    }),
  ) as Api.messages.Messages
  const messages = result.messages as Api.Message[]
  return messages.map(message => new Message(message))
}
export { getChannelMessages, getChannelMessagesByMessageId }
