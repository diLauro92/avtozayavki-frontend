// src/helpers/request/index.ts
import type { RequestSource, RequestStatus, RequestUrgency } from '@/types'

const STATUS_TEXT: Record<RequestStatus, string> = {
  new: 'Новая',
  contacted: 'Связались',
  assigned: 'Назначено',
  processing: 'В работе',
  success: 'Закрыта успешно',
  lost: 'Потеряна',
  follow_up: 'Повторное касание',
}

type StatusColor = 'new' | 'work' | 'done' | 'lost'

const STATUS_COLOR: Record<RequestStatus, StatusColor> = {
  new: 'new',
  contacted: 'new',
  assigned: 'work',
  processing: 'work',
  follow_up: 'work',
  success: 'done',
  lost: 'lost',
}

const SOURCE_TEXT: Record<RequestSource, string> = {
  telegram: 'Telegram',
  manual: 'Вручную',
}

const URGENCY_TEXT: Record<RequestUrgency, string> = {
  today: 'Сегодня',
  soon: '1–2 дня',
  planned: 'Планово',
  emergency: 'Аварийно',
}

const SOURCE_ICON: Record<RequestSource, string> = {
  telegram: 'telegram',
  manual: 'edit',
}

export const REQUEST_STATUS_ORDER: RequestStatus[] = [
  'new',
  'contacted',
  'assigned',
  'processing',
  'success',
  'follow_up',
  'lost',
]

export function getStatusText(status: RequestStatus): string {
  return STATUS_TEXT[status]
}

export function getStatusColor(status: RequestStatus): StatusColor {
  return STATUS_COLOR[status]
}

export function getSourceText(source: RequestSource): string {
  return SOURCE_TEXT[source]
}

export function getUrgencyText(urgency: RequestUrgency): string {
  return URGENCY_TEXT[urgency]
}

export function getSourceIcon(source: RequestSource): string {
  return SOURCE_ICON[source]
}
