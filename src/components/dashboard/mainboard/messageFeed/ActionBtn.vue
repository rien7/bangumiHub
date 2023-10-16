<script setup lang='ts'>
import { Icon } from '@iconify/vue/dist/iconify.js'

const props = defineProps<{
  icon: string
}>()

defineEmits(['click'])
</script>

<template>
  <div
    bg="gray-200/80 dark:gray-700/80 hover:gray-300/80 dark:hover:gray-600/80"
    m-1 h-8 w-8 flex cursor-pointer items-center justify-center rounded-full p-1
    hover:ring="2 gray-600 dark:gray-300"
    @click="$emit('click')"
  >
    <Icon :icon="props.icon" />
  </div>
</template>
