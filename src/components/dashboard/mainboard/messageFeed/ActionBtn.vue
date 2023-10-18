<script setup lang='ts'>
import { Icon } from '@iconify/vue/dist/iconify.js'

const props = defineProps<{
  icons: string[]
  highlightIndex?: number
}>()

const emit = defineEmits(['click'])

function handleClick(e: MouseEvent) {
  e.stopPropagation()
  emit('click')
}
</script>

<template>
  <div
    relative
    class="group"
    hover:ring="2 gray-600 dark:gray-300"
    bg="gray-200/80 dark:gray-700/80 hover:gray-100/90 dark:hover:gray-800/90"
    m-1 flex cursor-pointer gap-1 rounded-full
    @click="handleClick"
  >
    <div
      v-if="highlightIndex !== undefined"
      absolute h-6 w-6
      :position="highlightIndex === 0 ? 'left-0' : 'left-7'"
      bg="rose-400 group-hover:rose-500"
      rounded-full transition-all
      ring="group-hover:2 group-hover:rose-300"
    />
    <div
      v-for="(icon, index) in props.icons" :key="index" z-1
      h-6 w-6 flex items-center justify-center p-1.25
    >
      <Icon :icon="icon" :color="highlightIndex === index ? 'white' : ''" transition />
    </div>
  </div>
</template>
