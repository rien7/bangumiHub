import { defineStore } from 'pinia'
import { ref } from 'vue'
import type Channel from '@/models/Channel'
import db, { StoreNames } from '@/utils/db'

const useGlobalStore = defineStore('global', () => {
  const acviteChannel = ref<Channel>()
  const messageQuery = ref<string>('')

  function setActiveChannelById(channelId: string) {
    db.get(StoreNames.FAVOURITE_CHANNELS, channelId).then((_channel) => {
      const channel = JSON.parse(_channel) as Channel
      acviteChannel.value = channel
    })
  }

  function setMessageQuery(query: string) {
    messageQuery.value = query
  }

  return {
    acviteChannel,
    messageQuery,
    setActiveChannelById,
    setMessageQuery,
  }
})

export default useGlobalStore
