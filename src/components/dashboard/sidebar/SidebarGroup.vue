<script setup lang="ts">
import { defineProps, provide, ref } from 'vue'
import SidebarBtn from './SidebarBtn.vue'
import SvgIcon from './SvgIcon.vue'

const props = defineProps<{
  title: string
  icon: string
}>()

const hover = ref(false)
provide('groupHover', hover)
</script>

<template>
  <SidebarBtn
    :text="props.title" :clickable="false"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <SvgIcon :icon="props.icon" />
  </SidebarBtn>
  <slot />
</template>
