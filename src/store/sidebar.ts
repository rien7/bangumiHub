import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { getShadeColor as _getShadeColor } from '@/components/dashboard/sidebar/getMainColor'

const useSidebarStore = defineStore('sidebar', () => {
  const colors = reactive<{ url: string; color: string }[]>([])

  function addColors(url: string, color: string) {
    const _color = colors.filter(color => color.url === url)[0]
    if (_color)
      colors.filter(color => color.url === url)[0].color = color
    else
      colors.push({ url, color })
  }

  return {
    colors,
    addColors,
  }
})

export default useSidebarStore
