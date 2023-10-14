<script setup lang='ts'>
import { ref } from 'vue'
import { Icon } from '@iconify/vue/dist/iconify.js'
import Indicator from './Indicator.vue'

enum SearchType {
  Messages,
  Channels,
}

const inputField = ref<HTMLInputElement | null>(null)
const currentSearchType = ref(SearchType.Messages)

function switchMessageChannel() {
  inputField.value!.value = ''
  currentSearchType.value = currentSearchType.value === SearchType.Messages ? SearchType.Channels : SearchType.Messages
}
</script>

<template>
  <div z-1 h-50px w-full flex justify-center items-center>
    <div
      relative flex
      w-full h-12 px-1
      max-w-500px
      rounded-full items-center
      border="1px solid gray-200 dark:gray-700"
      shadow="~ gray-200 dark:gray-700"
      overflow-hidden
    >
      <Transition name="from-left">
        <Indicator v-if="currentSearchType === SearchType.Messages" />
      </Transition>
      <input
        ref="inputField"
        bg-transparent h-full flex-grow
        px-2
        border="none hover:none focus:none"
        outline="none hover:none focus:none"
        type="text"
      >
      <div
        bg="gray-200 dark:gray-700 hover:gray-300 hover:dark:gray-600" p-2 rounded-full mr-1
        cursor-pointer transition
        @click="switchMessageChannel"
      >
        <Icon width="20px" :icon="currentSearchType === SearchType.Messages ? 'mingcute:message-3-line' : 'mingcute:horn-line'" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.from-left-enter-from,
.from-left-leave-to {
  transform: translateX(-100%);
}
.from-left-enter-to,
.from-left-leave-from {
  transform: translateX(0);
}
.from-left-enter-active,
.from-left-leave-active {
  transition: transform 0.3s;
}
</style>
