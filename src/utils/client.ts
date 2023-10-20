import { StringSession } from 'telegram/sessions'
import { TelegramClient } from 'telegram'
import { useRouter } from 'vue-router'
import { RPCError } from 'telegram/errors'
import db, { StoreNames } from './db'

const router = useRouter()

const SESSION_STRING = await db.get(StoreNames.GENERAL_SETTINGS, 'session')
const SESSION = new StringSession(SESSION_STRING)
let CLIENT: TelegramClient
try {
  CLIENT = new TelegramClient(SESSION, Number.parseInt(import.meta.env.VITE_API_ID || ''), import.meta.env.VITE_API_HASH || '', {
    connectionRetries: 5,
  })
  CLIENT.connect()
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

export { CLIENT, SESSION_STRING }
