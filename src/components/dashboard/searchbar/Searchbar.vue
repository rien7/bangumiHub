<script setup lang='ts'>
import { ref } from 'vue'
import { Icon } from '@iconify/vue/dist/iconify.js'
import type { Channel } from '../../../models/Channel'
import Indicator from './Indicator.vue'
import ChannelSkeleton from './ChannelSkeleton.vue'
import { getChannel } from './searchChannel'
import ChannelResult from './ChannelResult.vue'
import searchMsgTelegram from './searchMsgTelegram'
import db, { StoreNames } from '@/utils/db'
import type Channel from '@/models/Channel'

enum SearchType {
  Messages,
  Channels,
}

enum SearchState {
  Idle,
  Searching,
  Done,
}

const inputField = ref<HTMLInputElement | null>(null)
const currentSearchType = ref(SearchType.Messages)

const searching = ref(SearchState.Idle)
const searchResult = ref<Channel | null>(null)

function switchMessageChannel() {
  inputField.value!.value = ''
  currentSearchType.value = currentSearchType.value === SearchType.Messages ? SearchType.Channels : SearchType.Messages
}

async function handleInputSubmit(e: KeyboardEvent) {
  if (e.key !== 'Enter')
    return
  if (currentSearchType.value === SearchType.Channels) {
    searching.value = SearchState.Searching
    searchResult.value = await getChannel(inputField.value!.value)
    searching.value = SearchState.Done
  }
}
</script>

<template>
  <div mt-2 w-full flex flex-col items-center>
    <div z-1 h-50px w-full flex items-center justify-center>
      <div
        :rounded="searching !== SearchState.Idle ? 't-25px' : 'full'"
        border="1 gray-200 dark:gray-700"
        shadow="~ gray-200 dark:gray-700"
        relative h-12 max-w-500px w-full flex items-center overflow-hidden px-1
      >
        <Transition name="from-left">
          <Indicator v-if="currentSearchType === SearchType.Messages" />
        </Transition>
        <input
          ref="inputField"
          h-full flex-grow bg-transparent px-2
          border="none hover:none focus:none"
          outline="none hover:none focus:none"
          type="text"
          @keyup="handleInputSubmit"
        >
        <div
          bg="gray-200 dark:gray-700 hover:gray-300 hover:dark:gray-600"
          mr-1 cursor-pointer rounded-full p-2 transition
          @click="switchMessageChannel"
        >
          <Icon width="20px" :icon="currentSearchType === SearchType.Messages ? 'mingcute:message-3-line' : 'mingcute:horn-line'" />
        </div>
      </div>
    </div>
    <div v-if="searching !== SearchState.Idle" translate-y="-1px" border="1 gray-200 dark:gray-700" max-w-500px w-full rounded-b-md p-2>
      <ChannelSkeleton v-if="searching === SearchState.Searching" />
      <ChannelResult v-else :channel="searchResult!" />
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
