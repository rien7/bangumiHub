<script setup lang='ts'>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import ImageIcon from '../sidebar/ImageIcon.vue'
import useGlobalStore from '@/store/global'

const expand = ref(false)

const globalStore = useGlobalStore()
const { acviteChannel } = storeToRefs(globalStore)
</script>

<template>
  <div
    h-10 flex items-center justify-center overflow-hidden rounded-full px-1
    bg="gray-200 dark:gray-700"
    @mouseenter="expand = true"
    @mouseleave="expand = false"
  >
    <ImageIcon :src="`/img/c${acviteChannel?.chatPhotoId}`" />
    <span
      :w="expand ? 'auto' : '0'"
      :opacity="expand ? '100%' : '0'"
      :m="expand ? '0 auto' : '!0'"
      ml-2 mr-1 select-none text-sm transition-all duration-100
    >
      {{ acviteChannel?.title }}
    </span>
  </div>
</template>
