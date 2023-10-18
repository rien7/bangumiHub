<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { SESSION_STRING } from './utils/client'
import './utils/worker'

const router = useRouter()
if (!SESSION_STRING)
  router.push('/login')

const datkMode = ref()

onMounted(() => {
  datkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
      datkMode.value = event.matches
    })
})
</script>

<template>
  <div :class="datkMode && 'dark'" h-100vh>
    <router-view />
  </div>
</template>

<style scoped>
  .dark {
    background-color: #121212;
    color: #fff;
  }
</style>
