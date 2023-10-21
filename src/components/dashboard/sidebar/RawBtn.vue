<script setup lang='ts'>
defineEmits(['click'])
</script>

<template>
  <div
    cursor="pointer"
    flex items-center justify-center rounded-full transition-all
    bg="hover:gray-200 dark:hover:gray-700"
    outline="hover:2px hover:solid gray-300"
    @click="$emit('click')"
  >
    <slot />
  </div>
</template>
