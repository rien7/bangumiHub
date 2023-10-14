import { StringSession } from 'telegram/sessions'
import { TelegramClient } from 'telegram'
import apiCredentals from '../../credentials.json'
import db from './db'

const SESSION_STRING = await db.get('ta-index', 'session')
const SESSION = new StringSession(SESSION_STRING)
const CLIENT = new TelegramClient(SESSION, apiCredentals.apiId, apiCredentals.apiHash, {
  connectionRetries: 5,
})

await CLIENT.connect()

export { CLIENT, SESSION_STRING }
