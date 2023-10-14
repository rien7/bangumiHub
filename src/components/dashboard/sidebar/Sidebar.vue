<script setup lang="ts">
import { provide, ref } from 'vue'
import SidebarBtn from './SidebarBtn.vue'
import SvgIcon from './SvgIcon.vue'
import ImageIcon from './ImageIcon.vue'
import SidebarGroup from './SidebarGroup.vue'

const expand = ref(false)
provide('expand', expand)
</script>

<template>
  <div
    :w="expand ? '250px' : '50px'" h-100vh
    border-r="1px solid gray-200"
    transition-all
  >
    <SidebarGroup title="Channel" icon="mingcute:horn-line">
      <SidebarBtn text="Boqi" :clickable="true">
        <ImageIcon
          src="https://misskey.gothloli.club/files/thumbnail-b33eb87d-3911-4987-9304-d934b6d79f97/thumbnail-b33eb87d-3911-4987-9304-d934b6d79f97.jpg"
        />
      </SidebarBtn>
      <SidebarBtn text="Boqi" :clickable="true">
        <ImageIcon
          src="https://misskey.gothloli.club/files/thumbnail-b33eb87d-3911-4987-9304-d934b6d79f97/thumbnail-b33eb87d-3911-4987-9304-d934b6d79f97.jpg"
        />
      </SidebarBtn>
    </SidebarGroup>

    <SidebarBtn
      text="Menu" :clickable="true"
      absolute bottom-0
      @click="expand = !expand"
    >
      <SvgIcon icon="line-md:menu" />
    </SidebarBtn>
  </div>
</template>
