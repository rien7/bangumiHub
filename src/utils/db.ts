import { openDB } from 'idb'

const db = await openDB('tadb', 3, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('general-settings'))
      db.createObjectStore('general-settings')
    if (!db.objectStoreNames.contains('favourite-channels'))
      db.createObjectStore('favourite-channels')
    if (!db.objectStoreNames.contains('ta-index'))
      db.createObjectStore('ta-index')
  },
})

export default db
