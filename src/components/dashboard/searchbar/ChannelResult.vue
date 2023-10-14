<script setup lang='ts'>
import type { Channel } from '../../../models/Channel'

const props = defineProps<{
  channel: Channel
}>()

const searchResult = props.channel
</script>

<template>
  <div w-full flex flex-col py-2 px-8>
    <div flex>
      <div w-16 h-16 rounded-full>
        <!-- TODO: don't use base64 -->
        <img :src="`data:image/png;base64,${searchResult?.chatPhoto?.getPhoto()}`" class="w-full h-full rounded-full">
      </div>
      <div flex flex-col ml-4 h-16 justify-center>
        <div font-600 text-lg>
          {{ searchResult?.title }}
        </div>
        <div mt-2 font-mono text-xs>
          @{{ searchResult?.username }}
        </div>
      </div>
      <div w-8 h-8 rounded-full bg-gray-400 ml-auto />
    </div>
    <div flex flex-col mt-4>
      <div w-full text-sm whitespace-pre-wrap>
        {{ searchResult?.about }}
      </div>
    </div>
  </div>
</template>
