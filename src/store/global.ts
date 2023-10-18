import { defineStore } from 'pinia'
import { ref } from 'vue'
import type Channel from '@/models/Channel'
import db, { StoreNames } from '@/utils/db'
import type MarkData from '@/models/MarkData'

const useGlobalStore = defineStore('global', () => {
  const activeChannel = ref<Channel>()
  const messageQuery = ref<string>('')
  const searchChannel = ref<Channel | undefined>(undefined)
  const activeMark = ref<MarkData | undefined>(undefined)

  async function setActiveChannelById(channelId: string) {
    searchChannel.value = undefined
    activeMark.value = undefined
    db.get(StoreNames.FAVOURITE_CHANNELS, channelId).then((_channel) => {
      const channel = _channel as Channel
      channel.favorite = true
      activeChannel.value = channel
    })
  }

  async function setActiveMarkById(markId: string) {
    searchChannel.value = undefined
    db.get(StoreNames.FAVOURITE_MARKS, markId).then((_mark) => {
      const mark = _mark as MarkData
      activeMark.value = mark
    })
  }

  function clearActiveMark() {
    activeMark.value = undefined
  }

  function setMessageQuery(query: string) {
    messageQuery.value = query
  }

  function setSearchChannel(channel: Channel | undefined) {
    searchChannel.value = channel
    activeMark.value = undefined
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
