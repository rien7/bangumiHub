<script setup lang='ts'>
import MarkBtn from './MarkBtn.vue'
import { MarkType } from '@/store/messageCard'
</script>

<template>
  <div flex px-1>
    <MarkBtn :type="MarkType.Subtitle" />
    <MarkBtn :type="MarkType.Title" />
    <MarkBtn :type="MarkType.Episode" />
  </div>
</template>
