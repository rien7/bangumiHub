import { openDB } from 'idb';

const db = await openDB('tadb', 1, {
  upgrade(db) {
    db.createObjectStore('ta-index');
  }
})

export default db;