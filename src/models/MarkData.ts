import { returnBigInt } from 'telegram/Helpers'

enum LangEnum {
  S = 'S',
  T = 'T',
  J = 'J',
  E = 'E',
}

class MarkData {
  subTitle: string
  title: string
  episode: string
  lang: {
    [key in LangEnum]: boolean;
  }

  quality: string
  text?: string
  mark: string
  favourite: string | undefined

  id: string
  channelId: bigInt.BigInteger
  image?: string

  constructor() {
    this.subTitle = ''
    this.title = ''
    this.episode = ''
    this.lang = { S: false, T: false, J: false, E: false }
    this.quality = ''
    this.text = ''
    this.mark = ''
    this.favourite = undefined
    this.id = ''
    this.channelId = returnBigInt(0)
  }
}

export default MarkData
export { LangEnum }
