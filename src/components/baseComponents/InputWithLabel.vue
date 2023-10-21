<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  label: string
  type: string
}>()

const emit = defineEmits(['submit'])

const focused = ref(false)
const input = ref<HTMLInputElement | null>(null)

function handleEnter(e: KeyboardEvent) {
  if (e.key === 'Enter')
    emit('submit', input.value?.value ?? '')
}
</script>

<template>
  <label
    :for="props.label"
    relative block rounded-md p-1 transition
    border="1 solid gray-200 focus-within:blue-600"
  >
    <input
      :id="props.label"
      ref="input"
      :type="props.type"
      border="none hover:none focus:none"
      outline="none hover:none focus:none"
      h-full w-full bg-transparent text-lg
      @focusin="focused = true"
      @focusout="focused = false"
      @keyup="handleEnter"
    >

    <span
      :text="focused ? 'xs' : 'sm' + 'gray-700 dark:gray-200'"
      :top="focused ? '0' : '1/2'"
      translate-y="-1/2"
      bg="white dark:black"
      pointer-events-none absolute start-2.5 p-0.5 font-sans transition-all
    >
      {{ props.label }}
    </span>
  </label>
</template>
