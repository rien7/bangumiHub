/// <reference lib="WebWorker" />

const sw = globalThis as unknown as ServiceWorkerGlobalScope
sw.skipWaiting()
sw.addEventListener('fetch', (e: FetchEvent) => {
  const { url } = e.request
  const { pathname } = new URL(url)
  if (pathname.includes('/img/'))
    e.respondWith(imageHandler(url, e))
  else if (pathname.includes('/v/'))
    e.respondWith(videoHandler(url, e))
})

interface RequestStates {
  resolve: (data: any) => void
  reject: (reason?: string) => void
}

interface ImgMsg {
  type: 'img-request'
  url: string
}

interface VideoMsg {
  type: 'video-request'
  url: string
  start: number
  limit: number
}

type PostMsg = ImgMsg | VideoMsg
const requestStates = new Map<string, RequestStates>()
const TIMEOUT = 10_000

async function videoHandler(url: string, e: FetchEvent): Promise<Response> {
  const range = e.request.headers.get('range')
  const bytes = /^bytes=(\d+)-(\d+)?$/g.exec(range || '')!
  const requsetStart = Number(bytes[1])

  const data = await postMsg(e, {
    type: 'video-request',
    url,
    start: requsetStart,
    limit: 1024 * 1024,
  })

  if (!data || data.videoData.byteLength === 0) {
    return new Response(null, {
      status: 500,
      statusText: 'Internal Server Error',
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

  const data = await postMsg(e, {
    type: 'img-request',
    url,
  })

  if (!data || data.imgData.byteLength === 0) {
    return new Response(null, {
      status: 500,
      statusText: 'Internal Server Error',
    })
  }

  const { imgData } = data

  // add to cache
  await cache.put(url, new Response(imgData))

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
      requestStates.set(params.url, { resolve, reject })
    }),
    new Promise<void>((resolve) => {
      setTimeout(() => resolve(), TIMEOUT)
    })
      .then(() => isResolved ? undefined : Promise.reject(new Error('REQUEST_TIMEOUT'))),
  ])

  promise
    .catch((reason) => {
      console.error(reason)
    })
    .finally(() => {
      requestStates.delete(params.url)
      isResolved = true
    })

  const client = await (sw.clients.get(e.clientId))
  if (!client)
    return undefined

  client.postMessage(params)

  return promise
}

sw.addEventListener('message', (event) => {
  const state = requestStates.get(event.data.url)
  if (state)
    state.resolve(event.data)
})
