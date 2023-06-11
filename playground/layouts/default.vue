<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { navigateTo, useNuxtApp } from '#imports'

defineOptions({
  name: 'BaseLayout',
  inheritAttrs: false,
})

const authStore = useAuthStore()

const { $api } = useNuxtApp()

async function logout() {
  try {
    await $api('/logout', { method: 'POST' })
  }
  catch (error) {
    console.error()
  }
  finally {
    authStore.user = null
    await navigateTo('/')
  }
}
</script>

<template>
  <div>
    <header class="container mx-auto mt-2 py-4">
      <nav class="flex justify-between">
        <ul class="flex items-center space-x-4">
          <li>
            Home
          </li>
          <li>
            Dashboard
          </li>
        </ul>

        <ul class="flex items-center space-x-4">
          <template v-if="authStore.user">
            <li>
              <form @submit.prevent>
                <button
                  type="button"
                  @click="logout"
                >
                  Logout
                </button>
              </form>
            </li>
          </template>
          <template v-else>
            <nuxt-link to="/register">
              <li>Register</li>
            </nuxt-link>
            <nuxt-link to="/login">
              <li>Login</li>
            </nuxt-link>
          </template>
        </ul>
      </nav>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>
