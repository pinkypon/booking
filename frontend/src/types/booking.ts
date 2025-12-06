// frontend/src/types/booking.ts
export interface Booking {
  id: number
  user_id: number
  date: string
  start_time: string
  end_time: string
  title?: string
  description?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at?: string
  updated_at?: string
}

export interface ConflictItem {
  booking: Booking
  conflicting_with: Booking[]
}

export interface OverlapItem {
  booking: Booking
  overlapping_with: Booking[]
  overlap_duration: string
}

export interface GapItem {
  between: [Booking, Booking]
  gap_duration_minutes: number
  gap_duration_formatted: string
  date: string
}

export interface Suggestion {
  type: string
  message: string
  gap?: GapItem
  date?: string
}

export interface ConflictReport {
  total_bookings: number
  conflicts: ConflictItem[]
  overlaps: OverlapItem[]
  gaps: GapItem[]
  suggestions: Suggestion[]
  summary: {
    total_conflicts: number
    total_overlaps: number
    total_gaps: number
    has_issues: boolean
    status: 'critical' | 'warning' | 'healthy'
  }
}

export interface BookingFormData {
  date: string
  start_time: string
  end_time: string
  title?: string
  description?: string
  status?: 'pending' | 'confirmed' | 'cancelled'
}
