import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import UnoCss from 'unocss/vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import nodePolyfills from 'vite-plugin-node-stdlib-browser'
import topLevelAwait from 'vite-plugin-top-level-await'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCss(),
    nodePolyfills(),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: '__tla',
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: i => `__tla_${i}`,
    }),
    VitePWA({
      devOptions: {
        enabled: true,
      },
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src/workers',
      filename: 'worker.ts',
      injectManifest: {
        injectionPoint: undefined,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '#root': resolve(__dirname),
    },
  },
})
