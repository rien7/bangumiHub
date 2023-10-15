<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import db from '../../../utils/db'
import type { Channel } from '../../../models/Channel'
import SidebarBtn from './SidebarBtn.vue'
import SvgIcon from './SvgIcon.vue'
import ImageIcon from './ImageIcon.vue'
import SidebarGroup from './SidebarGroup.vue'

const expand = ref(false)
provide('expand', expand)

const favouriteChannels = ref<{ id: bigInt.BigInteger; name: string; image: string }[]>([])

onMounted(async () => {
  await updateChannels()
})

window.addEventListener('message', async (event) => {
  if (event.data.type === 'favourite-channels')
    await updateChannels()
})

async function updateChannels() {
  const favouriteChannelStrings = await db.getAll('favourite-channels')
  favouriteChannels.value = favouriteChannelStrings.map((_channel) => {
    const channel = JSON.parse(_channel) as Channel
    return {
      id: channel.id,
      name: channel.title,
      image: `data:image/png;base64,${channel.chatPhoto?.sizes[0].data}`,
    }
  })
}
</script>

<template>
  <div
    :w="expand ? '250px' : '50px'"
    border-r="1px solid gray-200 dark:gray-700"
    shadow="lg gray-200 dark:gray-700"
    relative z-10 h-100vh transition-all
  >
    <SidebarGroup title="Channel" icon="mingcute:horn-line">
      <SidebarBtn
        v-for="channel in favouriteChannels"
        :id="channel.id.toString()" :key="channel.id.toString()" :text="channel.name" :clickable="true"
      >
        <ImageIcon :src="channel.image" />
      </SidebarBtn>
    </SidebarGroup>

    <SidebarBtn
      text="Menu" :clickable="true"
      absolute bottom-0
      @click="expand = !expand"
    >
      <SvgIcon icon="line-md:menu" />
    </SidebarBtn>
  </div>
</template>
