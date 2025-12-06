<!-- src/App.vue -->
<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <NavBar v-if="authStore.isAuthenticated" />

    <main class="container mx-auto px-4 py-6">
      <RouterView />
    </main>

    <Toast />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import NavBar from './components/NavBar.vue'
import Toast from './components/Toast.vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.checkAuth()
})
</script>

<style>
#app {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
