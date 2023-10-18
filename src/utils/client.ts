import { StringSession } from 'telegram/sessions'
import { TelegramClient } from 'telegram'
import db, { StoreNames } from './db'

const SESSION_STRING = await db.get(StoreNames.GENERAL_SETTINGS, 'session')
const SESSION = new StringSession(SESSION_STRING)
const CLIENT = new TelegramClient(SESSION, 
  Number.parseInt(import.meta.env.VITE_API_ID || ''), 
  import.meta.env.VITE_API_HASH || '', {
  connectionRetries: 5,
})
CLIENT.connect()

export { CLIENT, SESSION_STRING }
