<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import ChannelHeader from '../mainboard/headers/ChannelHeader.vue'
import MarkHeader from '../mainboard/headers/MarkHeader.vue'
import MessageFeed from './messageFeed/MessageFeed.vue'
import useGlobalStore from '@/store/global'

const globalStore = useGlobalStore()
const { currentValue } = storeToRefs(globalStore)
</script>

<template>
  <ChannelHeader v-if="currentValue === 'searchChannel'" />
  <MarkHeader v-if="currentValue === 'mark'" />
  <MessageFeed />
</template>
