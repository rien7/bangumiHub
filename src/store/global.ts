import { defineStore } from 'pinia'
import { ref } from 'vue'
import type Channel from '@/models/Channel'
import db, { StoreNames } from '@/utils/db'

const useGlobalStore = defineStore('global', () => {
  const acviteChannel = ref<Channel>()
  const messageQuery = ref<string>('')
  const searchChannel = ref<Channel | null>(null)

  async function setActiveChannelById(channelId: string) {
    await db.get(StoreNames.FAVOURITE_CHANNELS, channelId).then((_channel) => {
      const channel = JSON.parse(_channel) as Channel
      acviteChannel.value = channel
    })
    searchChannel.value = null
  }

  function setMessageQuery(query: string) {
    messageQuery.value = query
  }

  function setSearchChannel(channel: Channel | null) {
    searchChannel.value = channel
  }

  return {
    acviteChannel,
    messageQuery,
    searchChannel,
    setActiveChannelById,
    setMessageQuery,
    setSearchChannel,
  }
})

export default useGlobalStore
