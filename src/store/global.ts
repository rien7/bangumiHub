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

  const darkMode = ref<'dark' | 'light' | 'auto'>('auto')
  const pageErrorMsg = ref<string>('')
  const pageErrorClick = ref<{ id: string; action: () => void } | undefined>()

  function setCurrentValue(val: 'channel' | 'searchMessage' | 'searchChannel' | 'mark') {
    currentValue.value = val
  }

  function setPageErrorMsg(msg: string, errorClick?: { id: string; action: () => void }) {
    pageErrorMsg.value = msg
    pageErrorClick.value = errorClick
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
  }

  function setDarkMode(mode: 'dark' | 'light' | 'auto') {
    darkMode.value = mode
  }

  function switchDarkMode() {
    if (darkMode.value === 'auto')
      darkMode.value = 'light'
    else if (darkMode.value === 'light')
      darkMode.value = 'dark'
    else
      darkMode.value = 'auto'
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
    darkMode,
    setDarkMode,
    switchDarkMode,
    pageErrorMsg,
    pageErrorClick,
    setPageErrorMsg,
  }
})

export default useGlobalStore
