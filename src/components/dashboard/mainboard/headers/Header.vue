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
  const shadeColor = getShadeColor(_color, diff < 0 ? diff * 1 : diff * 4)
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
    min-h-214px w-full flex flex-col justify-center px-8 py-2
    :style="{
      backgroundColor: bgColor || '',
    }"
  >
    <div
      absolute left-0 top-0 z-1 h-70 w-full bg-cover bg-center blur-10
      brightness="100 dark:50"
      :style="{
        backgroundImage: props.image ? `url(${props.image})` : undefined,
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
        <div flex items-center justify-center text-lg font-600>
          {{ props.title }}
          <div
            h-8 w-8 cursor-pointer rounded-full p-1 transition-all
            @click="handleBtnClick"
          >
            <Icon color="#FFD700" :icon="favourite ? 'line-md:star-filled' : 'line-md:star'" class="h-full w-full rounded-full" />
          </div>
          <div
            v-if="joined !== undefined && props.type === 'channel'"
            h-8 w-8 cursor-pointer rounded-full p-1 transition-all
            @click="handleJoinClick"
          >
            <Icon :color="joined ? '#16a34a' : ''" :icon="joined ? 'line-md:confirm' : 'line-md:plus'" class="h-full w-full rounded-full" />
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
