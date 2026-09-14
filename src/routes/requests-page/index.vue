<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

import { REQUEST_FILTERS, type FilterKey } from '@/constants/request-filters'
import { useRequestsStore } from '@/stores'
import RequestCard from '@/components/request-card/index.vue'
import Modal from '@/common-components/modal/index.vue'
import ManualRequestForm from '@/components/manual-request-form/index.vue'
import Icon from '@/common-components/icon/index.vue'
import { POLLING_INTERVAL } from '@/constants/polling'
import { formatTime } from '@/helpers/format'

const store = useRequestsStore()

const activeFilter = ref<FilterKey>('all')

let pollingId: ReturnType<typeof setInterval> | null = null

const activeStatuses = computed(() => {
  const tab = REQUEST_FILTERS.find((filter) => filter.key === activeFilter.value)

  return tab ? tab.statuses : []
})

const filteredRequests = computed(() => {
  if (activeStatuses.value.length === 0) return store.list

  return store.list.filter((request) => activeStatuses.value.includes(request.status))
})

const isEmpty = computed(() => store.isLoaded && filteredRequests.value.length === 0)
const lastSyncedText = computed(() => {
  if (!store.lastSyncedAt) return 'Лента не обновляется'

  return `Лента не обновляется. Данные на ${formatTime(store.lastSyncedAt)}`
})

const isModalOpen = ref(false)

function openModal() {
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

function setFilter(key: FilterKey): void {
  activeFilter.value = key
}

onMounted(() => {
  store.loadRequests()

  pollingId = setInterval(() => {
    store.refreshRequests()
  }, POLLING_INTERVAL)
})

onUnmounted(() => {
  if (pollingId !== null) {
    clearInterval(pollingId)
    pollingId = null
  }
})
</script>

<template>
  <div class="requests-page">
    <header class="requests-page__head">
      <h1 class="requests-page__title">Входящие заявки</h1>

      <button class="requests-page__add" type="button" @click="openModal">Новая заявка</button>
    </header>

    <div class="requests-page__filters">
      <button
        v-for="filter in REQUEST_FILTERS"
        :key="filter.key"
        class="requests-page__chip"
        :class="{ 'requests-page__chip--active': filter.key === activeFilter }"
        type="button"
        @click="setFilter(filter.key)"
      >
        {{ filter.label }}
      </button>
    </div>

    <div v-if="store.isStale" class="requests-page__stale">
      <Icon icon-name="alert" :size="16" />

      <span class="requests-page__stale-text">{{ lastSyncedText }}</span>

      <button class="requests-page__stale-retry" type="button" @click="store.refreshRequests()">
        Обновить
      </button>
    </div>

    <p v-if="!store.isLoaded" class="requests-page__state">Загрузка…</p>
    <p v-else-if="isEmpty" class="requests-page__state">Заявок нет</p>

    <div v-else class="requests-page__feed">
      <RequestCard v-for="request in filteredRequests" :key="request.id" :request="request" />
    </div>
  </div>

  <Modal v-model:open="isModalOpen">
    <ManualRequestForm @success="closeModal" />
  </Modal>
</template>

<style src="./style.scss" lang="scss"></style>
