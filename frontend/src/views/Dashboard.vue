<!-- src/views/Dashboard.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600 mt-1">Welcome back, {{ authStore.user?.name }}</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Bookings</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ bookingStore.bookings.length }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Upcoming</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">
              {{ bookingStore.upcomingBookings.length }}
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg
              class="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Conflicts</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ conflictCount }}</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Status</p>
            <p class="text-lg font-semibold mt-1" :class="statusColor">{{ statusText }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg flex items-center justify-center" :class="statusBgColor">
            <svg
              class="w-6 h-6"
              :class="statusColor"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          @click="$router.push('/bookings')"
          class="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
        >
          <div
            class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition"
          >
            <svg
              class="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <div class="text-left">
            <p class="font-semibold text-gray-900">New Booking</p>
            <p class="text-xs text-gray-500">Create new</p>
          </div>
        </button>

        <button
          @click="$router.push('/conflicts')"
          class="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition group"
        >
          <div
            class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition"
          >
            <svg
              class="w-5 h-5 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div class="text-left">
            <p class="font-semibold text-gray-900">View Conflicts</p>
            <p class="text-xs text-gray-500">Check issues</p>
          </div>
        </button>

        <button
          @click="refreshData"
          class="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition group"
        >
          <div
            class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition"
          >
            <svg
              class="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <div class="text-left">
            <p class="font-semibold text-gray-900">Refresh Data</p>
            <p class="text-xs text-gray-500">Sync now</p>
          </div>
        </button>

        <router-link
          v-if="authStore.isAdmin"
          to="/admin"
          class="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition group"
        >
          <div
            class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition"
          >
            <svg
              class="w-5 h-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div class="text-left">
            <p class="font-semibold text-gray-900">Admin Panel</p>
            <p class="text-xs text-gray-500">Manage all</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Recent Bookings -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Recent Bookings</h2>
        <router-link to="/bookings" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All →
        </router-link>
      </div>

      <div v-if="bookingStore.loading" class="text-center py-8">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"
        ></div>
      </div>

      <div v-else-if="recentBookings.length === 0" class="text-center py-8">
        <svg
          class="w-16 h-16 text-gray-300 mx-auto mb-4"
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
        <p class="text-gray-500">No bookings yet</p>
        <button
          @click="$router.push('/bookings')"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Create Your First Booking
        </button>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="booking in recentBookings"
          :key="booking.id"
          class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900">{{ booking.title || 'Untitled Booking' }}</h3>
            <div class="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <span>{{ formatDate(booking.date) }}</span>
              <span>{{ formatTime(booking.start_time) }} - {{ formatTime(booking.end_time) }}</span>
            </div>
          </div>
          <div>
            <span
              class="px-3 py-1 rounded-full text-xs font-medium border"
              :class="getStatusColor(booking.status)"
            >
              {{ booking.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useBookingStore } from '../stores/booking'
import { useBooking } from '../composables/useBooking'
import { useToast } from '../composables/useToast'

const authStore = useAuthStore()
const bookingStore = useBookingStore()
const { formatTime, formatDate, getStatusColor } = useBooking()
const { showToast } = useToast()

const recentBookings = computed(() => {
  return bookingStore.sortedBookings.slice(0, 5)
})

const conflictCount = computed(() => {
  const report = bookingStore.conflictReport
  if (!report) return 0
  return (report.summary?.total_conflicts || 0) + (report.summary?.total_overlaps || 0)
})

const statusText = computed(() => {
  const report = bookingStore.conflictReport
  if (!report) return 'Unknown'
  return report.summary?.status === 'critical'
    ? 'Critical'
    : report.summary?.status === 'warning'
      ? 'Warning'
      : 'Healthy'
})

const statusColor = computed(() => {
  const report = bookingStore.conflictReport
  if (!report) return 'text-gray-600'
  return report.summary?.status === 'critical'
    ? 'text-red-600'
    : report.summary?.status === 'warning'
      ? 'text-orange-600'
      : 'text-green-600'
})

const statusBgColor = computed(() => {
  const report = bookingStore.conflictReport
  if (!report) return 'bg-gray-100'
  return report.summary?.status === 'critical'
    ? 'bg-red-100'
    : report.summary?.status === 'warning'
      ? 'bg-orange-100'
      : 'bg-green-100'
})

const refreshData = async () => {
  try {
    await Promise.all([bookingStore.fetchBookings(), bookingStore.fetchConflictReport()])
    showToast('Data refreshed successfully', 'success')
  } catch (error) {
    showToast('Failed to refresh data', 'error')
  }
}

onMounted(async () => {
  await refreshData()
})
</script>
