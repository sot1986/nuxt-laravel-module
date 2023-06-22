<script setup lang="ts">
import { z } from 'zod'
import { definePageMeta, useAsyncData, useNuxtApp } from '#imports'
import { useAuthStore } from '~/stores/auth'

defineOptions({
  name: 'DashboardPage',
  inheritAttrs: false,
})

definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()

const { $api } = useNuxtApp()

const AccessTokenSchema = z.object({
  token: z.string(),
})

const { execute: fetchToken, data } = useAsyncData('auth-access-token', () => $api('/api/user/access-token', undefined, { validate: AccessTokenSchema }), { immediate: false })
</script>

<template>
  <div v-if="authStore.user">
    Dashboard

    <h2>Welcome {{ authStore.user.name }}</h2>

    <div class="mt-10 mx-auto w-full flex flex-col space-y-10 items-center">
      <button
        class="py-2 px-6 rounded-full bg-indigo-500 text-white hover:bg-indigo-400 transition-colors"
        type="button"
        @click="fetchToken()"
      >
        Ask token
      </button>

      <textarea
        id="access-token"
        :value="data?.token"
        name="access-token"
        class="border-gray-300 rounded-md shadow-md shadow-gray-300 resize-none w-full max-w-md"
        cols="30"
        rows="4"
      />
    </div>
  </div>
</template>
