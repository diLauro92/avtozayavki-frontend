import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { User } from "@/types";
import * as authApi from '@/api/auth.api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => user.value !== null)

  async function login(email: string, password: string): Promise<void> {
    user.value = await authApi.login(email, password)
  }

  // восстановление сессии при старте (F5)
  async function fetchUser(): Promise<void> {
    try {
      user.value = await authApi.fetchUser()
    } catch {
      user.value = null // 401 = сессия мертва, чистим
    }
  }

  // полный выход
  async function logout(): Promise<void> {
    await authApi.logout()
    user.value = null
  }


  return {
    user,
    isAuthenticated,
    login,
    fetchUser,
    logout
  }
})
