<!-- src/views/Conflicts.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Conflict Report</h1>
      <p class="text-gray-600 mt-1">Identify and resolve booking conflicts</p>
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
        <p class="text-gray-500 mt-4">Analyzing bookings...</p>
      </div>
    </div>

    <template v-else-if="report">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Bookings</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">{{ report.total_bookings }}</p>
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

        <div class="bg-white rounded-xl shadow-sm border border-red-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-red-600">Conflicts</p>
              <p class="text-3xl font-bold text-red-700 mt-1">
                {{ report.summary.total_conflicts }}
              </p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-red-600"
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
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-orange-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-orange-600">Overlaps</p>
              <p class="text-3xl font-bold text-orange-700 mt-1">
                {{ report.summary.total_overlaps }}
              </p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-orange-600"
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
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Gaps</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">{{ report.summary.total_gaps }}</p>
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
      </div>

      <!-- Status Banner -->
      <div :class="getStatusBannerClass" class="rounded-xl shadow-sm border p-6">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <component :is="getStatusIcon" class="w-8 h-8" />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold mb-1">{{ getStatusTitle }}</h3>
            <p class="text-sm opacity-90">{{ getStatusDescription }}</p>
          </div>
        </div>
      </div>

      <!-- Exact Conflicts -->
      <div
        v-if="report.conflicts.length > 0"
        class="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden"
      >
        <div class="bg-red-50 px-6 py-4 border-b border-red-200">
          <h2 class="text-lg font-semibold text-red-900 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Exact Conflicts ({{ report.conflicts.length }})
          </h2>
          <p class="text-sm text-red-700 mt-1">These bookings have identical date and time</p>
        </div>
        <div class="divide-y divide-red-100">
          <div v-for="(conflict, index) in report.conflicts" :key="index" class="p-6">
            <div class="space-y-3">
              <div class="bg-red-50 rounded-lg p-4 border border-red-200">
                <div class="font-semibold text-red-900 mb-1">
                  {{ conflict.booking.title || 'Untitled Booking' }}
                </div>
                <div class="text-sm text-red-700">
                  {{ formatDate(conflict.booking.date) }} •
                  {{ formatTime(conflict.booking.start_time) }} -
                  {{ formatTime(conflict.booking.end_time) }}
                </div>
              </div>
              <div class="pl-4 space-y-2">
                <p class="text-sm font-medium text-gray-700">Conflicts with:</p>
                <div
                  v-for="(item, idx) in conflict.conflicting_with"
                  :key="idx"
                  class="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <div class="text-sm font-medium text-gray-900">
                    {{ item.title || 'Untitled Booking' }}
                  </div>
                  <div class="text-xs text-gray-600 mt-1">
                    {{ formatDate(item.date) }} • {{ formatTime(item.start_time) }} -
                    {{ formatTime(item.end_time) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Overlapping Bookings -->
      <div
        v-if="report.overlaps.length > 0"
        class="bg-white rounded-xl shadow-sm border border-orange-200 overflow-hidden"
      >
        <div class="bg-orange-50 px-6 py-4 border-b border-orange-200">
          <h2 class="text-lg font-semibold text-orange-900 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Overlapping Bookings ({{ report.overlaps.length }})
          </h2>
          <p class="text-sm text-orange-700 mt-1">These bookings have partial time overlaps</p>
        </div>
        <div class="divide-y divide-orange-100">
          <div v-for="(overlap, index) in report.overlaps" :key="index" class="p-6">
            <div class="space-y-3">
              <div class="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div class="font-semibold text-orange-900 mb-1">
                  {{ overlap.booking.title || 'Untitled Booking' }}
                </div>
                <div class="text-sm text-orange-700">
                  {{ formatDate(overlap.booking.date) }} •
                  {{ formatTime(overlap.booking.start_time) }} -
                  {{ formatTime(overlap.booking.end_time) }}
                </div>
                <div class="text-xs text-orange-600 mt-2">
                  Overlap duration: {{ overlap.overlap_duration }}
                </div>
              </div>
              <div class="pl-4 space-y-2">
                <p class="text-sm font-medium text-gray-700">Overlaps with:</p>
                <div
                  v-for="(item, idx) in overlap.overlapping_with"
                  :key="idx"
                  class="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <div class="text-sm font-medium text-gray-900">
                    {{ item.title || 'Untitled Booking' }}
                  </div>
                  <div class="text-xs text-gray-600 mt-1">
                    {{ formatDate(item.date) }} • {{ formatTime(item.start_time) }} -
                    {{ formatTime(item.end_time) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gaps -->
      <div
        v-if="report.gaps.length > 0"
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Time Gaps ({{ report.gaps.length }})
          </h2>
          <p class="text-sm text-gray-600 mt-1">Gaps between consecutive bookings</p>
        </div>
        <div class="divide-y divide-gray-100">
          <div v-for="(gap, index) in report.gaps" :key="index" class="p-6">
            <div class="flex flex-col md:flex-row md:items-center gap-4">
              <div class="flex-1 space-y-2">
                <div class="text-sm text-gray-600">
                  {{ formatDate(gap.date) }}
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-medium text-gray-500">Gap Duration:</span>
                  <span class="text-sm font-semibold text-blue-600">{{
                    gap.gap_duration_formatted
                  }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <div class="text-sm text-gray-700 text-right">
                  <div>{{ gap.between[0].title || 'Untitled' }}</div>
                  <div class="text-xs text-gray-500">{{ formatTime(gap.between[0].end_time) }}</div>
                </div>
                <svg
                  class="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
                <div class="text-sm text-gray-700">
                  <div>{{ gap.between[1].title || 'Untitled' }}</div>
                  <div class="text-xs text-gray-500">
                    {{ formatTime(gap.between[1].start_time) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Suggestions -->
      <div
        v-if="report.suggestions && report.suggestions.length > 0"
        class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6"
      >
        <h2 class="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          Smart Suggestions
        </h2>
        <div class="space-y-3">
          <div
            v-for="(suggestion, index) in report.suggestions"
            :key="index"
            class="bg-white rounded-lg p-4 border border-blue-200"
          >
            <div class="flex items-start gap-3">
              <div
                class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-900">{{ suggestion.message }}</p>
                <span
                  class="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded"
                >
                  {{ suggestion.type }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Issues -->
      <div
        v-if="!report.summary.has_issues"
        class="bg-green-50 rounded-xl shadow-sm border border-green-200 p-12"
      >
        <div class="text-center">
          <svg
            class="w-24 h-24 text-green-500 mx-auto mb-4"
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
          <h3 class="text-2xl font-bold text-green-900 mb-2">All Clear!</h3>
          <p class="text-green-700">No conflicts or overlaps detected in your bookings.</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, h } from 'vue'
import { useBookingStore } from '../stores/booking'
import { useBooking } from '../composables/useBooking'

const bookingStore = useBookingStore()
const { formatTime, formatDate } = useBooking()

const report = computed(() => bookingStore.conflictReport)

const getStatusBannerClass = computed(() => {
  const status = report.value?.summary?.status
  if (status === 'critical') return 'bg-red-50 border-red-200'
  if (status === 'warning') return 'bg-orange-50 border-orange-200'
  return 'bg-green-50 border-green-200'
})

const getStatusIcon = computed(() => {
  const status = report.value?.summary?.status
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
})

const getStatusTitle = computed(() => {
  const status = report.value?.summary?.status
  if (status === 'critical') return 'Critical Issues Detected'
  if (status === 'warning') return 'Warning: Overlaps Found'
  return 'System Healthy'
})

const getStatusDescription = computed(() => {
  const status = report.value?.summary?.status
  if (status === 'critical') return 'You have exact conflicts that need immediate attention'
  if (status === 'warning') return 'Some bookings have time overlaps that may need adjustment'
  return 'Your booking schedule looks great with no conflicts'
})

onMounted(async () => {
  await bookingStore.fetchBookings()
  await bookingStore.fetchConflictReport()
})
</script>
