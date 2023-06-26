import { LaraApiSchemas, useNuxtApp } from '#imports'
import { useAuthStore } from '@/stores/auth'
import { AuthSchema } from '@/schemas'

export default function () {
  const { $pinia, $api, $fetchCsrfToken } = useNuxtApp()
  const authStore = useAuthStore($pinia)

  async function fetchUser(headers?: HeadersInit) {
    const resp = await $api('/api/user', { headers }, {
      validate: LaraApiSchemas.simpleResource(AuthSchema),
    })

    authStore.user = { ...resp.data }
  }

  return {
    fetchCsrfToken: $fetchCsrfToken,
    fetchUser,
  }
}
