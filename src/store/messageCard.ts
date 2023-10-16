import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import { reactive, ref } from 'vue'

enum MarkType {
  Subtitle = 'Subtitle',
  Title = 'Title',
  Episode = 'Episode',
}

const markTypeColorMap = new Map<MarkType, string>([
  [MarkType.Subtitle, '#60a5fa'],
  [MarkType.Title, '#ef4444'],
  [MarkType.Episode, '#4ade80'],
])

const useMessageCardStore = defineStore('messageCard', () => {
  const markingCardId: Ref<number | null> = ref(null)
  const markingType: Ref<MarkType | null> = ref(null)
  const markingColor: Ref<string | null> = ref(null)
  const markedType: MarkType[] = reactive([])
  const markingSelections: Ref<{ text: string; color: string | null }[]> = ref([])

  function setMarkingCardId(id: number) {
    markingCardId.value = id
  }

  function setMarking(type: MarkType | null, color: string | null) {
    markingType.value = type
    markingColor.value = color
  }

  function setSelection(selection: { text: string; color: string | null }[]) {
    markingSelections.value = selection
    markedType.push(markingType.value as MarkType)
    setMarking(null, null)
  }

  function removeSelection(text: string) {
    const index = markingSelections.value.findIndex(selection => selection.text === text)
    const color = markingSelections.value[index].color
    markingSelections.value[index].color = null
    let type: MarkType | null = null
    for (const [key, value] of markTypeColorMap) {
      if (value === color) {
        type = key
        break
      }
    }
    if (type)
      markedType.splice(markedType.indexOf(type), 1)
    const newMarkingSelections = []
    let tempText = ''
    for (const selection of markingSelections.value) {
      if (selection.color !== null) {
        if (tempText !== '') {
          newMarkingSelections.push({ text: tempText, color: null })
          tempText = ''
        }
        newMarkingSelections.push(selection)
      }
      else { tempText += selection.text }
    }
    if (tempText !== '')
      newMarkingSelections.push({ text: tempText, color: null })
    markingSelections.value = newMarkingSelections
  }

  function clear() {
    markingCardId.value = null
    markingType.value = null
    markingColor.value = null
    markingSelections.value = []
  }

  return {
    markingCardId,
    markedType,
    markingType,
    markingColor,
    markingSelections,
    setMarkingCardId,
    setMarking,
    setSelection,
    removeSelection,
    clear,
  }
})

export default useMessageCardStore
export { MarkType, markTypeColorMap }
