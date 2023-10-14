import { defineConfig } from 'vite'
import UnoCss from 'unocss/vite'
import vue from '@vitejs/plugin-vue'
import nodePolyfills from 'vite-plugin-node-stdlib-browser'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCss(),
    nodePolyfills(),
  ],
})
