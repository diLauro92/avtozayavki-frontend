<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import type { RequestDetails, RequestEvent, RequestStatus } from '@/types'
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
const workError = ref('')

const commentInput = ref('')
const nextContactInput = ref('')

const isSavingComment = ref(false)
const isSavingNextContact = ref(false)

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

const events = computed<RequestEvent[]>(() => {
  const item = request.value

  if (!item) return []

  const statusEvents: RequestEvent[] = item.status_history.map((entry) => ({
    id: `status-${entry.id}`,
    type: 'status',
    createdAt: entry.created_at,
    authorName: entry.changed_by_name,
    text: entry.old_status
      ? `${getStatusText(entry.old_status)} → ${getStatusText(entry.new_status)}`
      : 'Заявка создана',
    status: entry.new_status,
  }))

  const commentEvents: RequestEvent[] = item.comments.map((comment) => ({
    id: `comment-${comment.id}`,
    type: 'comment',
    createdAt: comment.created_at,
    authorName: comment.author_name,
    text: comment.body,
  }))

  return [...statusEvents, ...commentEvents].sort((a, b) => {
    return new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime()
  })
})

function toInputValue(iso: string | null): string {
  if (!iso) return ''

  const date = new Date(iso)
  const pad = (value: number) => String(value).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function eventTime(iso: string | null): string {
  return iso ? formatDateTime(iso) : 'время неизвестно'
}

async function saveComment(): Promise<void> {
  workError.value = ''
  isSavingComment.value = true

  try {
    await store.addComment(requestId.value, commentInput.value.trim())
    commentInput.value = ''
  } catch (error) {
    workError.value = error instanceof ApiError ? error.message : 'Не удалось добавить комментарий.'
  } finally {
    isSavingComment.value = false
  }
}

async function saveNextContact(): Promise<void> {
  workError.value = ''
  isSavingNextContact.value = true

  try {
    const value = nextContactInput.value ? new Date(nextContactInput.value).toISOString() : null

    await store.saveNextContact(requestId.value, value)
  } catch (error) {
    workError.value = error instanceof ApiError ? error.message : 'Не удалось сохранить дату.'
  } finally {
    isSavingNextContact.value = false
  }
}

watch(request, (value: RequestDetails | null) => {
  nextContactInput.value = toInputValue(value?.next_contact_at ?? null)
})

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

      <h2 class="request-page__subtitle">Работа по заявке</h2>

      <div class="request-page__work">
        <div class="request-page__field">
          <label class="request-page__label" for="next-contact">Перезвонить</label>

          <div class="request-page__row">
            <input
              id="next-contact"
              v-model="nextContactInput"
              class="request-page__input"
              type="datetime-local"
            />

            <button
              class="request-page__action"
              type="button"
              :disabled="isSavingNextContact"
              @click="saveNextContact"
            >
              {{ isSavingNextContact ? 'Сохраняем…' : 'Сохранить' }}
            </button>
          </div>
        </div>

        <div class="request-page__field">
          <label class="request-page__label" for="comment">Комментарий</label>

          <textarea
            id="comment"
            v-model="commentInput"
            class="request-page__textarea"
            rows="3"
            placeholder="Что выяснили, о чём договорились"
          ></textarea>

          <button
            class="request-page__action"
            type="button"
            :disabled="!commentInput.trim() || isSavingComment"
            @click="saveComment"
          >
            {{ isSavingComment ? 'Добавляем…' : 'Добавить комментарий' }}
          </button>
        </div>

        <p v-if="workError" class="request-page__work-error">{{ workError }}</p>
      </div>

      <ol class="request-page__timeline">
        <li
          v-for="event in events"
          :key="event.id"
          class="request-page__event"
          :class="[
            `request-page__event--${event.type}`,
            event.status ? `request-page__event--${getStatusColor(event.status)}` : '',
          ]"
        >
          <time class="request-page__event-time">{{ eventTime(event.createdAt) }}</time>
          <span class="request-page__event-text">{{ event.text }}</span>
          <span class="request-page__event-author">{{ event.authorName ?? 'система' }}</span>
        </li>
      </ol>
    </template>
  </section>
</template>

<style src="./style.scss" lang="scss"></style>
