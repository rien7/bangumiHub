<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import Header from './Header.vue'
import db, { StoreNames } from '@/utils/db'
import useGlobalStore from '@/store/global'

const globalStore = useGlobalStore()
const { searchChannel, currentValue } = storeToRefs(globalStore)

function handleBtnClick(favourite: boolean) {
  if (!searchChannel.value)
    return
  if (!favourite) {
    db.put(StoreNames.FAVOURITE_CHANNELS, {
      ...searchChannel.value,
      id: searchChannel.value.id.toString(),
      accessHash: searchChannel.value.accessHash?.toString(),
      chatPhotoId: searchChannel.value.chatPhotoId?.toString(),
      joined: undefined,
      about: undefined,
    }, searchChannel.value.id.toString())
  }
  else { db.delete(StoreNames.FAVOURITE_CHANNELS, searchChannel.value.id.toString()) }
  window.postMessage({ type: 'favourite-channels' }, location.href)
}
</script>

<template>
  <Header
    v-if="searchChannel && currentValue === 'searchChannel'"
    :id="searchChannel.id.toString()"
    :title="searchChannel.title"
    :sub-title="searchChannel.username"
    :image="`/img/c${searchChannel.chatPhotoId}`"
    :about="searchChannel.about"
    type="channel"
    :favourite-action="handleBtnClick"
    :joined="searchChannel?.joined"
  />
</template>
