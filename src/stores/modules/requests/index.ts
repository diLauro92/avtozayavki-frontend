// src/stores/modules/requests/index.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Request, RequestStatus } from '@/types'
import { fetchRequests, updateRequestStatus } from '@/api/requests.api'

export const useRequestsStore = defineStore('requests', () => {
  const list = ref<Request[]>([])
  const isLoaded = ref(false)

  async function loadRequests(): Promise<void> {
    if (isLoaded.value) return

    list.value = await fetchRequests()
    isLoaded.value = true
  }

  async function changeStatus(id: number, status: RequestStatus): Promise<void> {
    const updated = await updateRequestStatus(id, status)

    //  кладем заявку ИЗ ОТВЕТА бэка, не собранную вручную
    list.value = list.value.map((request) => request.id === updated.id ? updated : request)
  }

  return {
    list,
    isLoaded,
    loadRequests,
    changeStatus
  }
})
