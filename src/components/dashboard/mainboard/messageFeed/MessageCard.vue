<script setup lang='ts'>
import Message from '@/models/Message'

const props = defineProps({
  message: Message,
})
</script>

<template>
  <div w-80 flex flex-col>
    <div h-45 w-full overflow-hidden rounded-t-md>
      <img :src="`/img/m${props.message?.mediaId}`" class="h-full w-full">
    </div>
    <div h-22 w-full rounded-b-md bg-gray-100 px-4 py-2 dark:bg-gray-800>
      <div line-clamp-3>
        <span>{{ props.message!.message }}</span>
      </div>
    </div>
  </div>
</template>
