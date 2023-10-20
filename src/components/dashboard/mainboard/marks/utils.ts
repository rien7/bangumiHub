import type MarkData from '@/models/MarkData'
import { strToBase64 } from '@/utils/base64'
import db, { StoreNames } from '@/utils/db'
import { t2s } from '@/utils/stConvert'

async function getImgUrlByName(name: string) {
  const sName = t2s(name)
  const url = `https://api.bgm.tv/search/subject/${sName}?type=2`
  const encodedUrl = encodeURI(url)
  let id: string | undefined
  try {
    await fetch(encodedUrl)
      .then(response => response.json())
      .then((data) => {
        if (data.results !== 0)
          id = data.list[0].id
      })
  }
  catch (error) {
    console.error(error)
  }
  return id
}

async function getMarkedMessageQuery(id: string) {
  const _mark = await db.get(StoreNames.FAVOURITE_MARKS, id)
  const mark = _mark as MarkData
  const channelId = mark.channelId
  const text = mark.text
  if (text === undefined)
    return

  const episodeMark = mark.mark.match(/e(\d+),(\d+)/)
  if (episodeMark === null || episodeMark?.length !== 3) {
    console.error('episodeMark is not valid')
    return
  }
  const query = `${text?.substring(0, Number.parseInt(episodeMark[1]))} ${text?.substring(Number.parseInt(episodeMark[2]))}`
  return {
    channelId,
    query,
  }
}

async function uploadTiDB(channel_id: number, message_id: number, mark: string) {
  const url = 'https://us-west-2.data.tidbcloud.com/api/v1beta/app/dataapp-VlwpndHe/endpoint/insertMark'
  const data = {
    channel_id,
    message_id,
    mark,
  }
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${strToBase64(`${import.meta.env.VITE_TIDB_PUBLIC_KEY}:${import.meta.env.VITE_TIDB_PRIVATE_KEY}`)}`,
  }
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers,
  })
}

async function getFromTiDB(channel_id: number, start_id: number, end_id: number) {
  const _url = 'https://us-west-2.data.tidbcloud.com/api/v1beta/app/dataapp-VlwpndHe/endpoint/searchIndex'
  const url = `${_url}?channel_id=${channel_id}&start_id=${start_id}&end_id=${end_id}`
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${strToBase64(`${import.meta.env.VITE_TIDB_PUBLIC_KEY}:${import.meta.env.VITE_TIDB_PRIVATE_KEY}`)}`,
  }
  return await fetch(url, {
    method: 'GET',
    headers,
  })
}

export { getImgUrlByName, getMarkedMessageQuery, uploadTiDB, getFromTiDB }
