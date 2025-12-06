// frontend/src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import api from '../api/axios'
import router from '../router'

interface User {
  id: number
  name: string
  email: string
  is_admin: boolean
  created_at?: string
  updated_at?: string
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials {
  name: string
  email: string
  password: string
  password_confirmation: string
}

interface AuthResponse {
  data: {
    token: string
    user: User
  }
}

interface UserResponse {
  data: User
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token') || null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed<boolean>(() => !!token.value)
  const isAdmin = computed<boolean>(() => user.value?.is_admin || false)

  // Actions
  async function register(credentials: RegisterCredentials): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await api.post<AuthResponse>('/register', credentials)

      token.value = response.data.data.token
      user.value = response.data.data.user

      // Save to localStorage
      localStorage.setItem('token', token.value)
      localStorage.setItem('user_id', user.value.id.toString())

      router.push('/dashboard')
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function login(credentials: LoginCredentials): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await api.post<AuthResponse>('/login', credentials)

      token.value = response.data.data.token
      user.value = response.data.data.user

      // Save to localStorage
      localStorage.setItem('token', token.value)
      localStorage.setItem('user_id', user.value.id.toString())

      router.push('/dashboard')
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    try {
      await api.post('/logout')
    } catch (err: any) {
      console.error('Logout error:', err)
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user_id')
      router.push('/login')
    }
  }

  async function checkAuth(): Promise<void> {
    if (!token.value) return

    try {
      const response = await api.get<UserResponse>('/user')
      user.value = response.data.data

      // Save user_id to localStorage if it's not there
      if (user.value && !localStorage.getItem('user_id')) {
        localStorage.setItem('user_id', user.value.id.toString())
      }
    } catch (err: any) {
      // Token is invalid, clear auth
      user.value = null
      token.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user_id')
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    register,
    login,
    logout,
    checkAuth,
  }
})
