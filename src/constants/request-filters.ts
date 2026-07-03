import type { RequestStatus } from '@/types'

export type FilterKey = 'all' | 'new' | 'work' | 'closed'

export interface FilterTab {
  key: FilterKey
  label: string
  statuses: RequestStatus[]
}

export const REQUEST_FILTERS: FilterTab[] = [
  { key: 'all', label: 'Все', statuses: [] },
  { key: 'new', label: 'Новые', statuses: ['new', 'contacted'] },
  { key: 'work', label: 'В работе', statuses: ['assigned', 'processing', 'follow_up'] },
  { key: 'closed', label: 'Закрытые', statuses: ['success', 'lost'] },
]
