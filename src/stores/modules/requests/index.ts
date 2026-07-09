// src/stores/modules/requests/index.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { CreateRequestPayload, Request, RequestStatus } from '@/types'
import { createRequest as createRequestApi, fetchRequests, updateRequestStatus } from '@/api/requests.api'

export const useRequestsStore = defineStore('requests', () => {
  const list = ref<Request[]>([])
  const isLoaded = ref(false)

  async function loadRequests(): Promise<void> {
    if (isLoaded.value) return

    list.value = await fetchRequests()
    isLoaded.value = true
  }

  // без guard, без флага
  async function refreshRequests(): Promise<void> {
    list.value = await fetchRequests()
  }

  async function changeStatus(id: number, status: RequestStatus): Promise<void> {
    const updated = await updateRequestStatus(id, status)

    //  кладем заявку ИЗ ОТВЕТА бэка, не собранную вручную
    list.value = list.value.map((request) => request.id === updated.id ? updated : request)
  }

  async function createRequest(payload: CreateRequestPayload): Promise<Request> {
    const newRequest = await createRequestApi(payload)

    list.value = [newRequest, ...list.value]

    return newRequest
  }

  return {
    list,
    isLoaded,
    loadRequests,
    changeStatus,
    createRequest,
    refreshRequests
  }
})
