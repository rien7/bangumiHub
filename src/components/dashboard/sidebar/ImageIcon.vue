<script setup lang="ts">
const props = defineProps<{
  src: string
}>()
</script>

<template>
  <div
    w-8 h-8
    rounded-full
    overflow-hidden
  >
    <img :src="props.src">
  </div>
</template>
