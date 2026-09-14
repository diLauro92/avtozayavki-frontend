// src/stores/modules/requests/index.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { CreateRequestPayload, Request, RequestStatus } from '@/types'
import {
  addComment as addCommentApi,
  createRequest as createRequestApi,
  fetchRequestById,
  fetchRequests,
  updateNextContact as updateNextContactApi,
  updateRequestStatus,
} from '@/api/requests.api'
import type { RequestDetails } from '@/types/request.ts'

export const useRequestsStore = defineStore('requests', () => {
  const list = ref<Request[]>([])
  const isLoaded = ref(false)
  const lastSyncedAt = ref<Date | null>(null)
  const isStale = ref(false)
  const current = ref<RequestDetails | null>(null)
  const isCurrentLoading = ref(false)

  async function loadRequests(): Promise<void> {
    if (isLoaded.value) return

    list.value = await fetchRequests()
    isLoaded.value = true
    lastSyncedAt.value = new Date()
  }

  // без guard, без флага
  async function refreshRequests(): Promise<void> {
    try {
      list.value = await fetchRequests()
      lastSyncedAt.value = new Date()
      isStale.value = false
    } catch {
      isStale.value = true
    }
  }

  async function changeStatus(id: number, status: RequestStatus): Promise<void> {
    const updated = await updateRequestStatus(id, status)

    //  кладем заявку ИЗ ОТВЕТА бэка, не собранную вручную
    list.value = list.value.map((request) => (request.id === updated.id ? updated : request))

    if (current.value?.id === id) {
      await loadRequest(id)
    }
  }

  async function createRequest(payload: CreateRequestPayload): Promise<Request> {
    const newRequest = await createRequestApi(payload)

    list.value = [newRequest, ...list.value]

    return newRequest
  }

  async function loadRequest(id: number): Promise<void> {
    if (current.value?.id !== id) {
      current.value = null
      isCurrentLoading.value = true
    }

    try {
      current.value = await fetchRequestById(id)
    } finally {
      isCurrentLoading.value = false
    }
  }

  async function addComment(id: number, body: string): Promise<void> {
    await addCommentApi(id, body)
    await loadRequest(id)
  }

  async function saveNextContact(id: number, nextContactAt: string | null): Promise<void> {
    await updateNextContactApi(id, nextContactAt)
    await loadRequest(id)
  }

  return {
    list,
    isLoaded,
    loadRequests,
    changeStatus,
    createRequest,
    refreshRequests,
    current,
    isCurrentLoading,
    loadRequest,
    lastSyncedAt,
    isStale,
    addComment,
    saveNextContact,
  }
})
