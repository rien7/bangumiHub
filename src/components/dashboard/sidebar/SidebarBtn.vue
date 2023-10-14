<script setup lang="ts">
import type { Ref } from 'vue'
import { inject, ref, watch } from 'vue'

const props = defineProps<{
  text: string
  clickable: boolean
}>()
const expand = inject<Ref<boolean>>('expand')!
const groupHover = inject<Ref<boolean>>('groupHover') || ref(false)
const hover = ref(false)
const popup = ref(false)

watch([expand, hover, groupHover], () => {
  if (groupHover?.value)
    popup.value = true
  else if (!expand.value && hover.value)
    popup.value = true
  else
    popup.value = false
})
</script>

<template>
  <div
    :w="expand || hover ? '250px' : groupHover ? '200px' : '50px'" h-50px
    transition-all
    :overflow="popup ? 'visible' : 'hidden'"
    :bg="popup ? 'gray-100' : 'none'"
    rounded-e-full
    :outline="popup ? '1px solid gray-200' : 'none'"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <div
      w-250px h-50px
      text-center
      flex
    >
      <div
        inline-block
        basis="1/5"
        rounded-full
        transition
        flex items-center justify-center
      >
        <div
          rounded-full
          transition
          :cursor="clickable && 'pointer'"
          flex items-center justify-center
          :bg="clickable && 'hover:gray-200'"
          :ring="clickable && 'hover:1 hover:gray-300'"
        >
          <slot />
        </div>
      </div>
      <div
        inline-block
        :basis="groupHover ? '3/5' : '4/5'"
        flex items-center justify-center
        font="sans 500"
        transition-all
        select-none
      >
        {{ props.text }}
      </div>
    </div>
  </div>
</template>
