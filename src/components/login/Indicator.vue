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
    mx-auto
    w-300px
    relative
    my-2
  >
    <Icon
      v-if="!props.done"
      icon="line-md:circle-twotone"
      absolute left-0 top="50%" translate-y="-50%"
      w-6 h-6
      transition-all
      duration-300
    />
    <Icon
      v-if="props.done"
      icon="line-md:circle-twotone-to-confirm-circle-twotone-transition"
      absolute left-0 top="50%" translate-y="-50%"
      :color="props.done ? 'green' : 'gray'"
      w-6 h-6
      transition-all
      duration-300
    />
    <p
      inline
      align-middle
      :font="props.done ? 'sans 400' : 'sans 500'"
      :text="props.done ? 'md' : 'xl'"
      transition-all
      duration-300
    >
      {{ props.text }}
    </p>
  </div>
  <Transition name="to-top">
    <p
      v-if="!props.done"
      mx-auto
      max-w-300px
      font-sans text="xs gray-500"
    >
      {{ props.note }}
    </p>
  </Transition>
  <Transition name="to-top">
    <slot v-if="!props.done" />
  </Transition>
</template>

<style scoped>
.to-top-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.to-top-leave-to {
  opacity: 0;
  transform: translateY(-300%);
}
.to-top-leave-active {
  transition: opacity 300ms, transform 300ms;
}
</style>
