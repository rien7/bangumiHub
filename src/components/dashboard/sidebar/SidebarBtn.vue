<script setup lang="ts">
import type { Ref } from 'vue'
import { computed, inject, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { getShadeColor, isDark } from './getMainColor'
import useGlobalStore from '@/store/global'
import useSidebarStore from '@/store/sidebar'

const props = defineProps<{
  id?: string
  expandable: boolean
  clickable: boolean
  image?: string
  type?: 'channel' | 'mark'
}>()
const expand = inject<Ref<boolean>>('expand')!
const hover = ref(false)
const popup = ref(false)

const route = useRoute()
const router = useRouter()

const globalStore = useGlobalStore()
const sidebarStore = useSidebarStore()

const { colors } = storeToRefs(sidebarStore)
const sidebarColor = computed(() => {
  const color = colors.value.filter(color => color.url === props.image)[0]
  return color?.color || ''
})
const sidebarOutlineColor = computed(() => {
  let diff = 128 - isDark(sidebarColor.value)
  const min = 48
  if (diff > 0 && diff < min)
    diff = min
  else if (diff < 0 && diff > -min)
    diff = -min
  if (!sidebarColor.value)
    return ''
  const shadeColor = getShadeColor(sidebarColor.value, diff < 0 ? diff * 0.4 : diff * 2.5)
  return shadeColor
})
const sidebarFontColor = computed(() => {
  let diff = 128 - isDark(sidebarColor.value)
  const min = 48
  if (diff > 0 && diff < min)
    diff = min
  else if (diff < 0 && diff > -min)
    diff = -min
  if (!sidebarColor.value)
    return ''
  const shadeColor = getShadeColor(sidebarColor.value, diff < 0 ? diff * 0.6 : diff * 3)
  return shadeColor
})

watch([expand, hover], () => {
  if (!props.expandable)
    popup.value = false
  else if (!expand.value && hover.value)
    popup.value = true
  else
    popup.value = false
})

async function handleBtnClick() {
  if (props.clickable && props.id && props.type) {
    if (route.path !== '/')
      router.push('/')
    if (props.type === 'channel') {
      globalStore.setCurrentValue('channel')
      globalStore.setActiveChannelById(props.id)
    }
    else {
      globalStore.setCurrentValue('mark')
      globalStore.setActiveMarkById(props.id)
    }
  }
}
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

    z-50 h-50px rounded-e-full transition-all
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <div h-50px w-250px flex text-center>
      <div basis="1/5" flex items-center justify-center rounded-full transition>
        <div
          :cursor="clickable && 'pointer'"
          flex items-center justify-center rounded-full transition-all
          :bg="clickable && 'hover:gray-200 dark:hover:gray-700'"
          :outline="clickable && 'hover:2px hover:solid gray-300'"
          :style="{
            outlineColor: popup && sidebarOutlineColor ? `${sidebarOutlineColor} !important` : 'gray-300',
          }"
          @click="handleBtnClick"
        >
          <slot />
        </div>
      </div>
      <div
        basis="4/5" font="sans 500" :opacity="expand || popup ? '100' : '0'"
        mx-1 flex select-none items-center justify-center text-sm transition-all
        :style="{
          color: popup ? `${sidebarFontColor} !important` : '',
        }"
      >
        <slot name="context" />
      </div>
    </div>
  </div>
</template>

<style scoped>
div[overflow="visible"] {
  background-color: sidebarColor;
}
</style>
