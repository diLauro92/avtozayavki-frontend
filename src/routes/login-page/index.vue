<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const remember = ref(true)

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const error = ref('')
const isLoading = ref(false)

const submitText = computed(() => (isLoading.value ? 'Входим…' : 'Войти'))

async function handleSubmit(): Promise<void> {
  error.value = ''
  isLoading.value = true

  try {
    await authStore.login(email.value, password.value, remember.value)
    const redirect = route.query.redirect

    router.push(typeof redirect === 'string' ? redirect : { name: 'requests' })
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

        <label class="login-page__remember">
          <input v-model="remember" class="login-page__checkbox" type="checkbox" />
          <span>Запомнить меня</span>
        </label>

        <p v-if="error" class="login-page__error">{{ error }}</p>

        <button class="login-page__submit" type="submit" :disabled="isLoading">
          {{ submitText }}
        </button>
      </form>
    </div>
  </div>
</template>

<style src="./style.scss" lang="scss"></style>
