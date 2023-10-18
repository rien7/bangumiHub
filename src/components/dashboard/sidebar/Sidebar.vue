<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import SidebarBtn from './SidebarBtn.vue'
import SvgIcon from './SvgIcon.vue'
import ImageIcon from './ImageIcon.vue'
import SidebarGroup from './SidebarGroup.vue'
import type Channel from '@/models/Channel'
import db, { StoreNames } from '@/utils/db'
import useGlobalStore from '@/store/global'

const expand = ref(false)
provide('expand', expand)

const globalStore = useGlobalStore()
const favouriteChannels = ref<{ id: bigInt.BigInteger; name: string; image: string }[]>([])
const favouriteMarks = ref<{ id: string; title: string; subTitle?: string; image?: string }[]>([])

onMounted(async () => {
  await updateChannels()
  await updateMarks()
})

window.addEventListener('message', async (event) => {
  if (event.data.type === 'favourite-channels')
    await updateChannels()
  if (event.data.type === 'favourite-marks')
    await updateMarks()
})

async function updateChannels() {
  const favouriteChannelStrings = await db.getAll(StoreNames.FAVOURITE_CHANNELS)
  favouriteChannels.value = favouriteChannelStrings.map((_channel) => {
    const channel = JSON.parse(_channel) as Channel
    return {
      id: channel.id,
      name: channel.title,
      image: `/img/c${channel.chatPhotoId}`,
    }
  })
  if (!globalStore.acviteChannel)
    globalStore.setActiveChannelById(favouriteChannels.value[0]?.id.toString())
}

async function updateMarks() {
  const marks = await db.getAll(StoreNames.FAVOURITE_MARKS)
  favouriteMarks.value = marks.map((mark) => {
    return {
      id: mark.id,
      title: mark.title,
      subTitle: mark.subTitle,
      image: `https://proxy.zrien7.workers.dev/bgm/${mark.image}`,
    }
  })
}
</script>

<template>
  <div
    :w="expand ? '250px' : '50px'"
    border-r="1px solid gray-200 dark:gray-700"
    shadow="lg gray-200 dark:gray-700"
    relative z-10 h-100vh flex flex-col justify-end transition-all
  >
    <SidebarGroup title="Bangumi" icon="mingcute:horn-line">
      <SidebarBtn
        v-for="mark in favouriteMarks"
        :id="mark.id" :key="mark.id" :text="`${mark.subTitle ? `${mark.subTitle}-` : ''}${mark.title}`" :image="mark.image" :clickable="true" :expandable="true"
      >
        <ImageIcon v-if="mark.image" :src="mark.image" />
        <SvgIcon v-else icon="line-md:bookmark" />
      </SidebarBtn>
    </SidebarGroup>
    <SidebarGroup title="Channel" icon="mingcute:horn-line">
      <SidebarBtn
        v-for="channel in favouriteChannels"
        :id="channel.id.toString()" :key="channel.id.toString()" :text="channel.name" :clickable="true" :image="channel.image" :expandable="true"
      >
        <ImageIcon :src="channel.image" />
      </SidebarBtn>
    </SidebarGroup>

    <SidebarBtn
      text="Menu" :clickable="true" :expandable="true"
      @click="expand = !expand"
    >
      <SvgIcon icon="line-md:menu" />
    </SidebarBtn>
  </div>
</template>
