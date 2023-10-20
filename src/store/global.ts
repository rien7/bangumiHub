import { defineStore } from 'pinia'
import { ref } from 'vue'
import type Channel from '@/models/Channel'
import db, { StoreNames } from '@/utils/db'
import type MarkData from '@/models/MarkData'

const useGlobalStore = defineStore('global', () => {
  const currentValue = ref<'channel' | 'searchMessage' | 'searchChannel' | 'mark'>('channel')
  const activeChannel = ref<Channel>()
  const messageQuery = ref<string>('')
  const searchChannel = ref<Channel | undefined>(undefined)
  const activeMark = ref<MarkData | undefined>(undefined)

  function setCurrentValue(val: 'channel' | 'searchMessage' | 'searchChannel' | 'mark') {
    currentValue.value = val
  }

  async function setActiveChannelById(channelId: string) {
    await db.get(StoreNames.FAVOURITE_CHANNELS, channelId).then((_channel) => {
      const channel = _channel as Channel
      searchChannel.value = undefined
      activeMark.value = undefined
      channel.favorite = true
      currentValue.value = 'channel'
      activeChannel.value = channel
    })
  }

  async function setActiveMarkById(markId: string) {
    await db.get(StoreNames.FAVOURITE_MARKS, markId).then((_mark) => {
      const mark = _mark as MarkData
      activeMark.value = mark
      currentValue.value = 'mark'
      searchChannel.value = undefined
    })
  }

  function clearActiveMark() {
    activeMark.value = undefined
  }

  function setMessageQuery(query: string) {
    if (query !== '')
      currentValue.value = 'searchMessage'
    messageQuery.value = query
  }

  function setSearchChannel(channel: Channel | undefined) {
    if (channel)
      currentValue.value = 'searchChannel'
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
    currentValue,
    setCurrentValue,
  }
})

export default useGlobalStore
