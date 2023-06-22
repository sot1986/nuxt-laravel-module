<script setup lang="ts">
import NotificationsContainer from './components/NotificationsContainer.vue'
import { useNotificationStore } from './stores/notifications'
import { onMounted, useNuxtApp } from '#imports'
import useAuth from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth'

const { fetchUser, fetchCsrfToken } = useAuth()
const { $pinia } = useNuxtApp()
const authStore = useAuthStore($pinia)
const notificationStore = useNotificationStore($pinia)

onMounted(async () => {
  if (authStore.user)
    return

  try {
    await fetchCsrfToken()

    await fetchUser({ [notificationStore.SilenceHeader]: '1' })
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
