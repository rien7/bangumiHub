<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { SESSION_STRING } from './utils/client'
import './utils/worker'

const router = useRouter()
if (!SESSION_STRING)
  router.push('/login')

const datkMode = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)
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
