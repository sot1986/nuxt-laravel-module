<script setup lang="ts">
import { definePageMeta } from '#imports'
import { useAuthStore } from '~/stores/auth'

defineOptions({
  name: 'DashboardPage',
  inheritAttrs: false,
})

definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()
</script>

<template>
  <div v-if="authStore.user">
    Dashboard

    <h2>Welcome {{ authStore.user.name }}</h2>
  </div>
</template>
