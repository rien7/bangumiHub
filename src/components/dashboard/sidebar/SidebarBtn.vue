<script setup lang="ts">
import type { Ref } from 'vue'
import { inject, ref, watch } from 'vue'
import { shadeColor } from './getMainColor'
import db, { StoreNames } from '@/utils/db'

const props = defineProps<{
  id?: string
  text: string
  clickable: boolean
  image?: string
}>()
const expand = inject<Ref<boolean>>('expand')!
const hover = ref(false)
const popup = ref(false)
const sidebarColor = ref<string>()
const sidebarOutlineColor = ref<string>()

watch([expand, hover], () => {
  if (!expand.value && hover.value)
    popup.value = true
  else
    popup.value = false
})

async function handleBtnClick() {
  if (props.clickable && props.id) {
    await db.put(StoreNames.GENERAL_SETTINGS, props.id, 'selecting-channel')
    window.postMessage({ type: 'selecting-channel' }, location.href)
  }
}

window.addEventListener('message', (event) => {
  if (event.data.type === 'sidebar-color' && event.data.url === props.image && event.data.color) {
    sidebarColor.value = event.data.color
    sidebarOutlineColor.value = shadeColor(event.data.color, -20)
  }
})
</script>

<template>
  <div
    :w="expand || hover ? '250px' : '50px'"
    :overflow="popup ? 'visible' : 'hidden'"
    :bg="popup ? 'gray-100 dark:gray-800' : 'none'"
    :outline="popup ? '2px solid gray-200 dark:gray-700' : 'none'"
    :style="{
      backgroundColor: popup ? `${sidebarColor} !important` : '',
      outlineColor: popup ? `${sidebarOutlineColor} !important` : '',
    }"
    h-50px rounded-e-full transition-all
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <div h-50px w-250px flex text-center>
      <div basis="1/5" flex items-center justify-center rounded-full transition>
        <div
          :cursor="clickable && 'pointer'"
          flex items-center justify-center rounded-full transition
          :bg="clickable && 'hover:gray-200 dark:hover:gray-700'"
          :ring="clickable && 'hover:2 hover:gray-100/80'"
          @click="handleBtnClick"
        >
          <slot />
        </div>
      </div>
      <div
        basis="4/5" font="sans 500" :opacity="expand || popup ? '100' : '0'"
        mx-1 flex select-none items-center justify-center text-sm transition-all
      >
        {{ props.text }}
      </div>
    </div>
  </div>
</template>

<style scoped>
div[overflow="visible"] {
  background-color: sidebarColor;
}
</style>
