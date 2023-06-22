<script setup lang="ts">
import NotificationsContainer from './components/NotificationsContainer.vue'
import { onMounted, useNuxtApp } from '#imports'
import useAuth from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth'

const { fetchUser, fetchCsrfToken } = useAuth()
const { $pinia } = useNuxtApp()

onMounted(async () => {
  const authStore = useAuthStore($pinia)

  if (authStore.user)
    return

  try {
    await fetchCsrfToken()

    await fetchUser({ SilenceError: '1' })
  }
  catch (error) {

  }
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <NotificationsContainer />
  </div>
</template>
