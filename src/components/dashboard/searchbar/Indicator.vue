<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import ImageIcon from '../sidebar/ImageIcon.vue'
import db from '../../../utils/db'
import type { Channel } from '../../../models/Channel'

const expand = ref(false)
const defaultImage = 'https://avatars.githubusercontent.com/u/68459896?v=4'

const selectingChannel = ref<{ name: string; image: string }>()

window.addEventListener('message', async (event) => {
  if (event.data.type === 'selecting-channel')
    getSelectedChannel()
})

onMounted(() => {
  getSelectedChannel()
})

async function getSelectedChannel() {
  const channelId = await db.get('general-settings', 'selecting-channel')
  if (!channelId) {
    selectingChannel.value = {
      name: '',
      image: defaultImage,
    }
  }
  const _channel = await db.get('favourite-channels', channelId)
  const channel = JSON.parse(_channel) as Channel
  selectingChannel.value = {
    name: channel.title,
    image: `data:image/png;base64,${channel.chatPhoto?.sizes[0].data}`,
  }
}
</script>

<template>
  <div
    h-10 flex items-center justify-center overflow-hidden rounded-full px-1
    bg="gray-200 dark:gray-700"
    @mouseenter="expand = true"
    @mouseleave="expand = false"
  >
    <ImageIcon :src="selectingChannel?.image || ''" />
    <span
      :w="expand ? 'auto' : '0'"
      :opacity="expand ? '100%' : '0'"
      :m="expand ? '0 auto' : '!0'"
      ml-2 mr-1 select-none text-sm transition-all duration-100
    >
      {{ selectingChannel?.name }}
    </span>
  </div>
</template>
