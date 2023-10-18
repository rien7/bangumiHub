import type MarkData from '@/models/MarkData'
import db, { StoreNames } from '@/utils/db'

async function getImgUrlByName(name: string) {
  const url = `https://api.bgm.tv/search/subject/${name}?type=2`
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

export { getImgUrlByName, getMarkedMessageQuery }
