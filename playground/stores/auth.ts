import { defineStore } from 'pinia'
import { z } from 'zod'
import { ref } from '#imports'

export const useAuthStore = defineStore('auth', () => {
  const UserSchema = z.object({
    id: z.coerce.bigint().positive(),
    name: z.string(),
    email: z.string().email(),
    emailVerifiedAt: z.string().datetime().nullable(),
  })

  const user = ref<z.infer<typeof UserSchema> | null>(null)

  function getUserSchema() {
    return UserSchema
  }

  return {
    user,
    getUserSchema,
  }
})
