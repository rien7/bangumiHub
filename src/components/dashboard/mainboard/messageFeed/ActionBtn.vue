<script setup lang='ts'>
import { Icon } from '@iconify/vue/dist/iconify.js'

const props = defineProps<{
  icons: string[]
  highlightIndex?: number
  highlightColor?: [string, string, string]
}>()

const emit = defineEmits(['click'])

function handleClick(e: MouseEvent) {
  e.stopPropagation()
  emit('click')
}
</script>

<template>
  <div
    class="group"
    outline="2px solid transparent"
    hover:outline=" gray-600 dark:gray-300"
    bg="gray-200/80 dark:gray-700/80 hover:gray-100/90 dark:hover:gray-800/90"
    relative m-1 flex cursor-pointer gap-1 rounded-full transition-all duration-300
    @click="handleClick"
  >
    <div
      v-if="highlightIndex !== undefined"
      absolute h-6 w-6
      :position="highlightIndex === 0 ? 'left-0' : 'left-7'"
      rounded-full transition-all duration-300
      outline="2px solid"
      :style="`
        --color: ${highlightColor ? `${highlightColor[0]} !important` : '#f43f5e'};
        --color1: ${highlightColor ? `${highlightColor[1]} !important` : '#fb7185'};
        --color2: ${highlightColor ? `${highlightColor[2]} !important` : '#f43f5e'}
      `"
    />
    <div
      v-for="(icon, index) in props.icons" :key="index" z-1
      h-6 w-6 flex items-center justify-center p-1.25
    >
      <Icon :icon="icon" :color="highlightIndex === index ? 'white' : ''" transition />
    </div>
  </div>
</template>

<style scoped>
div[absolute] {
  background-color: var(--color1);
  outline-color: var(--color2);
}
.group:hover div[absolute] {
  background-color: var(--color);
  outline-color: var(--color1);
}
</style>
