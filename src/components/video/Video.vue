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
  const _message = await db.get(StoreNames.TA_INDEX, `${channelId}+${messageId}`)
  message.value = _message as Message
  const _media = await db.get(StoreNames.MEDIA, message.value.mediaId?.toString() || '')
  media.value = _media as Media
})
</script>

<template>
  <video v-if="media" controls>
    <source :src="`./v/${media?.id}`" type="video/mp4">
  </video>
</template>
