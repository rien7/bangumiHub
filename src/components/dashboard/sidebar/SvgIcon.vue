<script setup lang="ts">
import { Icon } from '@iconify/vue'

const props = defineProps<{
  icon: string
}>()
</script>

<template>
  <div p-2>
    <Icon :icon="props.icon" />
  </div>
</template>
