<script setup lang='ts'>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import ImageIcon from '../sidebar/ImageIcon.vue'
import useGlobalStore from '@/store/global'

const expand = ref(false)

const globalStore = useGlobalStore()
const { activeChannel, activeMark } = storeToRefs(globalStore)
</script>

<template>
  <div
    h-10 flex items-center justify-center overflow-hidden rounded-full px-1
    bg="gray-200 dark:gray-700"
    @mouseenter="expand = true"
    @mouseleave="expand = false"
  >
    <ImageIcon v-if="(activeMark && activeMark.image) || !activeMark" :src="!activeMark ? `/img/c${activeChannel?.chatPhotoId}` : `https://proxy.zrien7.workers.dev/bgm/${activeMark!.image}`" />
    <div v-else h-8 w-8 flex justify-center rounded-full bg="gray-400 dark:gray-500">
      <span select-none leading-8>{{ activeMark.title[0] }}</span>
    </div>
    <span
      :w="expand ? 'auto' : '0'"
      :opacity="expand ? '100%' : '0'"
      :m="expand ? '0 auto' : '!0'"
      ml-2 mr-1 select-none text-sm transition-all duration-100
    >
      {{ activeMark?.title || activeChannel?.title }}
    </span>
  </div>
</template>
