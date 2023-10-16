<script setup lang="ts">
import { onMounted, ref } from 'vue'
import getMainColor from './getMainColor'
import useSidebarStore from '@/store/sidebar'

const props = defineProps<{
  src: string
}>()

const imgDom = ref<HTMLImageElement>()

const sidebarStore = useSidebarStore()

onMounted(() => {
  if (!props.src)
    return
  if (imgDom.value && imgDom.value.complete) {
    const color = getMainColor(imgDom.value!)
    sidebarStore.addColors(props.src, color)
  }
  else {
    imgDom.value!.addEventListener('load', () => {
      const color = getMainColor(imgDom.value!)
      sidebarStore.addColors(props.src, color)
    })
  }
})
</script>

<template>
  <div
    h-8 w-8 overflow-hidden rounded-full
  >
    <img ref="imgDom" :src="props.src">
  </div>
</template>
