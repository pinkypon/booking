<!-- src/views/Admin.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p class="text-gray-600 mt-1">Manage all users and bookings</p>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm">Total Bookings</p>
            <p class="text-3xl font-bold mt-1">{{ stats.total_bookings }}</p>
          </div>
          <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <div
        class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm">Total Users</p>
            <p class="text-3xl font-bold mt-1">{{ stats.total_users }}</p>
          </div>
          <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm">Today</p>
            <p class="text-3xl font-bold mt-1">{{ stats.bookings_today }}</p>
          </div>
          <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-sm p-6 text-white"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-orange-100 text-sm">This Week</p>
            <p class="text-3xl font-bold mt-1">{{ stats.bookings_this_week }}</p>
          </div>
          <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- System Status -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div :class="getStatusClass(stats.conflicts_summary?.status)" class="rounded-lg p-4 border">
          <div class="flex items-center gap-3">
            <component :is="getStatusIcon(stats.conflicts_summary?.status)" class="w-8 h-8" />
            <div>
              <p class="text-sm font-medium">Booking Health</p>
              <p class="text-lg font-bold capitalize">
                {{ stats.conflicts_summary?.status || 'Unknown' }}
              </p>
            </div>
          </div>
        </div>
        <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div class="flex items-center gap-3">
            <svg
              class="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p class="text-sm font-medium text-blue-900">Total Conflicts</p>
              <p class="text-lg font-bold text-blue-900">
                {{ stats.conflicts_summary?.total_conflicts || 0 }}
              </p>
            </div>
          </div>
        </div>
        <div class="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div class="flex items-center gap-3">
            <svg
              class="w-8 h-8 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <p class="text-sm font-medium text-orange-900">Total Overlaps</p>
              <p class="text-lg font-bold text-orange-900">
                {{ stats.conflicts_summary?.total_overlaps || 0 }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- All Bookings Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">All Bookings</h2>
        <button
          @click="refreshData"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      <div v-if="loading" class="p-12 text-center">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"
        ></div>
      </div>

      <div v-else-if="bookings.length === 0" class="p-12 text-center">
        <p class="text-gray-500">No bookings found</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                User
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Title
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Time
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Duration
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="booking in bookings" :key="booking.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                  >
                    {{ getUserInitials(booking.user?.name) }}
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ booking.user?.name }}</div>
                    <div class="text-xs text-gray-500">{{ booking.user?.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ booking.title || 'Untitled' }}
                </div>
                <div v-if="booking.description" class="text-xs text-gray-500 truncate max-w-xs">
                  {{ booking.description }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(booking.date) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ formatTime(booking.start_time) }} - {{ formatTime(booking.end_time) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full border"
                  :class="getStatusColor(booking.status)"
                >
                  {{ booking.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ booking.duration_minutes }}m
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import api from '../api/axios'
import { useBooking } from '../composables/useBooking'
import { useToast } from '../composables/useToast'

const { formatTime, formatDate, getStatusColor } = useBooking()
const { showToast } = useToast()

const loading = ref(false)
const bookings = ref([])
const stats = ref({
  total_bookings: 0,
  total_users: 0,
  bookings_today: 0,
  bookings_this_week: 0,
  conflicts_summary: {},
})

const getUserInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getStatusClass = (status) => {
  if (status === 'critical') return 'bg-red-50 border-red-200'
  if (status === 'warning') return 'bg-orange-50 border-orange-200'
  return 'bg-green-50 border-green-200'
}

const getStatusIcon = (status) => {
  if (status === 'critical') {
    return () =>
      h(
        'svg',
        {
          class: 'text-red-600',
          fill: 'none',
          stroke: 'currentColor',
          viewBox: '0 0 24 24',
        },
        [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
          }),
        ],
      )
  }
  if (status === 'warning') {
    return () =>
      h(
        'svg',
        {
          class: 'text-orange-600',
          fill: 'none',
          stroke: 'currentColor',
          viewBox: '0 0 24 24',
        },
        [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
          }),
        ],
      )
  }
  return () =>
    h(
      'svg',
      {
        class: 'text-green-600',
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24',
      },
      [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        }),
      ],
    )
}

const fetchAdminData = async () => {
  loading.value = true
  try {
    const [bookingsRes, dashboardRes] = await Promise.all([
      api.get('/admin/bookings'),
      api.get('/admin/dashboard'),
    ])

    bookings.value = bookingsRes.data.data
    stats.value = dashboardRes.data.data
  } catch (error) {
    showToast('Failed to load admin data', 'error')
  } finally {
    loading.value = false
  }
}

const refreshData = async () => {
  await fetchAdminData()
  showToast('Data refreshed successfully', 'success')
}

onMounted(() => {
  fetchAdminData()
})
</script>
