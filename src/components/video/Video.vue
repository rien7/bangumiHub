<script setup lang='ts'>
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { decode } from '@/utils/number'
import type Message from '@/models/Message'
import db, { StoreNames } from '@/utils/db'
import type { Media } from '@/models/Media'

const route = useRoute()

const ids = route.params.id.toString().split(/[xyzXYZ]/)
const channelId = decode(ids[0])
const messageId = decode(ids[1])

const message = ref<Message>()
const media = ref<Media>()

onMounted(async () => {
  // TODO: extract to a function
  const _message = await db.get(StoreNames.TA_INDEX, `${channelId}+${messageId}`)
  message.value = _message as Message
  const _media = await db.get(StoreNames.MEDIA, message.value.mediaId?.toString() || '')
  media.value = _media as Media
})
</script>

<template>
  <div ml-10 mt-10>
    <video
      id="player" class="video-js vjs-anime" controls w="1280px" h="720px" preload="auto"
      rounded-md shadow="gray-500"
    >
      <source v-if="media" :src="`./v/${media?.id}`" type="video/mp4">
    </video>
  </div>
</template>

<style>
video::-webkit-media-controls-panel {
  @apply flex-wrap h-auto bg-transparent bg-gradient-to-t from-black/90 to-transparent
}
video::-webkit-media-controls-timeline {
  @apply bg-transparent w-full order-first p-0
}

video[rounded-md] {
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
  -webkit-border-bottom-left-radius: 0.375rem;
  -webkit-border-bottom-right-radius: 0.375rem;
  -moz-border-bottom-left-radius: 0.375rem;
  -moz-border-bottom-right-radius: 0.375rem;
}
video {
  -webkit-box-shadow: var(--un-shadow-inset) 0 0 12px -1px var(--un-shadow-color, rgba(0,0,0,0.1));
  -moz-box-shadow: var(--un-shadow-inset) 0 0 12px -1px var(--un-shadow-color, rgba(0,0,0,0.1));
  box-shadow: var(--un-shadow-inset) 0 0 12px -1px var(--un-shadow-color, rgba(0,0,0,0.1));
}
</style>
