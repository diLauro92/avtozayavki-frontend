<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import type { RequestHistoryItem } from '@/types'
import { formatDateTime } from '@/helpers/format'
import { fetchRequestHistory } from '@/api/requests.api.ts'
import { ApiError } from '@/api/http.ts'

import StatusBadge from '@/components/status-badge/index.vue'
import Icon from '@/common-components/icon/index.vue'

interface Props {
  requestId: number
}

const props = defineProps<Props>()

const items = ref<RequestHistoryItem[]>([])
const total = ref(0)
const isLoading = ref(false)
const errorMessage = ref('')
const openedId = ref<number | null>(null)
const isOpen = ref(true)

const rows = computed(() =>
  items.value.map((item) => ({
    id: item.id,
    status: item.status,
    problem: item.problem,
    carInfo: item.car_info,
    date: formatDateTime(item.created_at),
  })),
)

const load = async () => {
  isLoading.value = true
  errorMessage.value = ''
  openedId.value = null

  try {
    const response = await fetchRequestHistory(props.requestId)

    items.value = response.data
    total.value = response.total
  } catch (error) {
    errorMessage.value = error instanceof ApiError ? error.message : 'Не удалось загрузить историю'
  } finally {
    isLoading.value = false
  }
}

const toggle = (id: number) => {
  openedId.value = openedId.value === id ? null : id
}

onMounted(() => {
  isOpen.value = window.matchMedia('(min-width: 1366px)').matches
  load()
})

watch(() => props.requestId, load)
</script>

<template>
  <section class="client-history">
    <button
      class="client-history__toggle"
      :class="{ 'client-history__toggle--open': isOpen }"
      type="button"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      История клиента
      <Icon icon-name="chevron" :size="14" class="client-history__icon" />
    </button>

    <template v-if="isOpen">
      <p v-if="isLoading" class="client-history__note">Загружаем…</p>

      <p v-else-if="errorMessage" class="client-history__error">{{ errorMessage }}</p>

      <p v-else-if="total === 0" class="client-history__note">Первое обращение</p>

      <template v-else>
        <p class="client-history__note">Обращался раньше: {{ total }}</p>

        <ul class="client-history__list">
          <li v-for="row in rows" :key="row.id" class="client-history__item">
            <button
              class="client-history__row"
              type="button"
              :aria-expanded="openedId === row.id"
              @click="toggle(row.id)"
            >
              <span class="client-history__number">#{{ row.id }}</span>
              <span class="client-history__date">{{ row.date }}</span>
              <StatusBadge :status="row.status" />
            </button>

            <div v-if="openedId === row.id" class="client-history__details">
              <p class="client-history__problem">{{ row.problem }}</p>

              <p v-if="row.carInfo" class="client-history__car">{{ row.carInfo }}</p>

              <RouterLink
                class="client-history__link"
                :to="{ name: 'request', params: { id: row.id } }"
              >
                Открыть заявку
              </RouterLink>
            </div>
          </li>
        </ul>
      </template>
    </template>
  </section>
</template>

<style src="./style.scss" lang="scss"></style>
