import { defineStore } from 'pinia'
import { ref } from 'vue'
import type Channel from '@/models/Channel'
import db, { StoreNames } from '@/utils/db'
import type MarkData from '@/models/MarkData'

const useGlobalStore = defineStore('global', () => {
  const activeChannel = ref<Channel>()
  const messageQuery = ref<string>('')
  const searchChannel = ref<Channel | null>(null)
  const activeMark = ref<MarkData | null>(null)

  async function setActiveChannelById(channelId: string) {
    await db.get(StoreNames.FAVOURITE_CHANNELS, channelId).then((_channel) => {
      const channel = _channel as Channel
      channel.favorite = true
      activeChannel.value = channel
    })
    searchChannel.value = null
    activeMark.value = null
  }

  async function setActiveMarkById(markId: string) {
    await db.get(StoreNames.FAVOURITE_MARKS, markId).then((_mark) => {
      const mark = _mark as MarkData
      activeMark.value = mark
    })
    searchChannel.value = null
  }

  function clearActiveMark() {
    activeMark.value = null
  }

  function setMessageQuery(query: string) {
    messageQuery.value = query
  }

  function setSearchChannel(channel: Channel | null) {
    searchChannel.value = channel
    activeMark.value = null
  }

  return {
    activeChannel,
    messageQuery,
    searchChannel,
    activeMark,
    setActiveChannelById,
    setMessageQuery,
    setSearchChannel,
    setActiveMarkById,
    clearActiveMark,
  }
})

export default useGlobalStore
