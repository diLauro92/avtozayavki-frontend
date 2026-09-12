import type { CreateRequestPayload, Request, RequestStatus } from '@/types'
import { http } from './http'
import type { RequestDetails } from '@/types/request.ts'

interface ListResponse<T> {
  data: T[]
}

interface ItemResponse<T> {
  data: T
}

export async function fetchRequests(): Promise<Request[]> {
  const response = await http.get<ListResponse<Request>>('/api/requests')

  return response.data.data
}

export async function fetchRequestById(id: number): Promise<RequestDetails> {
  const response = await http.get<ItemResponse<RequestDetails>>(`/api/requests/${id}`)

  return response.data.data
}

export async function updateRequestStatus(id: number, status: RequestStatus): Promise<Request> {
  const response = await http.patch<ItemResponse<Request>>(`/api/requests/${id}/status`, { status })

  return response.data.data
}

export async function createRequest(payload: CreateRequestPayload): Promise<Request> {
  const { data } = await http.post<ItemResponse<Request>>('/api/requests', payload)

  return data.data
}
