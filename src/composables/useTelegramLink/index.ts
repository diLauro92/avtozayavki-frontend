import { computed, onUnmounted, ref } from 'vue'
import * as telegramApi from '@/api/telegram.api'
import { ApiError } from '@/api/http'
import { useAuthStore } from '@/stores'
import { TELEGRAM_POLL_INTERVAL, TELEGRAM_POLL_LIMIT } from '@/constants/polling'

export const useTelegramLink = () => {
  const authStore = useAuthStore()

  const link = ref<string | null>(null)
  const isBusy = ref(false)
  const error = ref<string | null>(null)

  let pollingId: ReturnType<typeof setInterval> | null = null
  let attempts = 0

  const isLinked = computed(() => authStore.user?.telegram_linked === true)

  const stopWaiting = () => {
    if (pollingId !== null) {
      clearInterval(pollingId)
      pollingId = null
    }

    attempts = 0
  }

  const startWaiting = () => {
    stopWaiting()

    pollingId = setInterval(async () => {
      attempts += 1

      await authStore.fetchUser()

      if (isLinked.value) {
        stopWaiting()
        link.value = null

        return
      }

      if (attempts >= TELEGRAM_POLL_LIMIT) stopWaiting()
    }, TELEGRAM_POLL_INTERVAL)
  }

  const issue = async () => {
    isBusy.value = true
    error.value = null

    try {
      link.value = await telegramApi.issueLink()
      startWaiting()
    } catch (requestError) {
      error.value =
        requestError instanceof ApiError ? requestError.message : 'Не удалось получить ссылку'
    } finally {
      isBusy.value = false
    }
  }

  const remove = async () => {
    isBusy.value = true
    error.value = null

    try {
      await telegramApi.unlink()
      await authStore.fetchUser()

      stopWaiting()
      link.value = null
    } catch (requestError) {
      error.value =
        requestError instanceof ApiError ? requestError.message : 'Не удалось отвязать аккаунт'
    } finally {
      isBusy.value = false
    }
  }

  onUnmounted(stopWaiting)

  return { link, isBusy, error, isLinked, issue, remove }
}
