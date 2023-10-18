<script setup lang='ts'>
import type { Ref } from 'vue'
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import ActionBtn from './ActionBtn.vue'
import MarkTool from './markTools/MarkTool.vue'
import SelectText from './markTools/SelectText.vue'
import type Message from '@/models/Message'
import useMessageCardStore, { MarkType } from '@/store/messageCard'
import { encode } from '@/utils/number'
import MarkData, { LangEnum } from '@/models/MarkData'
import db, { StoreNames } from '@/utils/db'
import type { Media } from '@/models/Media'
import { readableDate } from '@/utils/date'
import { getImgUrlByName } from '@/components/dashboard/mainboard/marks/utils'

const props = defineProps<{
  message: Message
  channelId: bigInt.BigInteger
}>()

const messageCardStore = useMessageCardStore()
const { markingColor, markingType, markingCardId, markingSelections } = storeToRefs(messageCardStore)

const hoverImg = ref(false)
const markingTitleMeta = ref(false)
const delay300 = ref(false)
const mounted = ref(false)
const showMarkData = ref(true)

const markData: Ref<MarkData | undefined> = ref(undefined)

const router = useRouter()

watch([markingCardId], () => {
  if (markingCardId.value !== props.message.id)
    markingTitleMeta.value = false
})

watch([markingTitleMeta], () => {
  if (markingTitleMeta.value) {
    setTimeout(() => {
      delay300.value = true
    }, 300)
  }
  else {
    delay300.value = false
  }
})

function imgClick() {
  const channelIdString = props.channelId.toString()
  const msgIdString = props.message.id!.toString()

  const channelIdEncode = encode(Number.parseInt(channelIdString))
  const msgIdEncode = encode(Number.parseInt(msgIdString))

  const spliter = 'xyzXYZ'.split('')[Math.floor(props.message.id % 6)]

  router.push(`/v/${channelIdEncode}${spliter}${msgIdEncode}`)
}

function btnClick() {
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
    lang: { ...markData.value!.lang },
  }, `${props.message.channelId.toString()}+${props.message.id.toString()}`)

  window.postMessage({ type: 'favourite-marks' }, location.href)
}

async function markComplate() {
  const media = await db.get(StoreNames.MEDIA, props.message.mediaId?.toString() || '') as Media
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
  const _msg = props.message.message.toUpperCase()

  const langMap = [
    { CHS: LangEnum.S },
    { CHT: LangEnum.T },
    { JPN: LangEnum.J },
    { ENG: LangEnum.E },
    { BIG5: LangEnum.T },
    { GB: LangEnum.S },
    { JP: LangEnum.J },
    { JPTC: [LangEnum.J, LangEnum.T] },
    { JPSC: [LangEnum.J, LangEnum.S] },
    { 简: LangEnum.S },
    { 簡: LangEnum.S },
    { 繁: LangEnum.T },
    { 日: LangEnum.J },
    { 英: LangEnum.E },
  ]
  for (const lang of langMap) {
    for (const key in lang) {
      if (_msg.includes(key)) {
        for (const l of lang[key])
          _markData.lang[l] = true
      }
    }
  }

  if (media.h === 720)
    _markData.quality = '720p'
  else if (media.h === 1080)
    _markData.quality = '1080p'
  else if (media.w === 2560 || media.w === 2560)
    _markData.quality = '2K'
  else if (media.w === 4096)
    _markData.quality = '4K'

  markData.value = _markData
  db.put(StoreNames.MARK_INDEX, {
    ..._markData,
    text: undefined,
  }, `${props.message.channelId.toString()}+${props.message.id.toString()}`)

  messageCardStore.clear()
}

onMounted(async () => {
  const data = await db.get(StoreNames.MARK_INDEX, `${props.message.channelId.toString()}+${props.message.id.toString()}`)
  if (data)
    markData.value = data as MarkData
  mounted.value = true
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
          @click="btnClick"
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
        <ActionBtn :icons="['icon-park-outline:list-add']" :opacity="hoverImg && !markingTitleMeta ? '100' : '0'" transition />
        <ActionBtn
          v-if="markData" :icons="[markData.favourite ? 'line-md:star-filled' : 'line-md:star']"
          :highlight-index="markData.favourite ? 0 : undefined"
          :highlight-color="markData.favourite ? ['#fde047', '#facc15', '#eab308'] : undefined"
          :opacity="hoverImg && !markingTitleMeta ? '100' : '0'" transition
          @click="favouriteClick"
        />
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
          <span v-if="!delay300">{{ props.message!.message }}</span>
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
