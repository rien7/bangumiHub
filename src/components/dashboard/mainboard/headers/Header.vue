<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue/dist/iconify.js'
import db, { StoreNames } from '@/utils/db'

const props = defineProps<{
  id: string
  title: string
  image?: string
  favouriteAction: (favourite: boolean) => void
  subTitle?: string
  about?: string
  type: 'channel' | 'mark'
}>()

const favourite = ref(false)

onMounted(() => {
  db.get(
    props.type === 'channel' ? StoreNames.FAVOURITE_CHANNELS : StoreNames.FAVOURITE_MARKS,
    props.id,
  ).then((res) => {
    if (res)
      favourite.value = true
  })
})

function handleBtnClick() {
  props.favouriteAction(favourite.value)
  favourite.value = !favourite.value
}
</script>

<template>
  <div
    h-230px w-full flex flex-col justify-center px-8 py-2
  >
    <div
      absolute left-0 top-0 z-1 h-70 w-full bg-cover bg-center blur-10
      brightness="100 dark:50"
      :style="{
        backgroundImage: props.image ? `url(${props.image})` : undefined,
      }"
    />
    <div z-5 flex>
      <div h-32 w-32 flex items-center justify-center>
        <img v-if="props.image" :src="`${props.image}`" class="h-full w-full rounded-full">
        <span v-else text-5xl leading-32>{{ props.title[0] }}</span>
      </div>
      <div ml-4 h-32 flex flex-col justify-center>
        <div flex items-center justify-center text-lg font-600>
          {{ props.title }}
          <div
            h-8 w-8 cursor-pointer rounded-full p-1 transition-all
            @click="handleBtnClick"
          >
            <Icon color="#FFD700" :icon="favourite ? 'line-md:star-filled' : 'line-md:star'" class="h-full w-full rounded-full" />
          </div>
        </div>
        <div mt-2 text-xs font-mono>
          {{ props.type === 'channel' ? `@${props.subTitle}` : props.subTitle }}
        </div>
      </div>
    </div>
    <div z-10 mt-4 flex flex-col>
      <div line-clamp-5 w-full whitespace-pre-wrap text-sm>
        {{ props?.about }}
      </div>
    </div>
  </div>
</template>
