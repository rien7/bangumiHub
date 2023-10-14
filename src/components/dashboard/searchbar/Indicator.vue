<script setup lang='ts'>
import { ref } from 'vue'
import ImageIcon from '../sidebar/ImageIcon.vue'

const expand = ref(false)
</script>

<template>
  <div
    flex justify-center items-center rounded-full h-10 px-1 overflow-hidden
    bg="gray-200 dark:gray-700"
  >
    <ImageIcon src="https://avatars.githubusercontent.com/u/69343573?v=4" cursor-pointer @click="expand = !expand" />
    <span
      ml-2 mr-1 text-sm select-none
      :w="expand ? 'auto' : '0'"
      :opacity="expand ? '100%' : '0'"
      :m="expand ? '0 auto' : '!0'"
      transition-all duration-100
    >
      {{ 'Username' }}
    </span>
  </div>
</template>
