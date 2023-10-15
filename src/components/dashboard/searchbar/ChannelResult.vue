<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue/dist/iconify.js'
import type Channel from '../../../models/Channel'
import db, { StoreNames } from '../../../utils/db'

const props = defineProps<{
  channel: Channel
}>()

const searchResult = props.channel
const favourite = ref(false)

onMounted(() => {
  db.get(StoreNames.FAVOURITE_CHANNELS, searchResult.id.toString()).then((res) => {
    if (res)
      favourite.value = true
  })
})

function handleBtnClick() {
  if (!favourite.value)
    db.put(StoreNames.FAVOURITE_CHANNELS, JSON.stringify({ ...searchResult, about: undefined }), searchResult.id.toString())
  else db.delete(StoreNames.FAVOURITE_CHANNELS, searchResult.id.toString())
  window.postMessage({ type: 'favourite-channels' }, location.href)
  favourite.value = !favourite.value
}
</script>

<template>
  <div w-full flex flex-col px-8 py-2>
    <div flex>
      <div h-16 w-16 rounded-full>
        <img :src="`/img/c${channel.chatPhotoId}`" class="h-full w-full rounded-full">
      </div>
      <div ml-4 h-16 flex flex-col justify-center>
        <div text-lg font-600>
          {{ searchResult?.title }}
        </div>
        <div mt-2 text-xs font-mono>
          @{{ searchResult?.username }}
        </div>
      </div>
      <div
        ml-auto h-8 w-8 cursor-pointer rounded-full p-1 transition-all
        @click="handleBtnClick"
      >
        <Icon color="#FFD700" :icon="favourite ? 'line-md:star-filled' : 'line-md:star'" class="h-full w-full rounded-full" />
      </div>
    </div>
    <div mt-4 flex flex-col>
      <div w-full whitespace-pre-wrap text-sm>
        {{ searchResult?.about }}
      </div>
    </div>
  </div>
</template>
