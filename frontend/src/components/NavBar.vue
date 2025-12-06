<!-- src/components/NavBar.vue -->
<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and Brand -->
        <div class="flex items-center gap-8">
          <router-link to="/dashboard" class="flex items-center gap-2">
            <div
              class="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span class="text-xl font-bold text-gray-900 hidden sm:block">BookingHub</span>
          </router-link>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-1">
            <router-link
              to="/dashboard"
              class="px-3 py-2 rounded-lg text-sm font-medium transition"
              :class="
                isActive('/dashboard')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              "
            >
              Dashboard
            </router-link>
            <router-link
              to="/bookings"
              class="px-3 py-2 rounded-lg text-sm font-medium transition"
              :class="
                isActive('/bookings')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              "
            >
              Bookings
            </router-link>
            <router-link
              to="/conflicts"
              class="px-3 py-2 rounded-lg text-sm font-medium transition relative"
              :class="
                isActive('/conflicts')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              "
            >
              Conflicts
              <span
                v-if="bookingStore.hasConflicts"
                class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
              ></span>
            </router-link>
            <router-link
              v-if="authStore.isAdmin"
              to="/admin"
              class="px-3 py-2 rounded-lg text-sm font-medium transition"
              :class="
                isActive('/admin') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
              "
            >
              Admin
            </router-link>
          </div>
        </div>

        <!-- User Menu -->
        <div class="flex items-center gap-4">
          <!-- Connection Status -->
          <div class="hidden sm:flex items-center gap-2 text-xs">
            <div
              :class="isConnected ? 'bg-green-500' : 'bg-gray-400'"
              class="w-2 h-2 rounded-full animate-pulse"
            ></div>
            <span class="text-gray-600">{{ isConnected ? 'Live' : 'Offline' }}</span>
          </div>

          <!-- User Dropdown -->
          <div class="relative" ref="dropdownRef">
            <button
              @click="toggleDropdown"
              class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              <div
                class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold"
              >
                {{ userInitials }}
              </div>
              <span class="text-sm font-medium text-gray-700 hidden sm:block">{{
                authStore.user?.name
              }}</span>
              <svg
                class="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <Transition name="dropdown">
              <div
                v-if="showDropdown"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
              >
                <div class="px-4 py-2 border-b border-gray-100">
                  <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ authStore.user?.email }}</p>
                </div>
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Logout</span>
                  </div>
                </button>
              </div>
            </Transition>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg hover:bg-gray-50 transition"
          >
            <svg
              class="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <Transition name="mobile">
        <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200 py-2">
          <router-link
            to="/dashboard"
            @click="closeMobileMenu"
            class="block px-4 py-2 text-sm font-medium rounded-lg transition"
            :class="
              isActive('/dashboard') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
            "
          >
            Dashboard
          </router-link>
          <router-link
            to="/bookings"
            @click="closeMobileMenu"
            class="block px-4 py-2 text-sm font-medium rounded-lg transition"
            :class="
              isActive('/bookings') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
            "
          >
            Bookings
          </router-link>
          <router-link
            to="/conflicts"
            @click="closeMobileMenu"
            class="block px-4 py-2 text-sm font-medium rounded-lg transition"
            :class="
              isActive('/conflicts') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
            "
          >
            Conflicts
          </router-link>
          <router-link
            v-if="authStore.isAdmin"
            to="/admin"
            @click="closeMobileMenu"
            class="block px-4 py-2 text-sm font-medium rounded-lg transition"
            :class="
              isActive('/admin') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
            "
          >
            Admin
          </router-link>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useBookingStore } from '../stores/booking'
import { useWebSocket } from '../composables/useWebSocket'

const route = useRoute()
const authStore = useAuthStore()
const bookingStore = useBookingStore()
const { isConnected } = useWebSocket()

const showDropdown = ref(false)
const showMobileMenu = ref(false)
const dropdownRef = ref(null)

const userInitials = computed(() => {
  const name = authStore.user?.name || ''
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const isActive = (path) => {
  return route.path === path
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const handleLogout = () => {
  showDropdown.value = false
  authStore.logout()
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.mobile-enter-active,
.mobile-leave-active {
  transition: all 0.3s ease;
}

.mobile-enter-from,
.mobile-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
