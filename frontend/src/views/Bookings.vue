<!-- src/views/Bookings.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p class="text-gray-600 mt-1">Manage your booking schedule</p>
      </div>
      <button
        @click="openCreateModal"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        New Booking
      </button>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search bookings..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              class="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <!-- Status Filter -->
        <div>
          <select
            v-model="statusFilter"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <!-- Date Filter -->
        <div>
          <select
            v-model="dateFilter"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Dates</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="bookingStore.loading"
      class="bg-white rounded-xl shadow-sm border border-gray-200 p-12"
    >
      <div class="text-center">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"
        ></div>
        <p class="text-gray-500 mt-4">Loading bookings...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredBookings.length === 0"
      class="bg-white rounded-xl shadow-sm border border-gray-200 p-12"
    >
      <div class="text-center">
        <svg
          class="w-24 h-24 text-gray-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
        <p class="text-gray-500 mb-6">Create your first booking to get started</p>
        <button
          @click="openCreateModal"
          class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Booking
        </button>
      </div>
    </div>

    <!-- Bookings List -->
    <div v-else class="space-y-6">
      <div
        v-for="(bookings, date) in groupedByDate"
        :key="date"
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <!-- Date Header -->
        <div class="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 class="font-semibold text-gray-900">{{ formatDate(date) }}</h3>
        </div>

        <!-- Bookings for Date -->
        <div class="divide-y divide-gray-200">
          <div
            v-for="booking in bookings"
            :key="booking.id"
            :class="getConflictColor(booking.id)"
            class="p-6 hover:bg-gray-50 transition"
          >
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <!-- Booking Info -->
              <div class="flex-1">
                <div class="flex items-start gap-3">
                  <div
                    class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-lg font-semibold text-gray-900 truncate">
                      {{ booking.title || 'Untitled Booking' }}
                    </h4>
                    <p v-if="booking.description" class="text-sm text-gray-600 mt-1">
                      {{ booking.description }}
                    </p>
                    <div class="flex flex-wrap items-center gap-4 mt-2">
                      <div class="flex items-center gap-2 text-sm text-gray-600">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span
                          >{{ formatTime(booking.start_time) }} -
                          {{ formatTime(booking.end_time) }}</span
                        >
                      </div>
                      <div class="flex items-center gap-2 text-sm text-gray-600">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        <span>{{ booking.duration_minutes }} minutes</span>
                      </div>
                      <span
                        class="px-2 py-1 rounded-full text-xs font-medium border"
                        :class="getStatusColor(booking.status)"
                      >
                        {{ booking.status }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2">
                <button
                  @click="openEditModal(booking)"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Edit"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  @click="deleteBooking(booking.id)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Form Modal -->
    <BookingModal
      v-if="showModal"
      :booking="selectedBooking"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBookingStore } from '../stores/booking'
import { useBooking } from '../composables/useBooking'
import BookingModal from '../components/BookingModal.vue'

const bookingStore = useBookingStore()
const {
  searchQuery,
  statusFilter,
  dateFilter,
  filteredBookings,
  groupedByDate,
  showModal,
  selectedBooking,
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
} = useBooking()

const handleSubmit = async (bookingData) => {
  if (selectedBooking.value) {
    await updateBooking(selectedBooking.value.id, bookingData)
  } else {
    await createBooking(bookingData)
  }
}

onMounted(async () => {
  await bookingStore.fetchBookings()
  await bookingStore.fetchConflictReport()
})
</script>
