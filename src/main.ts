import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import Video from './components/video/Video.vue'
import Login from './components/login/Login.vue'
import Dashboard from './components/dashboard/Dashboard.vue'
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/login', component: Login },
  { path: '/video/:id', component: Video },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')
