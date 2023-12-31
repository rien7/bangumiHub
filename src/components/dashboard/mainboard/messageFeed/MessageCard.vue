<script setup lang='ts'>
import type { Ref } from 'vue'
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { getLang, getQuality } from '../marks/extractData'
import ActionBtn from './ActionBtn.vue'
import MarkTool from './markTools/MarkTool.vue'
import SelectText from './markTools/SelectText.vue'
import type Message from '@/models/Message'
import useMessageCardStore, { MarkType } from '@/store/messageCard'
import { encode } from '@/utils/number'
import MarkData from '@/models/MarkData'
import db, { StoreNames } from '@/utils/db'
import type { Media } from '@/models/Media'
import { readableDate, readableSeconds } from '@/utils/date'
import { getImgUrlByName, uploadCloud } from '@/components/dashboard/mainboard/marks/utils'
import useGlobalStore from '@/store/global'

const props = defineProps<{
  message: Message
  channelId: bigInt.BigInteger
}>()

/**
 * store
 */
const globalStore = useGlobalStore()
const { currentValue } = storeToRefs(globalStore)

const messageCardStore = useMessageCardStore()
const { markingColor, markingType, markingCardId, markingSelections } = storeToRefs(messageCardStore)

/**
 * ref
 */
const hoverImg = ref(false)
const markingTitleMeta = ref(false)
const mounted = ref(false)
const showMarkData = ref(true)

const media: Ref<Media | undefined> = ref(undefined)
const markData: Ref<MarkData | undefined> = ref(undefined)

const router = useRouter()

watch([markingCardId], () => {
  if (markingCardId.value !== props.message.id)
    markingTitleMeta.value = false
})

/**
 * click handler
 */
function imgClick() {
  const channelIdString = props.channelId.toString()
  const msgIdString = props.message.id!.toString()

  const channelIdEncode = encode(Number.parseInt(channelIdString))
  const msgIdEncode = encode(Number.parseInt(msgIdString))

  const spliter = 'xyzXYZ'.split('')[Math.floor(props.message.id % 6)]

  router.push(`/v/${channelIdEncode}${spliter}${msgIdEncode}`)
}

function markClick() {
  markingTitleMeta.value = !markingTitleMeta.value
  if (!markingTitleMeta.value)
    messageCardStore.clear()
  else
    messageCardStore.setMarkingCardId(props.message.id)
}

async function favouriteClick() {
  if (markData.value!.favourite) {
    db.delete(StoreNames.FAVOURITE_MARKS, markData.value!.favourite)
    markData.value!.favourite = undefined
  }
  else {
    markData.value!.favourite = encode(Math.random() * 999999999)
    const url = await getImgUrlByName(markData.value!.title)
    db.put(StoreNames.FAVOURITE_MARKS, {
      id: markData.value!.favourite,
      ids: props.message.id.toString(),
      mark: markData.value!.mark,
      title: markData.value!.title,
      subTitle: markData.value!.subTitle,
      text: props.message.message,
      channelId: props.message.channelId.toString(),
      lang: { ...markData.value!.lang },
      quality: markData.value!.quality,
      image: url,
    }, markData.value!.favourite)
  }

  db.put(StoreNames.MARK_INDEX, {
    ...markData.value,
    channelId: undefined,
    lang: { ...markData.value!.lang },
  }, `${props.message.channelId.toString()}+${props.message.id.toString()}`)

  window.postMessage({ type: 'favourite-marks' }, location.href)
}

async function markComplate() {
  const _markData = new MarkData()
  let mark = ''
  let start = 0
  for (const selection of markingSelections.value) {
    const end = start + selection.text.length
    if (selection.type === MarkType.Subtitle) {
      _markData.subTitle = selection.text
      mark += `s${start},${end}`
    }
    else if (selection.type === MarkType.Title) {
      _markData.title += _markData.title !== '' ? ` ${selection.text}` : selection.text
      mark += `t${start},${end}`
    }
    else if (selection.type === MarkType.Episode) {
      _markData.episode = selection.text
      mark += `e${start},${end}`
    }
    start = end
  }
  _markData.mark = mark
  _markData.text = props.message.message

  _markData.lang = getLang(props.message.message)
  _markData.quality = getQuality(media.value)
  markData.value = _markData
  db.put(StoreNames.MARK_INDEX, {
    ..._markData,
    channelId: props.message.channelId.toString(),
    text: undefined,
  }, `${props.message.channelId.toString()}+${props.message.id.toString()}`)
  uploadCloud(props.message.channelId.toJSNumber(), props.message.id, _markData.mark)
  messageCardStore.clear()
}

async function getMarkIndex() {
  const _markData = await db.get(StoreNames.MARK_INDEX, `${props.message.channelId.toString()}+${props.message.id.toString()}`)
  if (_markData)
    markData.value = _markData as MarkData
}

onMounted(async () => {
  await getMarkIndex()
  const _media = await db.get(StoreNames.MEDIA, props.message.mediaId?.toString() || '') as Media
  media.value = _media
  mounted.value = true

  window.addEventListener('message', async (event) => {
    // eslint-disable-next-line eqeqeq
    if (event.data.type === 'update-marks' && event.data.channelId == props.channelId && event.data.messageId == props.message.id)
      await getMarkIndex()
  })
})
</script>

<template>
  <div class="message-card" relative h-67 w-80 flex flex-col overflow-hidden rounded-md shadow="gray-200 dark:gray-700">
    <div
      relative h-45 w-full cursor-pointer overflow-hidden
      @mouseenter="hoverImg = true"
      @mouseleave="hoverImg = false"
      @click="imgClick"
    >
      <img :src="`/img/m${props.message?.mediaId}`" class="h-full w-full" absolute top-0>
      <div absolute right-1 top-1>
        <ActionBtn
          v-if="!markData"
          :icons="['material-symbols:format-image-left-rounded']"
          :opacity="hoverImg || markingTitleMeta ? '100' : '0'"
          transition
          @click="markClick"
        />
        <div v-else flex>
          <ActionBtn
            :icons="['material-symbols:format-image-left-rounded', 'material-symbols:format-align-left-rounded']"
            :opacity="hoverImg || markingTitleMeta ? '100' : '0'"
            :highlight-index="showMarkData ? 0 : 1"
            transition
            @click="showMarkData = !showMarkData"
          />
        </div>
      </div>
      <div absolute bottom-1 right-1 flex>
        <!-- <ActionBtn :icons="['icon-park-outline:list-add']" :opacity="hoverImg && !markingTitleMeta ? '100' : '0'" transition /> -->
        <ActionBtn
          v-if="markData && currentValue !== 'mark'" :icons="[markData.favourite ? 'line-md:star-filled' : 'line-md:star']"
          :highlight-index="markData.favourite ? 0 : undefined"
          :highlight-color="markData.favourite ? ['#fde047', '#facc15', '#eab308'] : undefined"
          :opacity="hoverImg && !markingTitleMeta ? '100' : '0'" transition
          @click="favouriteClick"
        />
      </div>
      <div
        v-if="media"
        :opacity="hoverImg || markingTitleMeta ? '100' : '0'"
        absolute bottom-1 left-1 m-1 flex rounded-md px-1 py-0.5 text-2.5 font-mono transition
        bg="gray-200/80 dark:gray-700/80"
      >
        {{ readableSeconds(media.duration || 0) }}
      </div>
    </div>
    <div
      bg="gray-100 dark:gray-800"
      :h="markingTitleMeta ? '46' : '22'"
      absolute bottom-0 w-full px-4 py-2 transition-all duration-300
    >
      <div
        v-if="mounted"
        h-full w-170 flex justify-between gap-20 transition-all duration-800
        :class="(showMarkData && markData) ? 'translate-x-0' : '-translate-x-98'"
      >
        <div h-full w-72>
          <div v-if="markData" h-full w-72 flex flex-col justify-between>
            <div flex items-center justify-between>
              <span text-lg font-500>{{ markData.title }}</span>
              <span font-mono>{{ markData.episode }}</span>
            </div>
            <div flex justify-between text="xs gray-500 dark:gray-400">
              <div flex gap-1>
                <span>{{ markData.subTitle }}</span>
                <template v-for="(value, key) in markData.lang" :key="key">
                  <div v-if="value" inline bg="gray-500 dark:gray-400" rounded color="gray-100 dark:gray-800" px-1>
                    {{ key }}
                  </div>
                </template>
                <span font-mono>{{ markData.quality }}</span>
              </div>
              <span>{{ readableDate(props.message.date) }}</span>
            </div>
          </div>
        </div>

        <div
          :line-clamp="markingTitleMeta ? 7 : 3"
          :selection="markingTitleMeta"
          h-full w-72
        >
          <span v-if="!markingTitleMeta">{{ props.message!.message }}</span>
          <SelectText v-else :text="props.message!.message" :color="markingColor" :type="markingType" />
        </div>
      </div>
    </div>

    <Transition name="from-bottom">
      <MarkTool v-if="markingTitleMeta" absolute bottom-0 my-1 h-6 w-full @click="markComplate" />
    </Transition>
  </div>
</template>

<style scoped>
div[rounded-md] {
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
  -webkit-border-bottom-left-radius: 0.375rem;
  -webkit-border-bottom-right-radius: 0.375rem;
  -moz-border-bottom-left-radius: 0.375rem;
  -moz-border-bottom-right-radius: 0.375rem;
}
.message-card {
  -webkit-box-shadow: var(--un-shadow-inset) 0 0 8px 1px var(--un-shadow-color, rgba(0,0,0,0.1));
  -moz-box-shadow: var(--un-shadow-inset) 0 0 8px 1px var(--un-shadow-color, rgba(0,0,0,0.1));
  box-shadow: var(--un-shadow-inset) 0 0 8px 1px var(--un-shadow-color, rgba(0,0,0,0.1));
}

.from-bottom-enter-from,
.from-bottom-leave-to {
  transform: translateY(100%);
}

.from-bottom-enter-to,
.from-bottom-leave-from {
  transform: translateY(0);
}

.from-bottom-enter-active,
.from-bottom-leave-active {
  transition: transform 300ms;
}
</style>
@/utils/number
