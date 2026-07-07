// src/helpers/request/index.ts
import type { Request, RequestSource, RequestStatus, RequestUrgency, SlaZone } from '@/types'

const SLA_WARNING_MINUTES = 15 // жёлтая зона от 15 мин
const SLA_OVERDUE_MINUTES = 60 // красная от 60 мин
const SLA_FULL_MINUTES = 60 // дуга полная

type StatusColor = 'new' | 'work' | 'done' | 'lost'

const STATUS_TEXT: Record<RequestStatus, string> = {
  new: 'Новая',
  contacted: 'Связались',
  assigned: 'Назначено',
  processing: 'В работе',
  success: 'Закрыта успешно',
  lost: 'Потеряна',
  follow_up: 'Повторное касание',
}

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

export function getSlaZone(request: Request, nowMS: number): SlaZone | null {
  if (request.status !== 'new') return null // только new заявки

  const createdMs = new Date(request.created_at).getTime()
  const ageMinutes = (nowMS - createdMs) / 60000 // возраст заявки в минутах

  if (ageMinutes >= SLA_OVERDUE_MINUTES)
    return 'overdue'

  if (ageMinutes >= SLA_WARNING_MINUTES)
    return 'warning'

  return 'fresh'
}

export function getSlaProgress(request: Request, nowMs: number): number {
  const createdMs = new Date(request.created_at).getTime()
  const ageMinutes = (nowMs - createdMs) / 60000
  const progress = (ageMinutes / SLA_FULL_MINUTES) * 100 // % от 60 мин

  return Math.max(0, Math.min(progress, 100))
}

export function getSlaMinutes(request: Request, nowMs: number): number {
  const createdMs = new Date(request.created_at).getTime()
  const ageMinutes = (nowMs - createdMs) / 60000

  return Math.max(0, Math.floor(ageMinutes))
}
