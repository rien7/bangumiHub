<script setup lang="ts">
import SidebarBtn from './SidebarBtn.vue'
import SvgIcon from './SvgIcon.vue'

const props = defineProps<{
  title: string
  icon: string
}>()
</script>

<template>
  <SidebarBtn
    :clickable="false" :expandable="false"
  >
    <SvgIcon :icon="props.icon" />
    <template #context>
      {{ props.title }}
    </template>
  </SidebarBtn>
  <slot />
</template>
