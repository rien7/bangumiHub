<script setup lang="ts">
import { onMounted, ref } from 'vue'
import getMainColor from './getMainColor'

const props = defineProps<{
  src: string
}>()

const imgDom = ref<HTMLImageElement>()
const color = ref<string>()
onMounted(() => {
  if (!props.src)
    return
  if (imgDom.value && imgDom.value.complete) {
    color.value = getMainColor(imgDom.value!)
    postMessage({ type: 'sidebar-color', url: props.src, color: color.value }, location.href)
  }
  else {
    imgDom.value!.addEventListener('load', () => {
      color.value = getMainColor(imgDom.value!)
      postMessage({ type: 'sidebar-color', url: props.src, color: color.value }, location.href)
    })
  }
})
</script>

<template>
  <div
    h-8 w-8 overflow-hidden rounded-full
  >
    <img ref="imgDom" :src="props.src" :color="color">
  </div>
</template>
