// frontend/src/composables/useToast.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
  duration: number
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])
  let idCounter = 0

  const addToast = (message: string, type: ToastType = 'info', duration: number = 3000): void => {
    const id = ++idCounter
    toasts.value.push({ id, message, type, duration })

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  const removeToast = (id: number): void => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts,
    addToast,
    removeToast,
  }
})

export function useToast() {
  const toastStore = useToastStore()

  const showToast = (message: string, type: ToastType = 'info', duration: number = 3000): void => {
    toastStore.addToast(message, type, duration)
  }

  const showSuccess = (message: string, duration: number = 3000): void => {
    showToast(message, 'success', duration)
  }

  const showError = (message: string, duration: number = 5000): void => {
    showToast(message, 'error', duration)
  }

  const showWarning = (message: string, duration: number = 4000): void => {
    showToast(message, 'warning', duration)
  }

  const showInfo = (message: string, duration: number = 3000): void => {
    showToast(message, 'info', duration)
  }

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}
