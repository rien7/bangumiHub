import { openDB } from 'idb'

enum StoreNames {
  GENERAL_SETTINGS = 'general-settings',
  FAVOURITE_CHANNELS = 'favourite-channels',
  MEDIA = 'media',
  TA_INDEX = 'ta-index',
  MARK_INDEX = 'mark-index',
  FAVOURITE_MARKS = 'favourite-marks',
}

const db = await openDB('tadb', 8, {
  upgrade(db) {
    for (const storeName of Object.values(StoreNames)) {
      if (!db.objectStoreNames.contains(storeName))
        db.createObjectStore(storeName)
    }
  },
})

export default db
export { StoreNames }
