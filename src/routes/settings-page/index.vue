<script setup lang="ts">
import { computed } from 'vue'
import { useTelegramLink } from '@/composables/useTelegramLink'

const { link, isBusy, error, isLinked, issue, remove } = useTelegramLink()

const issueButtonText = computed(() =>
  link.value ? 'Получить новую ссылку' : 'Привязать Telegram',
)
</script>

<template>
  <div class="settings-page">
    <h1 class="settings-page__title">Настройки</h1>

    <section class="settings-page__card">
      <h2 class="settings-page__subtitle">Уведомления в Telegram</h2>

      <p class="settings-page__hint">
        Новые заявки, напоминания и просрочки приходят в Telegram тому, кто назначен ответственным.
        Чтобы получать их, привяжите свой аккаунт.
      </p>

      <p v-if="isLinked" class="settings-page__status settings-page__status--on">
        Аккаунт привязан
      </p>

      <p v-else class="settings-page__status">Аккаунт не привязан</p>

      <div v-if="link" class="settings-page__link-box">
        <a class="settings-page__link" :href="link" target="_blank" rel="noopener">
          Открыть бота и подтвердить
        </a>

        <p class="settings-page__waiting">
          Ждём подтверждения. Ссылка одноразовая и действует 15 минут.
        </p>
      </div>

      <p v-if="error" class="settings-page__error">{{ error }}</p>

      <div class="settings-page__actions">
        <button
          v-if="!isLinked"
          class="settings-page__button settings-page__button--accent"
          type="button"
          :disabled="isBusy"
          @click="issue"
        >
          {{ issueButtonText }}
        </button>

        <button
          v-else
          class="settings-page__button"
          type="button"
          :disabled="isBusy"
          @click="remove"
        >
          Отвязать
        </button>
      </div>
    </section>
  </div>
</template>

<style src="./style.scss" lang="scss"></style>
