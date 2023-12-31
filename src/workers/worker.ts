/// <reference lib="WebWorker" />

const sw = globalThis as unknown as ServiceWorkerGlobalScope
sw.skipWaiting()
sw.addEventListener('fetch', (e: FetchEvent) => {
  const { url } = e.request
  const { pathname } = new URL(url)
  if (pathname.startsWith('/img/'))
    e.respondWith(imageHandler(url, e))
  else if (pathname.startsWith('/v/'))
    e.respondWith(videoHandler(url, e))
})

interface RequestStates {
  resolve: (data: any) => void
  reject: (reason?: string) => void
}

interface ImgMsg {
  type: 'img-request'
  url: string
  randomId: string
}

interface VideoMsg {
  type: 'video-request'
  url: string
  randomId: string
  start: number
}

type PostMsg = ImgMsg | VideoMsg
const requestStates = new Map<string, RequestStates>()
const TIMEOUT = 50_000

async function videoHandler(url: string, e: FetchEvent): Promise<Response> {
  const range = e.request.headers.get('range')
  const bytes = /^bytes=(\d+)-(\d+)?$/g.exec(range || '')!
  const requsetStart = Number(bytes[1])

  const randomId = Math.random().toString(36).substring(7)

  const data = await postMsg(e, {
    type: 'video-request',
    url,
    randomId,
    start: requsetStart,
  })

  if (!data || data.videoData.byteLength === 0) {
    return new Response(null, {
      status: 504,
      statusText: 'Gateway Timeout',
    })
  }

  const { start, videoData, fullSize } = data
  const end = start + videoData.byteLength - 1

  return new Response(videoData, {
    status: 206,
    statusText: 'Partial Content',
    headers: new Headers({
      'Accept-Ranges': 'bytes',
      'Content-Type': 'video/mp4',
      'Content-Length': videoData.byteLength.toString(),
      'Content-Range': `bytes ${start}-${end}/${fullSize}`,
    }),
  })
}

async function imageHandler(url: string, e: FetchEvent): Promise<Response> {
  const cache = await caches.open('img-cache')
  const cachedResponse = await cache.match(url)
  if (cachedResponse)
    return cachedResponse

  const randomId = Math.random().toString(36).substring(7)

  const data = await postMsg(e, {
    type: 'img-request',
    url,
    randomId,
  })

  if (!data || data.imgData.byteLength === 0) {
    return new Response(null, {
      status: 504,
      statusText: 'Gateway Timeout',
    })
  }

  const { imgData } = data

  // add to cache
  cache.put(url, new Response(imgData, {
    headers: new Headers({
      'Content-Type': 'image/png',
      'Content-Length': imgData.byteLength.toString(),
    }),
  }))

  return new Response(imgData, {
    headers: new Headers({
      'Content-Type': 'image/png',
      'Content-Length': imgData.byteLength.toString(),
    }),
  })
}

async function postMsg(e: FetchEvent, params: PostMsg): Promise<any> {
  let isResolved = false
  const promise = Promise.race([
    new Promise((resolve, reject) => {
      requestStates.set(params.randomId, { resolve, reject })
    }),
    new Promise<void>((resolve) => {
      setTimeout(() => resolve(), TIMEOUT)
    })
      .then(() => {
        if (isResolved)
          return undefined
        else
          return Promise.resolve(undefined)
      }),
  ])

  promise
    .catch(() => {})
    .finally(() => {
      requestStates.delete(params.randomId)
      isResolved = true
    })

  const client = await (sw.clients.get(e.clientId))
  if (!client)
    return undefined

  client.postMessage(params)

  return promise
}

sw.addEventListener('message', (event) => {
  const state = requestStates.get(event.data.randomId)
  if (state)
    state.resolve(event.data)
})
