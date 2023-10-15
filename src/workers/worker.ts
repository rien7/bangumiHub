/// <reference lib="WebWorker" />

const sw = globalThis as unknown as ServiceWorkerGlobalScope

sw.addEventListener('fetch', (e: FetchEvent) => {
  const { url } = e.request
  const { pathname } = new URL(url)
  if (pathname.includes('/img/'))
    e.respondWith(imageHandler(url, e))
})

interface RequestStates {
  resolve: (data: any) => void
  reject: (reason?: string) => void
}

interface ImgMsg {
  type: 'img-request'
  url: string
}

type PostMsg = ImgMsg
const requestStates = new Map<string, RequestStates>()
const TIMEOUT = 10_000

async function imageHandler(url: string, e: FetchEvent): Promise<Response> {
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
