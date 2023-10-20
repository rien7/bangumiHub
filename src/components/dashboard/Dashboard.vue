<script setup lang="ts">
import Sidebar from './sidebar/Sidebar.vue'
import Searchbar from './searchbar/Searchbar.vue'
</script>

<template>
  <div fixed h-full w-full flex>
    <Sidebar />
    <div w-full flex flex-col>
      <Searchbar />
      <router-view />
    </div>
  </div>
</template>
