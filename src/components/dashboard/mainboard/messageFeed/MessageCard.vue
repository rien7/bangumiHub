<script setup lang='ts'>
import Message from '@/models/Message'

const props = defineProps({
  message: Message,
})
</script>

<template>
  <div class="message-card" w-80 flex flex-col overflow-hidden rounded-md shadow="gray-200 dark:gray-700">
    <div h-45 w-full overflow-hidden>
      <img :src="`/img/m${props.message?.mediaId}`" class="h-full w-full">
    </div>
    <div h-22 w-full bg-gray-100 px-4 py-2 dark:bg-gray-800>
      <div line-clamp-3>
        <span>{{ props.message!.message }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
div[rounded-md] {
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
  -webkit-border-bottom-left-radius: 0.375rem;
  -webkit-border-bottom-right-radius: 0.375rem;
  -moz-border-bottom-left-radius: 0.375rem;
  -moz-border-bottom-right-radius: 0.375rem;
}
.message-card {
  -webkit-box-shadow: var(--un-shadow-inset) 0 0 8px 1px var(--un-shadow-color, rgba(0,0,0,0.1));
  -moz-box-shadow: var(--un-shadow-inset) 0 0 8px 1px var(--un-shadow-color, rgba(0,0,0,0.1));
  box-shadow: var(--un-shadow-inset) 0 0 8px 1px var(--un-shadow-color, rgba(0,0,0,0.1));
}
</style>
