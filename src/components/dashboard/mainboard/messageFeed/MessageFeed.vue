<script setup lang='ts'>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import searchMsgTelegram from './searchMsgTelegram'
import { getChannelMessages } from './getMessages'
import MessageCard from './MessageCard.vue'
import type Message from '@/models/Message'
import useGlobalStore from '@/store/global'

let lastMessageId = 0

const messages = ref<Message[]>([])
const messageFeed = ref<HTMLElement>()
const updating = ref(false)

const globalStore = useGlobalStore()
const { activeChannel: acviteChannel, messageQuery, searchChannel } = storeToRefs(globalStore)

watch([acviteChannel, messageQuery, searchChannel], async () => {
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
}

async function getMessages() {
  if ((!acviteChannel.value || !acviteChannel.value.accessHash) && (!searchChannel.value || !searchChannel.value.accessHash))
    return
  updating.value = true
  const newMessages = await getChannelMessages(
    searchChannel.value?.id || acviteChannel.value!.id,
    lastMessageId,
    searchChannel.value?.accessHash || acviteChannel.value!.accessHash,
  )
  messages.value = messages.value.concat(newMessages)
  lastMessageId = messages.value[messages.value.length - 1].id
  updating.value = false
}

async function searchMessages() {
  if (!acviteChannel.value || !acviteChannel.value.accessHash || !messageQuery.value)
    return
  updating.value = true
  const newMessages = await searchMsgTelegram(
    acviteChannel.value.id,
    messageQuery.value,
    lastMessageId,
    acviteChannel.value.accessHash,
  )
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
      <MessageCard :message="message" :channel-id="searchChannel?.id || acviteChannel!.id" />
    </div>
  </div>
</template>
./searchMsgTelegram
