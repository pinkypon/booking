// src/composables/useWebSocket.ts
import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { useBookingStore } from '../stores/booking'
import { useToast } from './useToast'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import type { Booking } from '../types/booking'

// Extend Window interface for Pusher
declare global {
  interface Window {
    Pusher: typeof Pusher
    Echo?: Echo<any>
  }
}

window.Pusher = Pusher

let echoInstance: Echo<any> | null = null

interface BookingEvent {
  booking: Booking
}

interface BookingDeletedEvent {
  bookingId: number
}

export function useWebSocket() {
  const bookingStore = useBookingStore()
  const { showToast } = useToast()

  const isConnected = ref<boolean>(false)
  const connectionError = ref<string | null>(null)

  const initializeWebSocket = (): void => {
    try {
      if (!echoInstance) {
        console.log('🔌 Initializing WebSocket connection...')
        console.log('Environment variables:', {
          key: import.meta.env.VITE_REVERB_APP_KEY,
          host: import.meta.env.VITE_REVERB_HOST,
          port: import.meta.env.VITE_REVERB_PORT,
          scheme: import.meta.env.VITE_REVERB_SCHEME,
        })

        // Configure Echo for Reverb (Laravel's WebSocket server)
        echoInstance = new Echo({
          broadcaster: 'reverb',
          key: import.meta.env.VITE_REVERB_APP_KEY,
          wsHost: import.meta.env.VITE_REVERB_HOST,
          wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
          wssPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
          forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
          enabledTransports: ['ws', 'wss'],
          authEndpoint: '/broadcasting/auth',
          auth: {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        })

        window.Echo = echoInstance
      }

      console.log('📡 Subscribing to bookings channel...')

      // Listen to bookings channel
      const channel = echoInstance.channel('bookings')

      // Add connection state listeners
      channel
        .subscribed(() => {
          console.log('✅ Successfully subscribed to bookings channel')
        })
        .error((error: any) => {
          console.error('❌ Channel subscription error:', error)
        })

      // Listen to events
      channel
        .listen('.BookingCreated', (event: BookingEvent) => {
          console.log('🎉 BookingCreated event received:', event)
          handleBookingCreated(event.booking)
        })
        .listen('.BookingUpdated', (event: BookingEvent) => {
          console.log('📝 BookingUpdated event received:', event)
          handleBookingUpdated(event.booking)
        })
        .listen('.BookingDeleted', (event: BookingDeletedEvent) => {
          console.log('🗑️ BookingDeleted event received:', event)
          handleBookingDeleted(event.bookingId)
        })

      isConnected.value = true
      connectionError.value = null
      console.log('✅ WebSocket connected to Reverb')
    } catch (error: any) {
      console.error('❌ WebSocket connection error:', error)
      connectionError.value = error?.message || 'WebSocket connection failed'
      isConnected.value = false
    }
  }

  const handleBookingCreated = (booking: Booking): void => {
    console.log('🎉 [WebSocket] BookingCreated event handler triggered')
    console.log('📦 [WebSocket] Booking data:', booking)

    // Get current user ID
    const currentUserId = parseInt(localStorage.getItem('user_id') || '0')

    // Add the booking (store will handle duplicate check)
    bookingStore.addBookingFromWebSocket(booking)

    // Only show notification if it's from another user
    if (booking.user_id !== currentUserId) {
      showToast(`New booking created: ${booking.title || 'Untitled'}`, 'success')
    }

    bookingStore.fetchConflictReport()
  }

  const handleBookingUpdated = (booking: Booking): void => {
    console.log('📝 [WebSocket] BookingUpdated event handler triggered')
    console.log('📦 [WebSocket] Booking data:', booking)

    // Get current user ID
    const currentUserId = parseInt(localStorage.getItem('user_id') || '0')

    // Update the booking (store will handle duplicate check)
    bookingStore.updateBookingFromWebSocket(booking)

    // Only show notification if it's from another user
    if (booking.user_id !== currentUserId) {
      showToast(`Booking updated: ${booking.title || 'Untitled'}`, 'info')
    }

    bookingStore.fetchConflictReport()
  }

  const handleBookingDeleted = (bookingId: number): void => {
    console.log('🗑️ [WebSocket] BookingDeleted event handler triggered')
    console.log('🔢 [WebSocket] Booking ID:', bookingId)

    // Get current user ID
    const currentUserId = parseInt(localStorage.getItem('user_id') || '0')
    const booking = bookingStore.bookings.find((b) => b.id === bookingId)

    // Remove the booking (store will handle duplicate check)
    bookingStore.removeBookingFromWebSocket(bookingId)

    // Only show notification if it's from another user
    if (booking && booking.user_id !== currentUserId) {
      showToast('A booking was deleted', 'info')
    }

    bookingStore.fetchConflictReport()
  }

  const disconnectWebSocket = (): void => {
    if (echoInstance) {
      console.log('🔌 Disconnecting WebSocket...')
      echoInstance.disconnect()
      isConnected.value = false
      console.log('🔌 WebSocket disconnected')
    }
  }

  onMounted(() => {
    initializeWebSocket()
  })

  onUnmounted(() => {
    disconnectWebSocket()
  })

  return {
    isConnected,
    connectionError,
    initializeWebSocket,
    disconnectWebSocket,
  }
}
