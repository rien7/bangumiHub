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
const { activeChannel, messageQuery, searchChannel, activeMark } = storeToRefs(globalStore)

watch([activeChannel, messageQuery, searchChannel, activeMark], async () => {
  await init()
})

async function onScroll() {
  const { scrollTop, scrollHeight, clientHeight } = messageFeed.value!
  if (scrollTop + clientHeight + 200 >= scrollHeight && !updating.value) {
    if (activeMark.value)
      await getMarkedMessages()
    else if (messageQuery.value.length === 0)
      await getMessages()
    else
      await searchMessages()
  }
}

async function init() {
  if (activeMark.value) {
    lastMessageId = 0
    messages.value = []
    await getMarkedMessages()
  }
  else if (messageQuery.value.length === 0) {
    lastMessageId = 0
    messages.value = []
    await getMessages()
  }
  else {
    lastMessageId = 0
    messages.value = []
    await searchMessages()
  }
}

async function getMessages() {
  if ((!activeChannel.value || !activeChannel.value.accessHash) && (!searchChannel.value || !searchChannel.value.accessHash))
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
  if (!activeChannel.value || !activeChannel.value.accessHash || !messageQuery.value)
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
  const queryData = await getMarkedMessageQuery(activeMark.value.id)
  if (!queryData)
    return
  const { channelId, query } = queryData
  const newMessages = await searchMsgTelegram(
    channelId,
    query,
    lastMessageId,
  )
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
  updating.value = false
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
