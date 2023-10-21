<script setup lang='ts'>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import Plyr from 'plyr'
import { decode, encode } from '@/utils/number'
import type Message from '@/models/Message'
import db, { StoreNames } from '@/utils/db'
import type { Media } from '@/models/Media'
import 'plyr/dist/plyr.css'
import type MarkData from '@/models/MarkData'
import useGlobalStore from '@/store/global'

const route = useRoute()
const router = useRouter()

const ids = route.params.id.toString().split(/[xyzXYZ]/)

const channelId = ref(decode(ids[0]))
const messageId = ref(decode(ids[1]))

const full = ref(false)

const message = ref<Message>()
const media = ref<Media>()
const mark = ref<MarkData>()
const video = ref<HTMLVideoElement>()
const left = ref<HTMLDivElement>()

const player = ref<Plyr>()

const rightPosition = ref<{
  x: number
  y: number
  h: number
  w: number
} | undefined>(undefined)

const globalStore = useGlobalStore()

function handleImgClick(_messageId: string) {
  messageId.value = Number.parseInt(_messageId)
  const channelIdEncode = encode(channelId.value)
  const msgIdEncode = encode(messageId.value)
  const spliter = 'xyzXYZ'.split('')[Math.floor(messageId.value % 6)]
  router.push(`/v/${channelIdEncode}${spliter}${msgIdEncode}`)
}

const messageInMark = ref<{
  title: string
  subTitle?: string
  episode: number
  msgId: string
  mediaId?: string
}[]>([])

watch([channelId, messageId], async () => {
  await init()
  player.value!.source = {
    type: 'video',
    sources: [
      {
        src: `./v/${media.value?.id}`,
        type: 'video/mp4',
      },
    ],
  }
  player.value?.restart()
  db.get(StoreNames.MARK_INDEX, `${channelId.value}+${messageId.value}`).then((_mark) => {
    mark.value = _mark as MarkData
  })
})

function getRightSize() {
  if (full.value) {
    rightPosition.value = undefined
    return
  }
  const rect = left.value?.getBoundingClientRect()
  if (!rect) {
    rightPosition.value = undefined
    return
  }
  // get window width
  const windowWidth = window.innerWidth
  const w = windowWidth - rect.right - 90
  rightPosition.value = {
    x: rect.right - 50,
    y: rect.y - 106,
    h: rect.height,
    w,
  }
}

watch([left], async () => {
  new ResizeObserver(getRightSize).observe(left.value!)
})

const controls = `
<div class="plyr__controls">
    <button type="button" class="plyr__control" aria-label="Play, {title}" data-plyr="play">
        <svg class="icon--pressed" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17.276 5.47c.435.16.724.575.724 1.039V17.49c0 .464-.29.879-.724 1.039a3.69 3.69 0 0 1-2.552 0A1.107 1.107 0 0 1 14 17.491V6.51c0-.464.29-.879.724-1.04a3.69 3.69 0 0 1 2.552 0Zm-8 0c.435.16.724.575.724 1.039V17.49c0 .464-.29.879-.724 1.039a3.69 3.69 0 0 1-2.552 0A1.107 1.107 0 0 1 6 17.491V6.51c0-.464.29-.879.724-1.04a3.69 3.69 0 0 1 2.552 0Z"/></svg>
        <svg class="icon--not-pressed" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="m11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>
    </button>
    <div class="plyr__progress">
        <input data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" aria-label="Seek">
        <progress class="plyr__progress__buffer" min="0" max="100" value="0">% buffered</progress>
        <span role="tooltip" class="plyr__tooltip">00:00</span>
    </div>
    <div class="plyr__time plyr__time--current" aria-label="Current time">00:00</div>
    <div class="plyr__time plyr__time--duration" aria-label="Duration">00:00</div>
    <button type="button" class="plyr__control plyr__mute" aria-label="Mute" data-plyr="mute">
        <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-muted"></use></svg>
        <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-volume"></use></svg>
        <span class="label--pressed plyr__tooltip" role="tooltip">Unmute</span>
        <span class="label--not-pressed plyr__tooltip" role="tooltip">Mute</span>
    </button>
    <div class="plyr__volume">
        <input data-plyr="volume" type="range" min="0" max="1" step="0.05" value="1" autocomplete="off" aria-label="Volume">
    </div>
    <button type="button" class="plyr__control web-full-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M4 20q-.825 0-1.413-.588T2 18V6q0-.825.588-1.413T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.588 1.413T20 20H4Zm0-2h1V6H4v12Zm15 0h1V6h-1v12Z"/></svg>
    </button>
    <button type="button" class="plyr__control" data-plyr="fullscreen">
      <svg class="label--not-pressed xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/><path fill="currentColor" d="M9.793 12.793a1 1 0 0 1 1.497 1.32l-.083.094L6.414 19H9a1 1 0 0 1 .117 1.993L9 21H4a1 1 0 0 1-.993-.883L3 20v-5a1 1 0 0 1 1.993-.117L5 15v2.586l4.793-4.793ZM20 3a1 1 0 0 1 .993.883L21 4v5a1 1 0 0 1-1.993.117L19 9V6.414l-4.793 4.793a1 1 0 0 1-1.497-1.32l.083-.094L17.586 5H15a1 1 0 0 1-.117-1.993L15 3h5Z"/></g></svg>
      <svg class="icon--pressed" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/><path fill="currentColor" d="M10.5 12a1.5 1.5 0 0 1 1.493 1.356L12 13.5v5a1.5 1.5 0 0 1-2.993.144L9 18.5v-1.379l-3.94 3.94a1.5 1.5 0 0 1-2.224-2.008l.103-.114L6.88 15H5.5a1.5 1.5 0 0 1-.144-2.993L5.5 12h5Zm8.44-9.06a1.5 1.5 0 0 1 2.224 2.007l-.103.114L17.12 9h1.38a1.5 1.5 0 0 1 .144 2.993L18.5 12h-5a1.5 1.5 0 0 1-1.493-1.356L12 10.5v-5a1.5 1.5 0 0 1 2.993-.144L15 5.5v1.379l3.94-3.94Z"/></g></svg>  
    </button>
</div>
`

async function init() {
  const _message = await db.get(StoreNames.TA_INDEX, `${channelId.value}+${messageId.value}`)
  message.value = _message as Message
  const _media = await db.get(StoreNames.MEDIA, message.value.mediaId?.toString() || '')
  media.value = _media as Media

  db.get(StoreNames.MARK_INDEX, `${channelId.value}+${messageId.value}`).then((_mark) => {
    mark.value = _mark as MarkData
    if (!mark.value || !mark.value.ids)
      return
    messageInMark.value = []
    const _ids = mark.value.ids.split(',')
    _ids.forEach(async (id) => {
      let title: string | undefined
      let subTitle: string | undefined
      let episode: string | undefined
      let mediaId: string | undefined
      await Promise.all([
        db.get(StoreNames.MARK_INDEX, `${channelId.value}+${id}`).then((_data) => {
          const _markData = _data as MarkData
          title = _markData.title
          subTitle = _markData.subTitle
          episode = _markData.episode
        }),
        db.get(StoreNames.TA_INDEX, `${channelId.value}+${id}`).then(_data => mediaId = (_data as Message).mediaId?.toString()),
      ])
      messageInMark.value.push({
        title: title!,
        subTitle,
        episode: Number(episode),
        msgId: id,
        mediaId,
      })
    })
  })
}

onMounted(async () => {
  await init()
  globalStore.clearActiveMark()
  const _player = new Plyr(video.value!, {
    controls,
  })
  _player.on('ready', () => {
    const btn = document.querySelector('.web-full-btn')!
    btn.addEventListener('click', () => {
      full.value = !full.value
    })
  })
  player.value = _player
  addEventListener('resize', () => {
    getRightSize()
  })
})
</script>

<template>
  <div relative m-10>
    <div
      ref="left" class="video" :w="full ? 'full' : 'full md:75%'"
      :left="full ? '50%' : 0" :translate-x="full ? '-50%' : 0" absolute flex gap-10 transition-all
      duration-300
    >
      <div>
        <video
          id="player"
          ref="video"
          controls preload="auto"
        >
          <source v-if="media" :src="`./v/${media?.id}`" type="video/mp4">
        </video>
        <div mt-5 px-5>
          <div v-if="mark">
            <div flex items-center text-xl font-bold>
              <span>{{ mark.subTitle }}</span>
              <span mx-2 font-mono>|</span>
              <span>{{ mark.title }}</span>
              <span mx-2 font-mono>-</span>
              <span font-mono>{{ mark.episode }}</span>
            </div>
            <div text-sm text-gray>
              {{ message?.message }}
            </div>
          </div>
          <div v-else text-xl font-bold>
            {{ message?.message }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="messageInMark.length > 0 && !full && rightPosition && rightPosition.w > 120"
      bg="gray-100 dark:gray-800" class="all-episode" shadow="gray-500/70"
      :style="{
        left: `${rightPosition.x}px`,
        top: `${rightPosition.y}px`,
        height: `${rightPosition.h}px`,
        width: `${rightPosition.w}px`,
        maxHeight: `${messageInMark.length * (Math.min(rightPosition.w - 40, 320) / 16 * 9 + 20) + 60}px`,
      }"
      absolute max-w-360px rounded-md p-5
    >
      <div h-10 text-lg font-500>
        Episodes
      </div>
      <div
        max-w-320px flex flex-col gap-5 overflow-y-scroll
        :style="{
          maxHeight: `${messageInMark.length * (Math.min(rightPosition.w - 40, 320) / 16 * 9 + 20)}px`,
          height: `${rightPosition.h - 80}px`,
          width: `${rightPosition.w - 40}px`,
        }"
      >
        <div
          v-for="msg in messageInMark.sort((a, b) => a.episode - b.episode)" :key="msg.mediaId"
          :style="{
            width: `${rightPosition.w - 40}px`,
          }" cursor-pointe r relative max-w-320px
        >
          <img
            :src="`/img/m${msg.mediaId}`" max-w-320px cursor-pointer rounded-md
            :style="{
              width: `${rightPosition.w - 40}px`,
            }"
            @click="() => handleImgClick(msg.msgId)"
          >
          <div bg="gray-200/80 dark:gray-700/80" absolute bottom-1 right-1 rounded-lg px-1>
            <span text-sm font-mono>{{ msg.episode.toString().padStart(2, '0') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.video {
  max-width: calc(80vh / 9 * 16 );
}
.plyr--video {
  @apply shadow-gray-500/70 z-1
}
.plyr__controls {
  @apply flex-wrap gap-5px !bg-transparent !bg-gradient-to-t !from-black/70 !to-transparent !to-75% !p-10px justify-between flex
}
.plyr__controls .plyr__tooltip {
  @apply hidden
}
.plyr__progress {
  @apply bg-transparent !min-w-full order-first !mx-0 !px-0
}
.plyr__progress progress::-webkit-progress-value {
  @apply !bg-gray-400/70
}
.plyr__progress input[type="range" i]::-webkit-slider-thumb {
  @apply opacity-0
}
.plyr__progress:hover input[type="range" i]::-webkit-slider-thumb {
  @apply opacity-100
}
.plyr--hide-controls .plyr__controls {
  @apply !opacity-100 !translate-y-12.5
}
.plyr__time--current {
  @apply mr-2
}

.plyr__time--duration {
  @apply mr-auto
}
.plyr--video, .all-episode {
  border-radius: 0.375rem;
  border-radius: 0.375rem;
  -webkit-border-radius: 0.375rem;
  -webkit-border-radius: 0.375rem;
  -moz-border-radius: 0.375rem;
  -moz-border-radius: 0.375rem;
}
.plyr--video, .all-episode {
  -webkit-box-shadow: var(--un-shadow-inset) 0 0 12px -1px var(--un-shadow-color, rgba(0,0,0,0.1));
  -moz-box-shadow: var(--un-shadow-inset) 0 0 12px -1px var(--un-shadow-color, rgba(0,0,0,0.1));
  box-shadow: var(--un-shadow-inset) 0 0 12px -1px var(--un-shadow-color, rgba(0,0,0,0.1));
}
</style>
