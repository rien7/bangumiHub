<script setup lang='ts'>
import { ref, watch } from 'vue'
import MarkBtn from './MarkBtn.vue'
import useMessageCardStore, { MarkType, markTypeColorMap } from '@/store/messageCard'

const emit = defineEmits(['click'])
const banned = ref(true)
const color = '#059669'

function handleBtnClick() {
  if (!banned.value)
    emit('click')
}

const messageCardStore = useMessageCardStore()
const { markedType } = messageCardStore

watch([markedType], () => {
  banned.value = markedType.length !== markTypeColorMap.size
})
</script>

<template>
  <div flex px-1>
    <MarkBtn :type="MarkType.Subtitle" />
    <MarkBtn :type="MarkType.Title" />
    <MarkBtn :type="MarkType.Episode" />
    <div flex-grow />
    <div
      flex items-center rounded-full px-2 transition-all
      :opacity="banned ? '0' : '100'"
      :cursor="banned ? 'default' : 'pointer'"
      :style="{
        backgroundColor: `${color}66`,
        border: `2px solid ${color}`,
      }"
      @click="handleBtnClick"
    >
      <span select-none text-xs>Done</span>
    </div>
  </div>
</template>
