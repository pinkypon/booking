// frontend/src/stores/booking.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import api from '../api/axios'
import type { Booking, ConflictReport, BookingFormData } from '../types/booking'

// Generate unique tab ID on module load
const TAB_ID = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
console.log(`🆔 [Store] Tab ID initialized: ${TAB_ID}`)

export const useBookingStore = defineStore('booking', () => {
  // State
  const bookings = ref<Booking[]>([])
  const conflictReport = ref<ConflictReport | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Getters
  const sortedBookings = computed<Booking[]>(() => {
    return [...bookings.value].sort((a, b) => {
      if (a.date !== b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      return a.start_time.localeCompare(b.start_time)
    })
  })

  const upcomingBookings = computed<Booking[]>(() => {
    const today = new Date().toISOString().split('T')[0]
    if (!today) return sortedBookings.value
    return sortedBookings.value.filter((b) => b.date >= today)
  })

  const pastBookings = computed<Booking[]>(() => {
    const today = new Date().toISOString().split('T')[0]
    if (!today) return []
    return sortedBookings.value.filter((b) => b.date < today)
  })

  const hasConflicts = computed<boolean>(() => {
    return conflictReport.value?.summary?.has_issues || false
  })

  // Helper function to manage ignored booking IDs (tab-specific)
  function addToIgnoreList(bookingId: number, action: 'create' | 'update' | 'delete'): void {
    // Include TAB_ID in the key so each tab has its own ignore list
    const key = `ignore_ws_${action}_${bookingId}_${TAB_ID}`
    localStorage.setItem(key, Date.now().toString())
    console.log(`🔒 [Store ${TAB_ID}] Added to ignore list: ${key}`)

    // Auto-remove after 5 seconds
    setTimeout(() => {
      localStorage.removeItem(key)
      console.log(`🔓 [Store ${TAB_ID}] Removed from ignore list: ${key}`)
    }, 5000)
  }

  function shouldIgnoreWebSocket(
    bookingId: number,
    action: 'create' | 'update' | 'delete',
  ): boolean {
    // Check ONLY this tab's ignore list
    const key = `ignore_ws_${action}_${bookingId}_${TAB_ID}`
    const timestamp = localStorage.getItem(key)

    if (!timestamp) {
      console.log(`✅ [Store ${TAB_ID}] No ignore flag for ${action} booking ${bookingId}`)
      return false
    }

    // Check if it's been less than 5 seconds
    const elapsed = Date.now() - parseInt(timestamp)
    if (elapsed < 5000) {
      console.log(
        `⏭️ [Store ${TAB_ID}] IGNORING WebSocket ${action} for booking ${bookingId} (${elapsed}ms ago)`,
      )
      return true
    }

    // Clean up expired entry
    localStorage.removeItem(key)
    console.log(`🧹 [Store ${TAB_ID}] Cleaned up expired ignore flag for ${key}`)
    return false
  }

  // Actions
  async function fetchBookings(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await api.get<{ data: Booking[] }>('/bookings')
      bookings.value = response.data.data
      console.log(`📚 [Store ${TAB_ID}] Fetched ${bookings.value.length} bookings`)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch bookings'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createBooking(bookingData: BookingFormData): Promise<Booking> {
    loading.value = true
    error.value = null

    try {
      console.log(`📤 [Store ${TAB_ID}] Creating booking via API...`)
      const response = await api.post<{ data: Booking }>('/bookings', bookingData)
      const newBooking = response.data.data
      console.log(`✅ [Store ${TAB_ID}] API returned new booking with ID: ${newBooking.id}`)

      // Add to ignore list IMMEDIATELY after getting response
      addToIgnoreList(newBooking.id, 'create')

      // Check if booking already exists (safety check)
      const exists = bookings.value.find((b) => b.id === newBooking.id)
      if (!exists) {
        bookings.value.push(newBooking)
        console.log(`➕ [Store ${TAB_ID}] Added booking ${newBooking.id} to local store`)
      } else {
        console.log(`⚠️ [Store ${TAB_ID}] Booking ${newBooking.id} already exists, skipping`)
      }

      await fetchConflictReport()
      return newBooking
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create booking'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateBooking(id: number, bookingData: BookingFormData): Promise<Booking> {
    loading.value = true
    error.value = null

    try {
      console.log(`📤 [Store ${TAB_ID}] Updating booking ${id} via API...`)
      const response = await api.put<{ data: Booking }>(`/bookings/${id}`, bookingData)
      const updatedBooking = response.data.data
      console.log(`✅ [Store ${TAB_ID}] API returned updated booking ${id}`)

      // Add to ignore list IMMEDIATELY after getting response
      addToIgnoreList(id, 'update')

      const index = bookings.value.findIndex((b) => b.id === id)
      if (index !== -1) {
        bookings.value[index] = updatedBooking
        console.log(`✏️ [Store ${TAB_ID}] Updated booking ${id} in local store at index ${index}`)
      } else {
        console.log(`⚠️ [Store ${TAB_ID}] Booking ${id} not found in local store`)
      }

      await fetchConflictReport()
      return updatedBooking
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update booking'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteBooking(id: number): Promise<void> {
    loading.value = true
    error.value = null

    try {
      console.log(`📤 [Store ${TAB_ID}] Deleting booking ${id} via API...`)
      await api.delete(`/bookings/${id}`)
      console.log(`✅ [Store ${TAB_ID}] API confirmed deletion of booking ${id}`)

      // Add to ignore list IMMEDIATELY after getting response
      addToIgnoreList(id, 'delete')

      const initialLength = bookings.value.length
      bookings.value = bookings.value.filter((b) => b.id !== id)
      const newLength = bookings.value.length
      console.log(
        `🗑️ [Store ${TAB_ID}] Removed booking ${id} from local store (${initialLength} → ${newLength})`,
      )

      await fetchConflictReport()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete booking'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchConflictReport(): Promise<void> {
    try {
      const response = await api.get<{ data: ConflictReport }>('/bookings/conflicts/report')
      conflictReport.value = response.data.data
    } catch (err: any) {
      console.error('Failed to fetch conflict report:', err)
      conflictReport.value = null
    }
  }

  function clearError(): void {
    error.value = null
  }

  // WebSocket helper actions
  function addBookingFromWebSocket(booking: Booking): void {
    console.log(`📥 [WebSocket → Store ${TAB_ID}] Received CREATE event for booking ${booking.id}`)

    // Check if we should ignore this WebSocket event
    if (shouldIgnoreWebSocket(booking.id, 'create')) {
      console.log(`⏭️ [WebSocket → Store ${TAB_ID}] Skipping CREATE for booking ${booking.id}`)
      return
    }

    // Check if booking already exists
    const exists = bookings.value.find((b) => b.id === booking.id)

    if (!exists) {
      console.log(`➕ [WebSocket → Store ${TAB_ID}] Adding NEW booking ${booking.id} to store`)
      bookings.value.unshift(booking)
      console.log(`✅ [WebSocket → Store ${TAB_ID}] Total bookings now: ${bookings.value.length}`)
    } else {
      console.log(`⚠️ [WebSocket → Store ${TAB_ID}] Booking ${booking.id} already exists, skipping`)
    }
  }

  function updateBookingFromWebSocket(booking: Booking): void {
    console.log(`📥 [WebSocket → Store ${TAB_ID}] Received UPDATE event for booking ${booking.id}`)

    // Check if we should ignore this WebSocket event
    if (shouldIgnoreWebSocket(booking.id, 'update')) {
      console.log(`⏭️ [WebSocket → Store ${TAB_ID}] Skipping UPDATE for booking ${booking.id}`)
      return
    }

    const index = bookings.value.findIndex((b) => b.id === booking.id)

    if (index !== -1) {
      console.log(
        `✏️ [WebSocket → Store ${TAB_ID}] Updating booking ${booking.id} at index ${index}`,
      )
      bookings.value[index] = { ...booking }
      console.log(`✅ [WebSocket → Store ${TAB_ID}] Booking ${booking.id} updated successfully`)
    } else {
      console.log(
        `⚠️ [WebSocket → Store ${TAB_ID}] Booking ${booking.id} not found, adding as new (fallback)`,
      )
      bookings.value.unshift(booking)
    }
  }

  function removeBookingFromWebSocket(bookingId: number): void {
    console.log(`📥 [WebSocket → Store ${TAB_ID}] Received DELETE event for booking ${bookingId}`)

    // Check if we should ignore this WebSocket event
    if (shouldIgnoreWebSocket(bookingId, 'delete')) {
      console.log(`⏭️ [WebSocket → Store ${TAB_ID}] Skipping DELETE for booking ${bookingId}`)
      return
    }

    const index = bookings.value.findIndex((b) => b.id === bookingId)

    if (index !== -1) {
      console.log(`🔍 [WebSocket → Store ${TAB_ID}] Found booking ${bookingId} at index ${index}`)
      const initialLength = bookings.value.length
      bookings.value.splice(index, 1)
      console.log(
        `🗑️ [WebSocket → Store ${TAB_ID}] Removed booking ${bookingId} (${initialLength} → ${bookings.value.length})`,
      )
    } else {
      console.log(`⚠️ [WebSocket → Store ${TAB_ID}] Booking ${bookingId} not found in array`)
    }
  }

  return {
    // State
    bookings,
    conflictReport,
    loading,
    error,
    // Getters
    sortedBookings,
    upcomingBookings,
    pastBookings,
    hasConflicts,
    // Actions
    fetchBookings,
    createBooking,
    updateBooking,
    deleteBooking,
    fetchConflictReport,
    clearError,
    // WebSocket actions
    addBookingFromWebSocket,
    updateBookingFromWebSocket,
    removeBookingFromWebSocket,
  }
})
