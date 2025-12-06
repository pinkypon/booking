// frontend/src/composables/useBooking.ts
import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { useBookingStore } from '../stores/booking'
import { useToast } from './useToast'
import type { Booking, BookingFormData } from '../types/booking'

interface UseBookingReturn {
  isSubmitting: Ref<boolean>
  selectedBooking: Ref<Booking | null>
  showModal: Ref<boolean>
  searchQuery: Ref<string>
  statusFilter: Ref<string>
  dateFilter: Ref<string>
  filteredBookings: ComputedRef<Booking[]>
  groupedByDate: ComputedRef<Record<string, Booking[]>>
  openCreateModal: () => void
  openEditModal: (booking: Booking) => void
  closeModal: () => void
  createBooking: (bookingData: BookingFormData) => Promise<void>
  updateBooking: (id: number, bookingData: BookingFormData) => Promise<void>
  deleteBooking: (id: number) => Promise<void>
  formatTime: (time: string | undefined) => string // ✅ Changed here
  formatDate: (dateString: string) => string
  getStatusColor: (status: Booking['status']) => string
  getConflictColor: (bookingId: number) => string
}

export function useBooking(): UseBookingReturn {
  const bookingStore = useBookingStore()
  const { showToast } = useToast()

  const isSubmitting = ref(false)
  const selectedBooking = ref<Booking | null>(null)
  const showModal = ref(false)

  // Filter and search functionality
  const searchQuery = ref('')
  const statusFilter = ref('all')
  const dateFilter = ref('all')

  const filteredBookings = computed(() => {
    let filtered = [...bookingStore.sortedBookings]

    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(
        (booking) =>
          booking.title?.toLowerCase().includes(query) ||
          booking.description?.toLowerCase().includes(query) ||
          booking.date.includes(query),
      )
    }

    // Status filter
    if (statusFilter.value !== 'all') {
      filtered = filtered.filter((booking) => booking.status === statusFilter.value)
    }

    // Date filter
    const today = new Date().toISOString().split('T')[0]
    if (today && dateFilter.value === 'upcoming') {
      filtered = filtered.filter((booking) => booking.date >= today)
    } else if (today && dateFilter.value === 'past') {
      filtered = filtered.filter((booking) => booking.date < today)
    }

    return filtered
  })

  const groupedByDate = computed(() => {
    const groups: Record<string, Booking[]> = {}
    filteredBookings.value.forEach((booking) => {
      const date = booking.date
      if (date) {
        if (!groups[date]) {
          groups[date] = []
        }
        groups[date].push(booking)
      }
    })
    return groups
  })

  const openCreateModal = () => {
    selectedBooking.value = null
    showModal.value = true
  }

  const openEditModal = (booking: Booking) => {
    selectedBooking.value = { ...booking }
    showModal.value = true
  }

  const closeModal = () => {
    selectedBooking.value = null
    showModal.value = false
  }

  const createBooking = async (bookingData: BookingFormData): Promise<void> => {
    isSubmitting.value = true
    try {
      await bookingStore.createBooking(bookingData)
      showToast('Booking created successfully', 'success')
      closeModal()
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to create booking', 'error')
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  const updateBooking = async (id: number, bookingData: BookingFormData): Promise<void> => {
    isSubmitting.value = true
    try {
      await bookingStore.updateBooking(id, bookingData)
      showToast('Booking updated successfully', 'success')
      closeModal()
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to update booking', 'error')
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  const deleteBooking = async (id: number): Promise<void> => {
    if (!confirm('Are you sure you want to delete this booking?')) return

    try {
      await bookingStore.deleteBooking(id)
      showToast('Booking deleted successfully', 'success')
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to delete booking', 'error')
    }
  }

  const formatTime = (time: string | undefined): string => {
    if (!time) return ''

    const parts = time.split(':')
    if (parts.length < 2) return ''

    const hours = parts[0]
    const minutes = parts[1]

    if (!hours || !minutes) return '' // Extra safety check

    const hour = parseInt(hours, 10) // ✅ Add radix parameter
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: Booking['status']): string => {
    const colors: Record<Booking['status'], string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    }
    return colors[status] || colors.pending
  }

  const getConflictColor = (bookingId: number): string => {
    const report = bookingStore.conflictReport
    if (!report) return ''

    const hasConflict = report.conflicts.some(
      (c) => c.booking.id === bookingId || c.conflicting_with.some((b) => b.id === bookingId),
    )

    const hasOverlap = report.overlaps.some(
      (o) => o.booking.id === bookingId || o.overlapping_with.some((b) => b.id === bookingId),
    )

    if (hasConflict) return 'border-l-4 border-red-500 bg-red-50'
    if (hasOverlap) return 'border-l-4 border-orange-500 bg-orange-50'
    return ''
  }

  return {
    // State
    isSubmitting,
    selectedBooking,
    showModal,
    searchQuery,
    statusFilter,
    dateFilter,

    // Computed
    filteredBookings,
    groupedByDate,

    // Methods
    openCreateModal,
    openEditModal,
    closeModal,
    createBooking,
    updateBooking,
    deleteBooking,
    formatTime,
    formatDate,
    getStatusColor,
    getConflictColor,
  }
}
