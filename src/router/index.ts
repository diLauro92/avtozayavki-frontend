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
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/routes/settings-page/index.vue'),
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('@/routes/legal-page/index.vue'),
      props: { slug: 'privacy' },
      meta: { public: true },
    },
    {
      path: '/consent',
      name: 'consent',
      component: () => import('@/routes/legal-page/index.vue'),
      props: { slug: 'consent' },
      meta: { public: true },
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('@/routes/legal-page/index.vue'),
      props: { slug: 'terms' },
      meta: { public: true },
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
  const isPublicPage = to.meta.public === true

  // если не залогинен кидаем на логин и запоминаем, куда шли
  if (!authStore.isAuthenticated && !isLoginPage && !isPublicPage) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // залогинен - редиректим на ленту
  if (authStore.isAuthenticated && isLoginPage) {
    return { name: 'requests' }
  }
})

export default router
