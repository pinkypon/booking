<!-- src/components/BookingModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="fixed inset-0 z-50 overflow-y-auto" @click.self="$emit('close')">
        <div class="flex min-h-screen items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

          <!-- Modal -->
          <div class="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 md:p-8">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-900">
                {{ isEditing ? 'Edit Booking' : 'Create New Booking' }}
              </h2>
              <button @click="$emit('close')" class="p-2 hover:bg-gray-100 rounded-lg transition">
                <svg
                  class="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Title -->
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  id="title"
                  v-model="form.title"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter booking title"
                />
              </div>

              <!-- Description -->
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  v-model="form.description"
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Add booking details..."
                ></textarea>
              </div>

              <!-- Date -->
              <div>
                <label for="date" class="block text-sm font-medium text-gray-700 mb-2">
                  Date <span class="text-red-500">*</span>
                </label>
                <input
                  id="date"
                  v-model="form.date"
                  type="date"
                  required
                  :min="minDate"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <!-- Time Range -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="start_time" class="block text-sm font-medium text-gray-700 mb-2">
                    Start Time <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="start_time"
                    v-model="form.start_time"
                    type="time"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label for="end_time" class="block text-sm font-medium text-gray-700 mb-2">
                    End Time <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="end_time"
                    v-model="form.end_time"
                    type="time"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <!-- Duration Display -->
              <div
                v-if="calculatedDuration"
                class="bg-blue-50 border border-blue-200 rounded-lg p-4"
              >
                <div class="flex items-center gap-2">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span class="text-sm text-blue-900 font-medium">
                    Duration: {{ calculatedDuration }}
                  </span>
                </div>
              </div>

              <!-- Status -->
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  v-model="form.status"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <!-- Error Message -->
              <div
                v-if="errorMessage"
                class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
              >
                {{ errorMessage }}
              </div>

              <!-- Actions -->
              <div class="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  @click="$emit('close')"
                  class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="!isSubmitting">
                    {{ isEditing ? 'Update Booking' : 'Create Booking' }}
                  </span>
                  <span v-else class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'

const props = defineProps({
  booking: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'submit'])

const isEditing = computed(() => !!props.booking)
const isSubmitting = ref(false)
const errorMessage = ref('')

const minDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const form = reactive({
  title: '',
  description: '',
  date: '',
  start_time: '',
  end_time: '',
  status: 'pending',
})

// Initialize form with booking data if editing
if (props.booking) {
  Object.assign(form, {
    title: props.booking.title || '',
    description: props.booking.description || '',
    date: props.booking.date,
    start_time: props.booking.start_time,
    end_time: props.booking.end_time,
    status: props.booking.status,
  })
}

const calculatedDuration = computed(() => {
  if (!form.start_time || !form.end_time) return null

  const [startHour, startMin] = form.start_time.split(':').map(Number)
  const [endHour, endMin] = form.end_time.split(':').map(Number)

  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin

  if (endMinutes <= startMinutes) return null

  const duration = endMinutes - startMinutes
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`
  } else if (hours > 0) {
    return `${hours}h`
  } else {
    return `${minutes}m`
  }
})

const validateForm = () => {
  errorMessage.value = ''

  if (!form.date || !form.start_time || !form.end_time) {
    errorMessage.value = 'Please fill in all required fields'
    return false
  }

  const [startHour, startMin] = form.start_time.split(':').map(Number)
  const [endHour, endMin] = form.end_time.split(':').map(Number)

  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin

  if (endMinutes <= startMinutes) {
    errorMessage.value = 'End time must be after start time'
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    await emit('submit', { ...form })
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'An error occurred'
  } finally {
    isSubmitting.value = false
  }
}

// Clear error when form changes
watch(form, () => {
  errorMessage.value = ''
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
