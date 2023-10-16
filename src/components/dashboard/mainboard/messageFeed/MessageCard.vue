<script setup lang='ts'>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import ActionBtn from './ActionBtn.vue'
import MarkTool from './markTools/MarkTool.vue'
import SelectText from './markTools/SelectText.vue'
import type Message from '@/models/Message'
import useMessageCardStore from '@/store/messageCard'

const props = defineProps<{
  message: Message
}>()

const messageCardStore = useMessageCardStore()
const { markingColor } = storeToRefs(messageCardStore)

const hoverImg = ref(false)
const markingTitleMeta = ref(false)
const delay300 = ref(false)

watch([markingTitleMeta], () => {
  if (markingTitleMeta.value) {
    setTimeout(() => {
      delay300.value = true
    }, 300)
  }
  else {
    delay300.value = false
  }
})

function click() {
  markingTitleMeta.value = !markingTitleMeta.value
  if (!markingTitleMeta.value)
    messageCardStore.clear()
  else
    messageCardStore.setMarkingCardId(props.message.id)
}
</script>

<template>
  <div class="message-card" relative h-67 w-80 flex flex-col overflow-hidden rounded-md shadow="gray-200 dark:gray-700">
    <div
      relative h-45 w-full overflow-hidden
      @mouseenter="hoverImg = true"
      @mouseleave="hoverImg = false"
    >
      <img :src="`/img/m${props.message?.mediaId}`" class="h-full w-full" absolute top-0>
      <div absolute right-0 top-0>
        <ActionBtn
          icon="material-symbols:format-image-left-rounded"
          :opacity="hoverImg || markingTitleMeta ? '100' : '0'"
          transition
          @click="click"
        />
      </div>
    </div>
    <div
      bg="gray-100 dark:gray-800"
      :h="markingTitleMeta ? '46' : '22'"
      absolute bottom-0
      w-full px-4 py-2 transition-all duration-300
    >
      <div
        :line-clamp="markingTitleMeta ? 7 : 3"
        :selection="markingTitleMeta"
      >
        <span v-if="!delay300">{{ props.message!.message }}</span>
        <SelectText v-else :text="props.message!.message" :color="markingColor" />
      </div>
    </div>
    <Transition name="from-bottom">
      <MarkTool v-if="markingTitleMeta" absolute bottom-0 h-6 w-full />
    </Transition>
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

.from-bottom-enter-from,
.from-bottom-leave-to {
  transform: translateY(100%);
}

.from-bottom-enter-to,
.from-bottom-leave-from {
  transform: translateY(0);
}

.from-bottom-enter-active,
.from-bottom-leave-active {
  transition: transform 300ms;
}
</style>
