export type RequestStatus =
  | 'new'
  | 'contacted'
  | 'assigned'
  | 'processing'
  | 'success'
  | 'lost'
  | 'follow_up'

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
  files: string[] | null
  status: RequestStatus
  responsible_id: number | null
  comment: string | null
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
