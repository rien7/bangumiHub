<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import ChannelHeader from '../mainboard/headers/ChannelHeader.vue'
import MarkHeader from '../mainboard/headers/MarkHeader.vue'
import MessageFeed from './messageFeed/MessageFeed.vue'
import useGlobalStore from '@/store/global'

const globalStore = useGlobalStore()
const { searchChannel, activeMark } = storeToRefs(globalStore)
</script>

<template>
  <ChannelHeader v-if="searchChannel" />
  <MarkHeader v-if="activeMark" />
  <MessageFeed />
</template>
