<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import type { MarkType } from '@/store/messageCard'
import useMessageCardStore from '@/store/messageCard'

const props = defineProps<{
  color: string | null
  type: MarkType | null
  text: string
}>()

const messageCardStore = useMessageCardStore()
const { markingSelections } = storeToRefs(messageCardStore)
const span = ref<HTMLSpanElement>()

onMounted(() => {
  messageCardStore.setSelection([{
    text: props.text,
    color: null,
    type: null,
  }])
})

function getOffset() {
  const dom = span.value
  if (!dom)
    return
  const children = dom.childNodes
  const offset: Map<string | null, number> = new Map()
  let last = 0
  for (let i = 0; i < children.length; i++) {
    offset.set(children[i].textContent, last)
    last += children[i].textContent!.length
  }
  return offset
}

function onMouseUpHandler() {
  const selectionObj: Selection | null = (window.getSelection && window.getSelection())
  if (!selectionObj)
    return

  const selection = selectionObj.toString()
  const anchorNode = selectionObj.anchorNode
  const focusNode = selectionObj.focusNode
  const anchorOffset = selectionObj.anchorOffset
  const focusOffset = selectionObj.focusOffset
  if (!anchorNode || !focusNode || selection.length === 0)
    return

  const offsets = getOffset()
  if (!offsets)
    return

  if (!props.color)
    return

  const position = anchorNode.compareDocumentPosition(focusNode)
  let forward = false
  if (position === anchorNode.DOCUMENT_POSITION_FOLLOWING) {
    forward = true
  }
  else if (position === 0) { // same node
    forward = (focusOffset - anchorOffset) > 0
  }

  const anchorNodeOffset = offsets.get(anchorNode.textContent) || 0
  const focusNodeOffset = offsets.get(focusNode.textContent) || 0

  const selectionStart = forward ? anchorOffset + anchorNodeOffset : focusOffset + focusNodeOffset
  const selectionEnd = selectionStart + selection.length

  const selections = markingSelections.value
  let count = 0
  const newSelections: { text: string; color: string | null; type: MarkType | null }[] = []
  for (const [index, selection] of selections.entries()) {
    if (selectionStart >= count && selectionEnd <= count + selection.text.length) {
      newSelections.push({
        text: selection.text.slice(0, selectionStart - count),
        color: null,
        type: null,
      })
      newSelections.push({
        text: selection.text.slice(selectionStart - count, selectionEnd - count),
        color: props.color,
        type: props.type,
      })
      newSelections.push({
        text: selection.text.slice(selectionEnd - count),
        color: null,
        type: null,
      })
      newSelections.push(...selections.slice(index + 1))
      messageCardStore.setSelection(newSelections)
      return
    }
    else {
      newSelections.push(selection)
    }
    count += selection.text.length
  }
}

onMounted(() => {
  span.value?.addEventListener('mouseup', onMouseUpHandler)
})
</script>

<template>
  <div ref="span">
    <span
      v-for="(selection, index) in markingSelections"
      :key="index"
      :cursor="selection.color ? 'pointer' : 'text'"
      :style="{ backgroundColor: selection.color ? `${selection.color}aa` : undefined }"
      :select="selection.color ? 'none' : 'auto'"
      :rounded="selection.color ? 'md' : 'none'"
      :px="selection.color ? '1' : '0'"
      @click="selection.color ? messageCardStore.removeSelection(selection.text) : undefined"
    >
      {{ selection.text }}
    </span>
  </div>
</template>
