import { LangEnum } from '@/models/MarkData'
import type { Media } from '@/models/Media'

function getLang(_msg: string) {
  const lang = {
    S: false,
    T: false,
    J: false,
    E: false,
  }
  const msg = _msg.toUpperCase()
  const langMap = [
    { CHS: [LangEnum.S] },
    { CHT: [LangEnum.T] },
    { JPN: [LangEnum.J] },
    { ENG: [LangEnum.E] },
    { BIG5: [LangEnum.T] },
    { GB: [LangEnum.S] },
    { JP: [LangEnum.J] },
    { JPTC: [LangEnum.J, LangEnum.T] },
    { JPSC: [LangEnum.J, LangEnum.S] },
    { 简: [LangEnum.S] },
    { 簡: [LangEnum.S] },
    { 繁: [LangEnum.T] },
    { 日: [LangEnum.J] },
    { 英: [LangEnum.E] },
  ]
  for (const _lang of langMap) {
    for (const key in _lang) {
      if (msg.includes(key)) {
        for (const l of _lang[key])
          lang[l] = true
      }
    }
  }

  return lang
}

function getQuality(media: Media | undefined) {
  let quality = ''
  if (media) {
    if (media.h === 720)
      quality = '720p'
    else if (media.h === 1080)
      quality = '1080p'
    else if (media.w && media.w > 2000 && media.w < 3500)
      quality = '2K'
    else if (media.w && media.w >= 3500)
      quality = '4K'
  }
  return quality
}

function getFromMark(mark: string, text: string) {
  const subTitleRegex = mark.match(/s(\d+),(\d+)/)
  const titleRegex = mark.matchAll(/t(\d+),(\d+)/g)
  const episodeRegex = mark.match(/e(\d+),(\d+)/)

  const subTitle = subTitleRegex ? text.substring(Number.parseInt(subTitleRegex[1]), Number.parseInt(subTitleRegex[2])) : ''
  let title = ''
  for (const t of titleRegex) {
    if (title !== '')
      title += ' '
    title += text.substring(Number.parseInt(t[1]), Number.parseInt(t[2]))
  }
  const _episode = episodeRegex ? text.substring(Number.parseInt(episodeRegex[1]), Number.parseInt(episodeRegex[2])) : ''
  const episode = Number(_episode).toString().padStart(2, '0')
  return {
    subTitle,
    title,
    episode,
  }
}

export { getLang, getQuality, getFromMark }
