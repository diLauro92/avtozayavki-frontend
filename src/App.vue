<script setup lang="ts">
import ThemeToggle from '@/common-components/theme-toggle/index.vue'
import { useAuthStore } from "@/stores";
import { useRouter } from "vue-router";

const authStore = useAuthStore()
const router = useRouter()

async function handleLogout(): Promise<void> {
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="app-shell">
    <header class="app-shell__bar">
      <span class="app-shell__brand">АвтоЗаявки</span>
      <div class="app-shell__actions">
        <ThemeToggle />

        <button
          v-if="authStore.isAuthenticated"
          class="app-shell__logout"
          type="button"
          @click="handleLogout"
        >
          Выйти
        </button>
      </div>
    </header>

    <main class="app-shell__body">
      <RouterView />
    </main>
  </div>
</template>

<style src="./app.scss" lang="scss"></style>
