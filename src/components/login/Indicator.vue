<script setup lang="ts">
import { Icon } from '@iconify/vue'

const props = defineProps<{
  done: boolean
  text: string
  note: string
}>()
</script>

<template>
  <div
    relative my-2 w-300px
  >
    <Icon
      v-if="!props.done"
      icon="line-md:circle-twotone"
      top="50%" translate-y="-50%"
      absolute left-0 h-6 w-6 transition-all duration-300
    />
    <Icon
      v-if="props.done"
      icon="line-md:circle-twotone-to-confirm-circle-twotone-transition"
      top="50%" translate-y="-50%"
      :color="props.done ? 'green' : 'gray'"
      absolute left-0 h-6 w-6 transition-all duration-300
    />
    <p
      inline align-middle
      :font="props.done ? 'sans 400' : 'sans 500'"
      :text="props.done ? 'md' : 'xl'"
      transition-all duration-300
    >
      {{ props.text }}
    </p>
  </div>
  <Transition name="to-left">
    <p
      v-if="!props.done"
      mx-auto mb-4 max-w-300px
      font-sans text="xs gray-500"
    >
      {{ props.note }}
    </p>
  </Transition>
  <Transition name="to-left">
    <slot v-if="!props.done" />
  </Transition>
</template>

<style scoped>
.to-left-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.to-left-leave-to {
  opacity: 0;
  transform: translateX(-300%);
}
.to-left-leave-active {
  transition: opacity 300ms, transform 300ms;
}
</style>
