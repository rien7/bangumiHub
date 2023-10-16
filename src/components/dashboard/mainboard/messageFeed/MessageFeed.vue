<script setup lang='ts'>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import searchMsgTelegram from './searchMsgTelegram'
import { getChannelMessages } from './getMessages'
import MessageCard from './MessageCard.vue'
import type Message from '@/models/Message'
import db, { StoreNames } from '@/utils/db'
import type Channel from '@/models/Channel'
import useGlobalStore from '@/store/global'

let lastMessageId = 0

const curerntChannel = ref<Channel>()
const messages = ref<Message[]>([])
const messageFeed = ref<HTMLElement>()
const updating = ref(false)

const globalStore = useGlobalStore()
const { acviteChannel, messageQuery } = storeToRefs(globalStore)

watch([acviteChannel, messageQuery], () => {
  if (messageQuery.value.length === 0) {
    lastMessageId = 0
    messages.value = []
    getMessages()
  }
  else {
    lastMessageId = 0
    messages.value = []
    searchMessages()
  }
})

window.addEventListener('message', async (event) => {
  if (event.data.type === 'selecting-channel')
    await init()
})

async function onScroll() {
  const { scrollTop, scrollHeight, clientHeight } = messageFeed.value!
  if (scrollTop + clientHeight + 200 >= scrollHeight && !updating.value) {
    if (messageQuery.value.length === 0)
      await getMessages()
    else
      await searchMessages()
  }
}

async function init() {
  const selectingChannel = await db.get(StoreNames.GENERAL_SETTINGS, 'selecting-channel') as string
  if (!selectingChannel)
    return
  if (selectingChannel !== curerntChannel.value?.id.toString()) {
    lastMessageId = 0
    messages.value = []
  }
  const _channel = await db.get(StoreNames.FAVOURITE_CHANNELS, selectingChannel) as string
  const channel = JSON.parse(_channel) as Channel
  curerntChannel.value = channel
  await getMessages()
}

async function getMessages() {
  if (!acviteChannel.value || !acviteChannel.value.accessHash)
    return
  updating.value = true
  const newMessages = await getChannelMessages(acviteChannel.value?.id, lastMessageId, acviteChannel.value.accessHash)
  messages.value = messages.value.concat(newMessages)
  lastMessageId = messages.value[messages.value.length - 1].id
  updating.value = false
}

async function searchMessages() {
  if (!acviteChannel.value || !acviteChannel.value.accessHash || !messageQuery.value)
    return
  updating.value = true
  const newMessages = await searchMsgTelegram(acviteChannel.value?.id, messageQuery.value, lastMessageId, acviteChannel.value.accessHash)
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
      <MessageCard :message="message" />
    </div>
  </div>
</template>
./searchMsgTelegram
