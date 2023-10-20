<script setup lang='ts'>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { getMarkedMessageQuery } from '../marks/utils'
import searchMsgTelegram from './searchMsgTelegram'
import { getChannelMessages } from './getMessages'
import MessageCard from './MessageCard.vue'
import type Message from '@/models/Message'
import useGlobalStore from '@/store/global'
import db, { StoreNames } from '@/utils/db'

let lastMessageId = 0

const messages = ref<Message[]>([])
const messageFeed = ref<HTMLElement>()
const updating = ref(false)

const globalStore = useGlobalStore()
const { activeChannel, messageQuery, searchChannel, activeMark, currentValue } = storeToRefs(globalStore)

watch([activeChannel, messageQuery, searchChannel, activeMark], async () => {
  await init()
})

async function onScroll() {
  const { scrollTop, scrollHeight, clientHeight } = messageFeed.value!
  if (scrollTop + clientHeight + 200 >= scrollHeight && !updating.value) {
    if (activeMark.value && currentValue.value === 'mark')
      await getMarkedMessages()
    else if (messageQuery.value.length === 0 && currentValue.value === 'channel')
      await getMessages()
    else if (currentValue.value === 'searchChannel' || currentValue.value === 'searchMessage')
      await searchMessages()
  }
}

async function init() {
  if (activeMark.value && currentValue.value === 'mark') {
    lastMessageId = 0
    messages.value = []
    await getMarkedMessages()
  }
  else if (messageQuery.value.length === 0 && currentValue.value === 'channel') {
    lastMessageId = 0
    messages.value = []
    await getMessages()
  }
  else if (currentValue.value === 'searchChannel' || currentValue.value === 'searchMessage') {
    lastMessageId = 0
    messages.value = []
    await searchMessages()
  }
}

async function getMessages() {
  if ((!activeChannel.value || !activeChannel.value.accessHash) && (!searchChannel.value || !searchChannel.value.accessHash) || updating.value)
    return
  updating.value = true
  const newMessages = await getChannelMessages(
    searchChannel.value?.id || activeChannel.value!.id,
    lastMessageId,
    searchChannel.value?.accessHash || activeChannel.value!.accessHash,
  )
  messages.value = messages.value.concat(newMessages)
  lastMessageId = messages.value[messages.value.length - 1].id
  updating.value = false
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
  messages.value = messages.value.concat(newMessages)
  lastMessageId = messages.value[messages.value.length - 1].id
  updating.value = false
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
  newMessages.forEach((msg) => {
    const episode = msg.message.substring(Number(episodeMark[1]), Number(episodeMark[2]))
    db.put(StoreNames.MARK_INDEX, {
      ..._markData,
      episode,
    }, `${msg.channelId.toString()}+${msg.id.toString()}`)
  })
  messages.value = messages.value.concat(newMessages)
  lastMessageId = messages.value[messages.value.length - 1].id
  db.put(StoreNames.FAVOURITE_MARKS, {
    ..._markData,
    text: activeMark.value.text,
    ids: newMessages.map(msg => msg.id.toString()).join(','),
    episode: undefined,
  }, `${activeMark.value.id.toString()}`)
}

onMounted(async () => {
  await init()
})
</script>

<template>
  <div
    ref="messageFeed" flex flex-wrap gap-6 overflow-y-scroll p-8
    @scroll="onScroll"
  >
    <div v-for="message in messages" :key="message.id">
      <MessageCard :message="message" :channel-id="searchChannel?.id || activeChannel!.id" />
    </div>
  </div>
</template>
./searchMsgTelegram
