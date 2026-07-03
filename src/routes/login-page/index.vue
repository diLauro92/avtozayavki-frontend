<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores";
import { useRouter } from "vue-router";

const email = ref('')
const password = ref('')

const authStore = useAuthStore()
const router = useRouter()

const error = ref('')
const isLoading = ref(false)

const submitText = computed(() => (isLoading.value ? 'Входим…' : 'Войти'))

async function handleSubmit(): Promise<void> {
  error.value = ''
  isLoading.value = true

  try {
    await authStore.login(email.value, password.value)
    router.push({ name: 'requests' })
  } catch {
    error.value = 'Неверный email или пароль'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-page__card">
      <h1 class="login-page__title">Вход</h1>

      <form class="login-page__form" @submit.prevent="handleSubmit">
        <label class="login-page__field">
          <span class="login-page__label">Email</span>
          <input
            v-model="email"
            class="login-page__input"
            type="email"
            placeholder="admin@avto.local"
            autocomplete="username"
          />
        </label>

        <label class="login-page__field">
          <span class="login-page__label">Пароль</span>
          <input
            v-model="password"
            class="login-page__input"
            type="password"
            autocomplete="current-password"
          />
        </label>

        <p v-if="error" class="login-page__error">{{ error }}</p>

        <button
          class="login-page__submit"
          type="submit"
          :disabled="isLoading"
        >
          {{ submitText }}
        </button>
      </form>
    </div>
  </div>
</template>

<style src="./style.scss" lang="scss"></style>
