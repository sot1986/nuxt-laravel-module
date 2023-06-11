import { FetchError } from 'ofetch'
import { defineNuxtRouteMiddleware, navigateTo, simpleResource, useAsyncData, useNuxtApp } from '#imports'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()

  if (authStore.user)
    return

  const { $api } = useNuxtApp()

  const { error, data } = await useAsyncData(
    'user',
    () => $api('/api/user', undefined, { validate: simpleResource(authStore.getUserSchema()) }),
  )

  if (error.value) {
    console.error(error.value instanceof FetchError ? error.value.response?._data : error.value)
    return navigateTo('/login')
  }

  if (data.value)
    authStore.user = { ...data.value.data }

  if (!authStore.user) {
    console.error('Authentication endpoint did not provide user details.')
    return navigateTo('/login')
  }
})
