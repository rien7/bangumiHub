<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import Header from './Header.vue'
import db, { StoreNames } from '@/utils/db'
import useGlobalStore from '@/store/global'

const globalStore = useGlobalStore()
const { activeMark } = storeToRefs(globalStore)

function handleBtnClick(_favourite: boolean) {
  if (!activeMark.value)
    return
  const ids = activeMark.value.ids
  if (ids) {
    ids.split(',').forEach((id) => {
      db.get(StoreNames.MARK_INDEX, `${activeMark.value?.channelId.toString()}+${id}`).then((markData) => {
        if (markData) {
          markData.favourite = undefined
          markData.id = undefined
          db.put(StoreNames.MARK_INDEX, {
            ...markData,
            lang: { ...markData.lang },
          }, `${activeMark.value?.channelId.toString()}+${id}`)
        }
      })
    })
  }
  db.delete(StoreNames.FAVOURITE_MARKS, activeMark.value.id.toString())
  window.postMessage({ type: 'favourite-marks' }, location.href)
  globalStore.clearActiveMark()
  globalStore.setCurrentValue('channel')
}
</script>

<template>
  <Header
    :id="activeMark!.id"
    :title="activeMark!.title"
    :sub-title="activeMark!.subTitle"
    :image="activeMark!.image ? `https://proxy.zrien7.workers.dev/bgm/${activeMark!.image}` : undefined"
    type="mark"
    :favourite-action="handleBtnClick"
  />
</template>
