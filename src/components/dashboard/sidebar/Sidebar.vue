<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue/dist/iconify.js'
import { useRouter } from 'vue-router'
import SidebarBtn from './SidebarBtn.vue'
import SvgIcon from './SvgIcon.vue'
import ImageIcon from './ImageIcon.vue'
import SidebarGroup from './SidebarGroup.vue'
import RawBtn from './RawBtn.vue'
import type Channel from '@/models/Channel'
import db, { StoreNames } from '@/utils/db'
import useGlobalStore from '@/store/global'
import { LoginStatus, LoginUtil } from '@/components/login/util'

const expand = ref(false)
provide('expand', expand)

const globalStore = useGlobalStore()
const { darkMode } = storeToRefs(globalStore)

const router = useRouter()

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
    const channel = _channel as Channel
    return {
      id: channel.id,
      name: channel.title,
      image: `/img/c${channel.chatPhotoId}`,
    }
  })
  if (favouriteChannels.value.length === 0) {
    globalStore.setPageErrorMsg('Not following channels yet, try searching for some channels like: ', {
      id: '@AnimeNep',
      action: () => {
        globalStore.setCurrentValue('searchChannel')
        window.postMessage({ type: 'set-searchbar', value: '@AnimeNep' }, location.href)
      },
    })
  }
  if (!globalStore.activeChannel && favouriteChannels.value.length > 0)
    globalStore.setActiveChannelById(favouriteChannels.value[0]?.id.toString())
}

async function updateMarks() {
  const marks = await db.getAll(StoreNames.FAVOURITE_MARKS)
  favouriteMarks.value = marks.map((mark) => {
    return {
      id: mark.id,
      title: mark.title,
      subTitle: mark.subTitle,
      image: mark.image ? `https://proxy.zrien7.workers.dev/bgm/${mark.image}` : undefined,
    }
  })
}

async function handleLogout() {
  db.delete(StoreNames.GENERAL_SETTINGS, 'session')
    .then(() => {
      LoginUtil.SINGLETON.status = LoginStatus.QR_CODE_WAITING
      router.push('/login')
    })
}
</script>

<template>
  <div
    bg="white dark:black"
    :w="expand ? '250px' : '50px'"
    border-r="1px solid gray-200 dark:gray-700"
    shadow="lg gray-200 dark:gray-700"
    relative z-10 h-100vh flex flex-col justify-end transition-all
  >
    <SidebarGroup v-if="favouriteMarks.length > 0" title="Bangumi" icon="line-md:star-filled">
      <SidebarBtn
        v-for="mark in favouriteMarks"
        :id="mark.id"
        :key="mark.id" type="mark" :image="mark.image" :clickable="true" :expandable="true"
      >
        <ImageIcon v-if="mark.image" :src="mark.image" />
        <div v-else h-8 w-8>
          <span leading-8>{{ mark.title[0] }}</span>
        </div>
        <template #context>
          {{ `${mark.subTitle ? `${mark.subTitle}-` : ''}${mark.title}` }}
        </template>
      </SidebarBtn>
    </SidebarGroup>
    <SidebarGroup v-if="favouriteChannels.length > 0" title="Channel" icon="mingcute:horn-line">
      <SidebarBtn
        v-for="channel in favouriteChannels"
        :id="channel.id.toString()"
        :key="channel.id.toString()" type="channel" :clickable="true" :image="channel.image" :expandable="true"
      >
        <ImageIcon :src="channel.image" />
        <template #context>
          {{ channel.name }}
        </template>
      </SidebarBtn>
    </SidebarGroup>

    <SidebarBtn
      :clickable="true" :expandable="true"
    >
      <SvgIcon icon="line-md:menu" @click="expand = !expand" />
      <template #context>
        <div w-full flex justify-between px-2>
          <RawBtn h-8 w-8 @click="globalStore.switchDarkMode()">
            <Icon h-4 w-4 :icon="darkMode === 'light' ? 'iconamoon:mode-light-duotone' : darkMode === 'dark' ? 'iconamoon:mode-dark-duotone' : 'ic:round-auto-awesome'" />
          </RawBtn>
          <a href="https://github.com/rien7/bangumiHub">
            <RawBtn h-8 w-8>
              <Icon h-4 w-4 icon="line-md:github-twotone" />
            </RawBtn>
          </a>
          <a href="https://t.me/BangumiHub">
            <RawBtn h-8 w-8>
              <Icon h-4 w-4 icon="fa6-brands:telegram" />
            </RawBtn>
          </a>
          <RawBtn h-8 w-8 @click="handleLogout">
            <Icon h-4 w-4 icon="line-md:logout" />
          </RawBtn>
        </div>
      </template>
    </SidebarBtn>
  </div>
</template>
