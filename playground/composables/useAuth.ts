import { LaraApiSchemas, useNuxtApp } from '#imports'
import { useAuthStore } from '@/stores/auth'
import { AuthSchema } from '@/schemas'

export default function () {
  const { $pinia, $api } = useNuxtApp()

  const authStore = useAuthStore($pinia)

  function fetchCsrfToken() {
    return $api<void>('/sanctum/csrf-cookie')
  }

  async function fetchUser(headers?: HeadersInit) {
    const resp = await $api('/api/user', { headers }, {
      validate: LaraApiSchemas.simpleResource(AuthSchema),
    })

    authStore.user = { ...resp.data }
  }

  return {
    fetchCsrfToken,
    fetchUser,
  }
}
