<script setup lang="ts">
import Sidebar from './sidebar/Sidebar.vue'
import Searchbar from './searchbar/Searchbar.vue'
import MainBoard from './mainboard/MainBoard.vue'
</script>

<template>
  <div fixed h-100vh flex>
    <Sidebar />
    <div w-full flex flex-col>
      <Searchbar />
      <MainBoard />
    </div>
  </div>
</template>
