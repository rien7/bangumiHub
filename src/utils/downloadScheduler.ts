import { Buffer } from 'node:buffer'
import { Api } from 'telegram'
import { returnBigInt } from 'telegram/Helpers'
import { RPCError } from 'telegram/errors'
import db, { StoreNames } from './db'
import { downloadManual } from './download'
import { adjustLimitOffset } from './worker'
import { getMessageByMediaId } from './expired'
import type { Media } from '@/models/Media'
import { getChannelMessagesByMessageId } from '@/components/dashboard/mainboard/messageFeed/getMessages'

class DownloadScheduler {
  static SINGLETON: DownloadScheduler = new DownloadScheduler()
  private chunkSize = 128 * 1024

  private _currentDownloadUrl: string | undefined = undefined

  private _mediaId: string | undefined = undefined
  private _accessHash: string | undefined = undefined
  private _fileReference: Buffer | undefined = undefined
  private _dcId: number = 0
  mediaSize: number = 0

  private _downloadingPromise: Map<number, Promise<Api.upload.File>> = new Map()
  private _downloadStatus: Map<number, number> = new Map()
  private waitingPromise: Promise<undefined> | undefined = undefined

  get currentDownloadUrl(): string | undefined {
    return this._currentDownloadUrl
  }

  set currentDownloadUrl(url: string | undefined) {
    if (url !== this._currentDownloadUrl)
      caches.delete('video')
    if (!url || url === this._currentDownloadUrl)
      return
    this._currentDownloadUrl = url
    const { pathname } = new URL(url)
    const videoId = pathname.split('/v/')[1]

    this.waitingPromise = new Promise((resolve) => {
      db.get(StoreNames.MEDIA, videoId)
        .then((data) => {
          const { id, accessHash, fileReference, dcId, size } = data as Media
          this._mediaId = id.toString()
          this._accessHash = accessHash.toString()
          this._fileReference = Buffer.from(fileReference)
          this._dcId = dcId
          this.mediaSize = Number(size.toString())
          this._downloadStatus.clear()
          resolve(undefined)
        })
    })
  }

  async videoHandler(_start: number) {
    if (!this._currentDownloadUrl)
      throw new Error('No current download url')
    const cache = await caches.open('video')
    const [start, limit] = adjustLimitOffset(_start, this.chunkSize)
    const downloadStatu = this._downloadStatus.get(start)
    let data: Response
    // console.debug(`[Handler] ${start}`)
    if (downloadStatu === 2) {
      const _data = await cache.match(`${this._currentDownloadUrl}-${start}`)
      if (!_data)
        throw new Error('Cache not exist!')
      data = _data
      // console.debug(`[Hit cache] ${start}`)
    }
    else if (downloadStatu === 1) {
      const promise = this._downloadingPromise.get(start)
      if (!promise)
        throw new Error('Promise not exist!')
      // console.debug(`[Waiting download] ${start}`)
      const _data = await promise
      data = new Response(_data.bytes, {
        headers: new Headers({
          'Accept-Ranges': 'bytes',
          'Content-Type': 'application/octet-stream',
          'Content-Length': _data.bytes.byteLength.toString(),
          'Content-Range': `bytes ${start}-${start + _data.bytes.byteLength - 1}/${this.mediaSize}`,
        }),
      })
      // console.debug(`[Waiting finish] ${start}`)
    }
    else {
      this._downloadStatus.set(start, 1)
      const promise = this.downloadVideo(start, limit)
      this._downloadingPromise.set(start, promise)
      const _data = await promise
        .then((_data) => {
          cache.put(`${this._currentDownloadUrl}-${start}`, new Response(_data.bytes, {
            headers: new Headers({
              'Accept-Ranges': 'bytes',
              'Content-Type': 'application/octet-stream',
              'Content-Length': _data.bytes.byteLength.toString(),
              'Content-Range': `bytes ${start}-${start + _data.bytes.byteLength - 1}/${this.mediaSize}`,
            }),
          }))
          this._downloadStatus.set(start, 2)
          this._downloadingPromise.delete(start)
          return _data
        })
      data = new Response(_data.bytes, {
        headers: new Headers({
          'Accept-Ranges': 'bytes',
          'Content-Type': 'application/octet-stream',
          'Content-Length': _data.bytes.byteLength.toString(),
          'Content-Range': `bytes ${start}-${start + _data.bytes.byteLength - 1}/${this.mediaSize}`,
        }),
      })
    }

    for (let i = 0, _s = start + this.chunkSize; i < 40; i++, _s += this.chunkSize) {
      if (_s > this.mediaSize)
        break
      const downloadStatu = this._downloadStatus.get(_s)
      if (downloadStatu === 1 || downloadStatu === 2)
        continue
      const [s, l] = adjustLimitOffset(_s, this.chunkSize)
      // console.debug(`[Caching] ${start} + ${i}`)
      this._downloadStatus.set(s, 1)
      const promise = this.downloadVideo(s, l)
        .then((_data) => {
          cache.put(`${this._currentDownloadUrl}-${s}`, new Response(_data.bytes, {
            headers: new Headers({
              'Accept-Ranges': 'bytes',
              'Content-Type': 'application/octet-stream',
              'Content-Length': _data.bytes.byteLength.toString(),
              'Content-Range': `bytes ${s}-${s + _data.bytes.byteLength - 1}/${this.mediaSize}`,
            }),
          }))
          this._downloadStatus.set(s, 2)
          this._downloadingPromise.delete(s)
          return _data
        })
      this._downloadingPromise.set(s, promise)
    }

    return data
  }

  private async downloadVideo(offset: number, limit: number): Promise<Api.upload.File> {
    if (this.waitingPromise)
      await this.waitingPromise
    let data: Api.upload.File
    try {
      data = await this.downloadWithoutCatch(offset, limit)
    }
    catch (error) {
      if (error instanceof RPCError && error.errorMessage === 'FILE_REFERENCE_EXPIRED') {
        await this.handleFileExpired()
        data = await this.downloadWithoutCatch(offset, limit)
      }
      else {
        throw error
      }
    }
    return data
  }

  private async downloadWithoutCatch(offset: number, limit: number) {
    return await downloadManual(new Api.InputDocumentFileLocation({
      id: returnBigInt(this._mediaId!),
      accessHash: returnBigInt(this._accessHash!),
      fileReference: this._fileReference!,
      thumbSize: '',
    }), this._dcId, returnBigInt(offset), limit) as Api.upload.File
  }

  private async handleFileExpired() {
    const _message = await getMessageByMediaId(this._mediaId!)
    if (!_message)
      return
    const message = await getChannelMessagesByMessageId(_message.channelId, [new Api.InputMessageID({ id: _message.id })])
    if (message.length !== 1)
      return
    const _media = await db.get(StoreNames.MEDIA, this._mediaId!) as Media
    this._fileReference = _media.fileReference
  }
}

export default DownloadScheduler
