<script setup lang='ts'>
import { ref, watch } from 'vue'
import type { MarkType } from '@/store/messageCard'
import useMessageCardStore, { markTypeColorMap } from '@/store/messageCard'

const props = defineProps<{
  type: MarkType
}>()
const messageCardStore = useMessageCardStore()
const { markedType } = messageCardStore
const color = markTypeColorMap.get(props.type)!
const hover = ref(false)
const clicked = ref(false)
const banned = ref(false)

watch([markedType], () => {
  if (markedType.includes(props.type)) {
    clicked.value = false
    banned.value = true
  }
  else {
    banned.value = false
  }
})

function click() {
  if (!clicked.value)
    messageCardStore.setMarking(props.type, color)
  clicked.value = !clicked.value
}
</script>

<template>
  <div
    flex items-center rounded-full px-2 transition-all
    :cursor="banned ? 'default' : 'pointer'"
    :style="{
      backgroundColor: !banned && (hover || clicked) ? `${color}66` : 'transparent',
      border: hover && !banned ? `2px solid ${color}` : '2px solid transparent',
    }"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    @click="click"
  >
    <div
      mr-2 h-3 w-3 rounded-full
      :style="{
        backgroundColor: !banned ? color : `${color}22`,
      }"
    />
    <span select-none text-xs>{{ props.type }}</span>
  </div>
</template>
