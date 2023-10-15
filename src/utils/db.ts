import { openDB } from 'idb'

enum StoreNames {
  GENERAL_SETTINGS = 'general-settings',
  FAVOURITE_CHANNELS = 'favourite-channels',
  MEDIA = 'media',
  TA_INDEX = 'ta-index',
}

const db = await openDB('tadb', 4, {
  upgrade(db) {
    for (const storeName in StoreNames) {
      if (!db.objectStoreNames.contains(storeName))
        db.createObjectStore(storeName)
    }
  },
})

export default db
export { StoreNames }
