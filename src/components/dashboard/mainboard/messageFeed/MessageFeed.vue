<script setup lang='ts'>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { getFromCloud, getMarkedMessageQuery, uploadCloud } from '../marks/utils'
import { getFromMark, getLang, getQuality } from '../marks/extractData'
import searchMsgTelegram from './searchMsgTelegram'
import { getChannelMessages } from './getMessages'
import MessageCard from './MessageCard.vue'
import type Message from '@/models/Message'
import useGlobalStore from '@/store/global'
import db, { StoreNames } from '@/utils/db'
import type { Media } from '@/models/Media'

let lastMessageId = 0

const messages = ref<Message[]>([])
const messageFeed = ref<HTMLElement>()
const updating = ref(false)

const globalStore = useGlobalStore()
const { activeChannel, messageQuery, searchChannel, activeMark, currentValue, pageErrorMsg, pageErrorClick } = storeToRefs(globalStore)

watch([activeChannel, messageQuery, searchChannel, activeMark], async () => {
  await init()
})

async function onScroll() {
  const { scrollTop, scrollHeight, clientHeight } = messageFeed.value!
  if (scrollTop + clientHeight + 200 >= scrollHeight && !updating.value) {
    if (activeMark.value && currentValue.value === 'mark')
      await getMarkedMessages()
    else if (messageQuery.value.length === 0 && (currentValue.value === 'channel' || currentValue.value === 'searchChannel'))
      await getMessages()
    else if (currentValue.value === 'searchMessage')
      await searchMessages()
  }
}

async function init() {
  if (activeMark.value && currentValue.value === 'mark') {
    lastMessageId = 0
    messages.value = []
    await getMarkedMessages()
  }
  else if (messageQuery.value.length === 0 && (currentValue.value === 'channel' || currentValue.value === 'searchChannel')) {
    lastMessageId = 0
    messages.value = []
    await getMessages()
  }
  else if (currentValue.value === 'searchMessage') {
    lastMessageId = 0
    messages.value = []
    await searchMessages()
  }
}

async function getMessages() {
  if ((currentValue.value === 'channel' && (!activeChannel.value || !activeChannel.value.accessHash))
    || (currentValue.value === 'searchChannel' && (!searchChannel.value || !searchChannel.value.accessHash))
    || updating.value)
    return
  updating.value = true
  const newMessages = await getChannelMessages(
    searchChannel.value?.id || activeChannel.value!.id,
    lastMessageId,
    searchChannel.value?.accessHash || activeChannel.value!.accessHash,
  )
  if (!newMessages)
    return
  messages.value = messages.value.concat(newMessages)
  lastMessageId = messages.value[messages.value.length - 1].id
  updating.value = false
  getFromCloud(
    Number.parseInt((searchChannel.value?.id || activeChannel.value!.id).toString()),
    Math.min(newMessages[0].id, newMessages[newMessages.length - 1].id),
    Math.max(newMessages[0].id, newMessages[newMessages.length - 1].id),
  )
    .then(res => res.json())
    .then(json => json.results)
    .then((rows) => {
      rows.forEach(async (row) => {
        const channelId = row.channel_id
        const messageId = row.message_id
        const mark = row.mark
        // eslint-disable-next-line eqeqeq
        const msg = messages.value.filter(msg => msg.id == messageId)[0]
        if (!msg)
          return
        const { subTitle, title, episode } = getFromMark(mark, msg.message)
        const lang = getLang(msg.message)
        const media = await db.get(StoreNames.MEDIA, msg.mediaId?.toString() || '') as Media
        const quality = getQuality(media)

        db.put(StoreNames.MARK_INDEX, {
          channelId,
          title,
          subTitle,
          episode,
          mark,
          lang: { ...lang },
          quality,
        }, `${channelId.toString()}+${messageId.toString()}`)
          .then(() => {
            window.postMessage({
              type: 'update-marks',
              channelId: Number(channelId),
              messageId: Number(messageId),
            }, location.href)
          })
      })
    })
}

async function searchMessages() {
  if (!activeChannel.value || !activeChannel.value.accessHash || !messageQuery.value || updating.value)
    return
  updating.value = true
  const newMessages = await searchMsgTelegram(
    activeChannel.value.id,
    messageQuery.value,
    lastMessageId,
    activeChannel.value.accessHash,
  )
  if (newMessages.length === 0) {
    globalStore.setPageErrorMsg('No results founded, try another keyword.')
    updating.value = false
    return
  }
  messages.value = messages.value.concat(newMessages)
  lastMessageId = messages.value[messages.value.length - 1].id
  updating.value = false
  getFromCloud(
    Number.parseInt((searchChannel.value?.id || activeChannel.value!.id).toString()),
    Math.min(newMessages[0].id, newMessages[newMessages.length - 1].id),
    Math.max(newMessages[0].id, newMessages[newMessages.length - 1].id),
  )
    .then(res => res.json())
    .then(json => json.results)
    .then((rows) => {
      rows.forEach(async (row) => {
        const channelId = row.channel_id
        const messageId = row.message_id
        const mark = row.mark
        // eslint-disable-next-line eqeqeq
        const msg = messages.value.filter(msg => msg.id == messageId)[0]
        if (!msg)
          return
        const { subTitle, title, episode } = getFromMark(mark, msg.message)
        const lang = getLang(msg.message)
        const media = await db.get(StoreNames.MEDIA, msg.mediaId?.toString() || '') as Media
        const quality = getQuality(media)

        db.put(StoreNames.MARK_INDEX, {
          channelId,
          title,
          subTitle,
          episode,
          mark,
          lang: { ...lang },
          quality,
        }, `${channelId.toString()}+${messageId.toString()}`)
          .then(() => {
            window.postMessage({
              type: 'update-marks',
              channelId: Number(channelId),
              messageId: Number(messageId),
            }, location.href)
          })
      })
    })
}

async function getMarkedMessages() {
  if (!activeMark.value)
    return
  updating.value = true

  const __channelId = activeMark.value.channelId
  const __ids = activeMark.value.ids
  if (__ids && __ids.length !== 0) {
    const __msgs: Message[] = []
    for (const id of __ids.split(',')) {
      const msg = await db.get(StoreNames.TA_INDEX, `${__channelId}+${id}`)
      if (msg)
        __msgs.push(msg as Message)
    }
    messages.value = __msgs
    lastMessageId = messages.value[messages.value.length - 1].id
  }
  updating.value = false

  getMarksFromNet(activeMark.value.id)
}

async function getMarksFromNet(markId: string) {
  if (!activeMark.value || markId !== activeMark.value.id)
    return
  const queryData = await getMarkedMessageQuery(markId)
  if (!queryData)
    return
  const { channelId, query } = queryData
  const _newMessages = await searchMsgTelegram(
    channelId,
    query,
    lastMessageId,
  )
  const newMessages = _newMessages.filter(msg => messages.value.filter(m => m.id === msg.id).length === 0)
  if (newMessages.length === 0)
    return
  const _markData = {
    ...activeMark.value,
    text: undefined,
    favourite: activeMark.value.id,
    lang: { ...activeMark.value.lang },
  }
  const episodeMark = activeMark.value.mark.match(/e(\d+),(\d+)/)!
  const ids = newMessages.map(msg => msg.id.toString()).join(',')
  newMessages.forEach((msg) => {
    const episode = msg.message.substring(Number(episodeMark[1]), Number(episodeMark[2]))
    db.put(StoreNames.MARK_INDEX, {
      ..._markData,
      ids,
      episode,
    }, `${msg.channelId.toString()}+${msg.id.toString()}`)
    if (activeMark.value?.mark)
      uploadCloud(msg.channelId.toJSNumber(), msg.id, activeMark.value?.mark)
  })
  messages.value = messages.value.concat(newMessages)
  lastMessageId = messages.value[messages.value.length - 1].id
  db.put(StoreNames.FAVOURITE_MARKS, {
    ..._markData,
    text: activeMark.value.text,
    ids,
    episode: undefined,
  }, `${activeMark.value.id.toString()}`)
}

onMounted(async () => {
  await init()
})
</script>

<template>
  <div v-if="pageErrorMsg" h-full w-full flex items-center justify-center text-gray>
    <span>{{ pageErrorMsg }}</span>
    <span v-if="pageErrorClick" ml-2 cursor-pointer color-blue @click="pageErrorClick?.action">
      {{ pageErrorClick?.id }}
    </span>
  </div>
  <div
    v-else
    ref="messageFeed" flex flex-wrap gap-6 overflow-y-scroll p-8
    @scroll="onScroll"
  >
    <div v-for="message in messages" :key="message.id">
      <MessageCard :message="message" :channel-id="searchChannel?.id || activeChannel!.id" />
    </div>
  </div>
</template>
