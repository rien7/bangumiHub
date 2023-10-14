<script setup lang="ts">
import { useRouter } from 'vue-router'
import { SESSION_STRING } from './utils/client'

const router = useRouter()
if (!SESSION_STRING)
  router.push('/login')
</script>

<template>
  <router-view />
</template>
