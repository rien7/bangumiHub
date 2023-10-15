<script setup lang="ts">
const props = defineProps<{
  src: string
}>()
</script>

<template>
  <div
    h-8 w-8 overflow-hidden rounded-full
  >
    <img :src="props.src">
  </div>
</template>
