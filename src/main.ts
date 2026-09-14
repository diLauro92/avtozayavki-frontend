import 'virtual:svg-icons-register'
import '@/assets/scss/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useTheme } from "@/composables/useTheme";
import { useAuthStore } from '@/stores'
import { setUnauthorizedHandler } from '@/api/http.ts'

const app = createApp(App)

app.use(createPinia())
app.use(router)

useTheme().initTheme()

setUnauthorizedHandler(() => {
  useAuthStore().resetUser()

  const currentRoute = router.currentRoute.value

  if (currentRoute.name === 'login') return

  router.push({ name: 'login', query: { redirect: currentRoute.fullPath } })
})

app.mount('#app')
