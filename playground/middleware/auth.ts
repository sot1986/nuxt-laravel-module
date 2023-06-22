import { FetchError } from 'ofetch'
import { defineNuxtRouteMiddleware, navigateTo, useAsyncData, useNuxtApp } from '#imports'
import { useAuthStore } from '~/stores/auth'
import useAuth from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async () => {
  const { $api, $pinia } = useNuxtApp()
  const authStore = useAuthStore($pinia)
  const { fetchUser } = useAuth()

  if (authStore.user)
    return

  const { error } = await useAsyncData(
    'user',
    () => fetchUser(),
  )

  if (error.value) {
    console.error(error.value instanceof FetchError ? error.value.response?._data : error.value)
    return navigateTo('/login')
  }
})
