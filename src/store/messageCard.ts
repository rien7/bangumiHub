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
  [MarkType.Title, '#fb7185'],
  [MarkType.Episode, '#a8a29e'],
])

function getMarkTypeFromColor(color: string): MarkType | null {
  for (const [key, value] of markTypeColorMap) {
    if (value === color)
      return key
  }
  return null
}

const useMessageCardStore = defineStore('messageCard', () => {
  const markingCardId: Ref<number | null> = ref(null)
  const markingType: Ref<MarkType | null> = ref(null)
  const markingColor: Ref<string | null> = ref(null)
  const markedType: MarkType[] = reactive([])
  const markingSelections: Ref<{ text: string; color: string | null; type: MarkType | null }[]> = ref([])

  function setMarkingCardId(id: number) {
    markingCardId.value = id
  }

  function setMarking(type: MarkType | null, color: string | null) {
    markingType.value = type
    markingColor.value = color
  }

  function setSelection(selection: { text: string; color: string | null; type: MarkType | null }[]) {
    markingSelections.value = selection
    if (selection.length === 1 && selection[0].color === null)
      markedType.splice(0, markedType.length)
    else
      markedType.push(markingType.value as MarkType)
    setMarking(null, null)
  }

  function removeSelection(text: string) {
    const index = markingSelections.value.findIndex(selection => selection.text === text)
    const type = markingSelections.value[index].type
    markingSelections.value[index].color = null

    if (type)
      markedType.splice(markedType.indexOf(type), 1)
    const newMarkingSelections: { text: string; color: string | null; type: MarkType | null }[] = []
    let tempText: string | undefined
    for (const selection of markingSelections.value) {
      if (selection.color !== null) {
        if (tempText) {
          newMarkingSelections.push({ text: tempText, color: null, type: null })
          tempText = undefined
        }
        newMarkingSelections.push(selection)
      }
      else {
        if (tempText)
          tempText += selection.text
        else
          tempText = selection.text
      }
    }
    if (tempText)
      newMarkingSelections.push({ text: tempText, color: null, type: null })
    markingSelections.value = newMarkingSelections
  }

  function clear() {
    markingCardId.value = null
    markingType.value = null
    markingColor.value = null
    markingSelections.value = []
    markedType.splice(0, markedType.length)
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
export { MarkType, markTypeColorMap, getMarkTypeFromColor }
