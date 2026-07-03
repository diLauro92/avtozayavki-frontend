import 'virtual:svg-icons-register'
import '@/assets/scss/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useTheme } from "@/composables/useTheme";

const app = createApp(App)

app.use(createPinia())
app.use(router)

useTheme().initTheme()

app.mount('#app')
