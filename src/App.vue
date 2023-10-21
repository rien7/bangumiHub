<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { SESSION_STRING } from './utils/client'
import './utils/worker'
import useGlobalStore from './store/global'

const router = useRouter()
if (!SESSION_STRING)
  router.push('/login')

const dark = ref()

const globalStore = useGlobalStore()
const { darkMode } = storeToRefs(globalStore)

watch([darkMode], () => {
  if (darkMode.value === 'auto') {
    dark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        dark.value = event.matches
      })
  }
  else {
    window.matchMedia('(prefers-color-scheme: dark)')
      .removeEventListener('change', () => {})
    if (darkMode.value === 'dark')
      dark.value = true
    else
      dark.value = false
  }
})
</script>

<template>
  <div fixed h-full w-full :class="dark && 'dark'">
    <router-view />
  </div>
</template>

<style scoped>
  .dark {
    background-color: #121212;
    color: #fff;
  }
</style>
