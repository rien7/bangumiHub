<script setup lang='ts'>
import type { Ref } from 'vue'
import { onMounted, onUpdated, ref } from 'vue'
import { Icon } from '@iconify/vue/dist/iconify.js'
import { joinChannel, leaveChannel } from '../../searchbar/searchChannel'
import getMainColor, { getShadeColor, isDark } from '../../sidebar/getMainColor'
import db, { StoreNames } from '@/utils/db'

const props = defineProps<{
  id: string
  title: string
  image?: string
  favouriteAction: (favourite: boolean) => void
  subTitle?: string
  about?: string
  joined?: boolean
  type: 'channel' | 'mark'
}>()

const favourite = ref(false)
let lastId: string | undefined
const joined: Ref<boolean | undefined> = ref(undefined)
const img = ref<HTMLImageElement | null>(null)
const bgColor = ref<string | undefined>(undefined)
const color = ref<string | undefined>(undefined)

function getColor() {
  if (!img.value)
    return
  const _color = getMainColor(img.value)
  bgColor.value = _color
  let diff = 128 - isDark(_color)
  const min = 48
  if (diff > 0 && diff < min)
    diff = min
  else if (diff < 0 && diff > -min)
    diff = -min
  const shadeColor = getShadeColor(_color, diff < 0 ? diff * 0.6 : diff * 3)
  color.value = shadeColor
}

function init() {
  if (lastId === props.id)
    return
  joined.value = props.joined
  db.get(
    props.type === 'channel' ? StoreNames.FAVOURITE_CHANNELS : StoreNames.FAVOURITE_MARKS,
    props.id,
  ).then((res) => {
    if (res)
      favourite.value = true
  })
  lastId = props.id
  if (img.value && img.value.complete) {
    getColor()
  }
  else {
    img.value!.addEventListener('load', () => {
      getColor()
    })
  }
}

onMounted(() => {
  init()
})

onUpdated(() => {
  init()
})

function handleBtnClick() {
  props.favouriteAction(favourite.value)
  favourite.value = !favourite.value
}

function handleJoinClick() {
  if (props.type === 'channel' && joined.value !== undefined) {
    if (joined.value) {
      leaveChannel(props.id)
      joined.value = false
    }
    else {
      joinChannel(props.id)
      joined.value = true
    }
  }
}
</script>

<template>
  <div
    :style="`
      background-color: ${bgColor || ''};
      --un-shadow-color: ${`${bgColor}` || ''};
    `"
    class="header"
    min-h-220px w-full flex flex-col justify-center px-8 py-2 pb-6
  >
    <!-- <div
      absolute left-0 top-0 z-1 h-70 w-full bg-cover bg-center blur-10
      brightness="100 dark:50"
      :style="{
        backgroundImage: props.image ? `url(${props.image})` : undefined,
      }"
    /> -->
    <div
      absolute left-0 top-0 z-1 h-66 w-full
      :style="{
        backgroundColor: bgColor || '',
      }"
    />
    <div
      z-5 flex
      :style="{
        color: color || '',
      }"
    >
      <div h-32 w-32 flex items-center justify-center>
        <img v-if="props.image" ref="img" :src="`${props.image}`" rounded-md crossorigin="anonymous">
        <span v-else text-5xl leading-32>{{ props.title[0] }}</span>
      </div>
      <div ml-4 h-32 flex flex-col justify-center>
        <div flex items-center justify-center gap-2 text-lg font-600>
          {{ props.title }}
          <div
            relative
            h-8 w-8 cursor-pointer rounded-full p-1 transition-all @click="handleBtnClick"
          >
            <Icon color="#FFD700" :icon="favourite ? 'line-md:star-filled' : 'line-md:star'" class="h-full w-full rounded-full" />
            <div hover:bg="#FFD70088" absolute left-1 top-1 h-6 w-6 rounded-full bg-transparent filter-blur transition-all />
          </div>
          <div
            v-if="joined !== undefined && props.type === 'channel'"
            relative
            h-8 w-8 cursor-pointer rounded-full p-1 transition-all
            @click="handleJoinClick"
          >
            <Icon :color="joined ? '#16a34a' : ''" :icon="joined ? 'line-md:confirm' : 'line-md:plus'" class="h-full w-full rounded-full" />
            <div hover:bg="#16a34a88" absolute left-1 top-1 h-6 w-6 rounded-full bg-transparent filter-blur transition-all />
          </div>
        </div>
        <div mt-2 text-xs font-mono>
          {{ props.type === 'channel' ? `@${props.subTitle}` : props.subTitle }}
        </div>
      </div>
    </div>
    <div
      z-10 mt-4 flex flex-col
      :style="{
        color: color || '',
      }"
    >
      <div line-clamp-3 w-full whitespace-pre-wrap text-sm>
        {{ props?.about }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  -webkit-box-shadow: var(--un-shadow-inset) 0 0 10px 2px var(--un-shadow-color, rgba(0,0,0,0.1));
  -moz-box-shadow: var(--un-shadow-inset) 0 0 10px 2px var(--un-shadow-color, rgba(0,0,0,0.1));
  box-shadow: var(--un-shadow-inset) 0 0 10px 2px var(--un-shadow-color, rgba(0,0,0,0.1));
}
</style>
