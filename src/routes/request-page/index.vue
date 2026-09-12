<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import type { RequestStatus } from '@/types'
import { useRequestsStore } from '@/stores'
import { useNow } from '@/composables/useNow'
import { ApiError } from '@/api/http'
import { formatDateTime, formatPhone } from '@/helpers/format'
import {
  getSlaMinutes,
  getSlaProgress,
  getSlaZone,
  getSourceText,
  getStatusColor,
  getStatusText,
  getUrgencyText,
} from '@/helpers/request'
import Icon from '@/common-components/icon/index.vue'
import StatusSelect from '@/components/status-select/index.vue'
import SlaIndicator from '@/components/sla-indicator/index.vue'

const route = useRoute()
const store = useRequestsStore()
const { now } = useNow()

const errorMessage = ref('')

const requestId = computed(() => Number(route.params.id))
const request = computed(() => store.current)

const slaZone = computed(() => (request.value ? getSlaZone(request.value, now.value) : null))
const slaProgress = computed(() => (request.value ? getSlaProgress(request.value, now.value) : 0))
const slaMinutes = computed(() => (request.value ? getSlaMinutes(request.value, now.value) : 0))

const facts = computed(() => {
  const item = request.value

  if (!item) return []

  return [
    { key: 'Авто', value: item.car_info ?? '—' },
    { key: 'Срочность', value: item.urgency ? getUrgencyText(item.urgency) : '—' },
    { key: 'Источник', value: getSourceText(item.source) },
    { key: 'Ответственный', value: item.responsible?.name ?? 'не назначен' },
    { key: 'Создана', value: formatDateTime(item.created_at) },
  ]
})

function eventTime(iso: string | null): string {
  return iso ? formatDateTime(iso) : 'время неизвестно'
}

function eventText(oldStatus: RequestStatus | null, newStatus: RequestStatus): string {
  if (!oldStatus) return 'Заявка создана'

  return `${getStatusText(oldStatus)} → ${getStatusText(newStatus)}`
}

onMounted(async () => {
  try {
    await store.loadRequest(requestId.value)
  } catch (error) {
    errorMessage.value =
      error instanceof ApiError && error.status === 404
        ? 'Заявка не найдена. Возможно, её удалили.'
        : 'Не удалось загрузить заявку. Обновите страницу.'
  }
})
</script>

<template>
  <section class="request-page">
    <RouterLink class="request-page__back" :to="{ name: 'requests' }">
      <Icon icon-name="chevron" :size="14" class="request-page__back-icon" />
      К ленте
    </RouterLink>

    <p v-if="errorMessage" class="request-page__error">{{ errorMessage }}</p>

    <p v-else-if="store.isCurrentLoading" class="request-page__loading">Загружаем заявку…</p>

    <template v-else-if="request">
      <header class="request-page__hero">
        <div class="request-page__hero-top">
          <span class="request-page__num">#{{ request.id }}</span>

          <div class="request-page__hero-meta">
            <SlaIndicator
              v-if="slaZone"
              :zone="slaZone"
              :progress="slaProgress"
              :minutes="slaMinutes"
            />

            <StatusSelect :request-id="request.id" :status="request.status" />
          </div>
        </div>

        <h1 class="request-page__client">{{ request.client_name ?? 'Без имени' }}</h1>

        <a class="request-page__phone" :href="`tel:+${request.phone}`">
          {{ formatPhone(request.phone) }}
        </a>

        <a class="request-page__call" :href="`tel:+${request.phone}`">Позвонить</a>
      </header>

      <p class="request-page__problem">{{ request.problem }}</p>

      <dl class="request-page__facts">
        <div v-for="fact in facts" :key="fact.key" class="request-page__fact">
          <dt class="request-page__fact-key">{{ fact.key }}</dt>
          <dd class="request-page__fact-value">{{ fact.value }}</dd>
        </div>
      </dl>

      <h2 class="request-page__subtitle">История</h2>

      <ol class="request-page__timeline">
        <li
          v-for="item in request.status_history"
          :key="item.id"
          class="request-page__event"
          :class="`request-page__event--${getStatusColor(item.new_status)}`"
        >
          <time class="request-page__event-time">{{ eventTime(item.created_at) }}</time>
          <span class="request-page__event-text">{{
            eventText(item.old_status, item.new_status)
          }}</span>
          <span class="request-page__event-author">{{ item.changed_by_name ?? 'система' }}</span>
        </li>
      </ol>
    </template>
  </section>
</template>

<style src="./style.scss" lang="scss"></style>
