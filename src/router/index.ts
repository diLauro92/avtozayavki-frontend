import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/stores";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/requests',
    },
    {
      path: '/requests',
      name: 'requests',
      component: () => import('@/routes/requests-page/index.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/routes/login-page/index.vue'),
    },
    {
      path: '/requests/:id',
      name: 'request',
      component: () => import('@/routes/request-page/index.vue'),
    },
  ],
})

let sessionChecked = false

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // при первой навигации после загрузки - восстановить сессию (F5 уронил стор, но cookie жива)
  if (!sessionChecked) {
    await authStore.fetchUser()
    sessionChecked = true
  }

  const isLoginPage = to.name === 'login'

  // если не залогинен кидаем на логин
  if (!authStore.isAuthenticated && !isLoginPage) {
    return { name: 'login' }
  }

  // залогинен - редиректим на ленту
  if (authStore.isAuthenticated && isLoginPage) {
    return { name: 'requests' }
  }
})

export default router
