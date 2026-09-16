export type RequestStatus =
  'new' | 'contacted' | 'assigned' | 'processing' | 'success' | 'lost' | 'follow_up'

export type RequestSource = 'telegram' | 'manual'

export type RequestUrgency = 'today' | 'soon' | 'planned' | 'emergency'

export interface Request {
  id: number
  source: RequestSource
  client_name: string | null
  phone: string
  car_info: string | null
  problem: string
  urgency: RequestUrgency | null
  status: RequestStatus
  responsible_id: number | null
  next_contact_at: string | null
  request_type: 'client'
  created_at: string
  updated_at: string
}

export interface CreateRequestPayload {
  source: RequestSource
  phone: string
  problem: string
  client_name?: string
  car_info?: string
  urgency?: RequestUrgency
}

export type SlaZone = 'fresh' | 'warning' | 'overdue'

export interface RequestResponsible {
  id: number
  name: string
}

export interface StatusHistoryItem {
  id: number
  old_status: RequestStatus | null
  new_status: RequestStatus
  changed_by_name: string | null
  created_at: string | null
}

export interface RequestDetails extends Request {
  responsible: RequestResponsible | null
  status_history: StatusHistoryItem[]
  comments: Comment[]
  photos: Photo[]
}

export interface Comment {
  id: number
  body: string
  author_name: string | null
  created_at: string
}

export interface RequestEvent {
  id: string
  type: 'status' | 'comment'
  createdAt: string | null
  authorName: string | null
  text: string
  status?: RequestStatus
}

export interface RequestHistoryItem {
  id: number
  status: RequestStatus
  problem: string
  car_info: string | null
  created_at: string
}

export interface Photo {
  id: number
  url: string
  thumb_url: string
  width: number
  height: number
  source: RequestSource
  created_at: string
}
