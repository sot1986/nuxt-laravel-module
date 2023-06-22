import { defineStore } from 'pinia'
import type { z } from 'zod'
import { ref } from '#imports'
import type { AuthSchema } from '@/schemas'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<z.infer<typeof AuthSchema> | null>(null)

  return {
    user,
  }
}, { persist: true })
