<script setup lang='ts'>
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue/dist/iconify.js'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import Indicator from './Indicator.vue'
import { getChannel } from './searchChannel'
import type Channel from '@/models/Channel'
import useGlobalStore from '@/store/global'

enum SearchType {
  Messages,
  Channels,
}

const globalStore = useGlobalStore()
const { activeChannel, activeMark } = storeToRefs(globalStore)

const inputField = ref<HTMLInputElement | null>(null)
const currentSearchType = ref(SearchType.Channels)

const route = useRoute()
const router = useRouter()

watch([activeChannel, activeMark], () => {
  if (activeChannel.value || activeMark.value) {
    inputField.value!.value = ''
    globalStore.setMessageQuery('')
    globalStore.setSearchChannel(undefined)
    currentSearchType.value = SearchType.Messages
  }
})

const searchResult = ref<Channel | null>(null)

function switchMessageChannel() {
  if (!activeChannel.value)
    return
  inputField.value!.value = ''
  globalStore.setMessageQuery('')
  globalStore.setSearchChannel(undefined)
  currentSearchType.value = currentSearchType.value === SearchType.Messages ? SearchType.Channels : SearchType.Messages
  globalStore.setCurrentValue(currentSearchType.value === SearchType.Messages ? 'searchMessage' : 'searchChannel')
}

async function handleInputSubmit(_e: KeyboardEvent) {
  if (route.path !== '/')
    router.push('/')
  if (currentSearchType.value === SearchType.Channels) {
    searchResult.value = await getChannel(inputField.value!.value)
    globalStore.setSearchChannel(searchResult.value)
  }
  else {
    const query = inputField.value!.value
    if (!activeChannel.value)
      return
    globalStore.setMessageQuery(query)
    if (query.length === 0)
      globalStore.setCurrentValue('channel')
  }
}
</script>

<template>
  <div
    w-full flex flex-col items-center py-2
  >
    <div z-10 h-50px w-full flex items-center justify-center>
      <div
        rounded="full"
        border="1 gray-200 dark:gray-700"
        shadow="~ gray-200 dark:gray-700"
        bg="white dark:black"
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
          @keyup.enter="handleInputSubmit"
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
