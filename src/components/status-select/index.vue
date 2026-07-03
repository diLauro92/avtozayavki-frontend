<script setup lang="ts">
import { computed, ref } from 'vue'

import type { RequestStatus } from '@/types'
import { getStatusText, getStatusColor, REQUEST_STATUS_ORDER } from '@/helpers/request'
import { useRequestsStore } from '@/stores'
import StatusBadge from '@/components/status-badge/index.vue'
import Icon from '@/common-components/icon/index.vue'

interface Props {
  requestId: number
  status: RequestStatus
}

const props = defineProps<Props>()

const store = useRequestsStore()

const isOpen = ref(false)

const options = computed(() =>
  REQUEST_STATUS_ORDER.map((status) => ({
    status,
    text: getStatusText(status),
    color: getStatusColor(status),
  })),
)

function toggle(): void {
  isOpen.value = !isOpen.value
}

function close(): void {
  isOpen.value = false
}

async function select(status: RequestStatus): Promise<void> {
  await store.changeStatus(props.requestId, status)
  close()
}
</script>

<template>
  <div class="status-select">
    <button class="status-select__trigger" type="button" @click="toggle">
      <StatusBadge :status="status" />
      <Icon icon-name="chevron" :size="14" class="status-select__chevron" />
    </button>

    <template v-if="isOpen">
      <div class="status-select__backdrop" @click="close" />

      <ul class="status-select__menu">
        <li v-for="option in options" :key="option.status">
          <button
            class="status-select__option"
            :class="{ 'status-select__option--active': option.status === status }"
            type="button"
            @click="select(option.status)"
          >
            <span class="status-select__dot" :class="`status-select__dot--${option.color}`" />
            {{ option.text }}
          </button>
        </li>
      </ul>
    </template>
  </div>
</template>

<style src="./style.scss" lang="scss"></style>
