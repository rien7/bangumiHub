import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import Login from './components/login/Login.vue'
import Dashboard from './components/dashboard/Dashboard.vue'
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/login', component: Login },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')
