<script setup lang="ts">
import type { z } from 'zod'
import { navigateTo } from 'nuxt/app'
import { LaraAuthSchemas, ref, useAsyncData, useNuxtApp, useValidationError } from '#imports'

defineOptions({
  name: 'LoginPage',
  inheritAttrs: false,
})

const { $api } = useNuxtApp()

const loginData = ref<z.infer<typeof LaraAuthSchemas.LoginSchema>>({
  email: '',
  password: '',
  remember: false,
})

const { error, execute } = useAsyncData('login', async () => {
  const body = LaraAuthSchemas.LoginSchema.parse(loginData.value)
  await $api<void>('/sanctum/csrf-cookie')
  return $api('/login', { method: 'POST', body })
}, { server: false, immediate: false })

const { validationError, cleanValError } = useValidationError<z.infer<typeof LaraAuthSchemas.LoginSchema>>(error)

async function login() {
  await execute()

  if (error.value)
    return

  return navigateTo('/dashboard')
}

function resetLogin() {
  cleanValError()
  loginData.value = {
    email: '',
    password: '',
    remember: false,
  }
}
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-10 w-auto"
        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
        alt="Your Company"
      >
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Sign in to your account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form
        class="space-y-6"
        novalidate
        @reset.prevent="resetLogin"
        @submit.prevent="login"
      >
        <div>
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900"
          >Email address</label>
          <div class="mt-2 relative">
            <input
              id="email"
              v-model="loginData.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              tabindex="1"
              @input="cleanValError('email')"
            >
            <p class="text-red-500 absolute top-[100%] text-sm">
              {{ validationError.email?._errors.at(0) }}
            </p>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label
              for="password"
              class="block text-sm font-medium leading-6 text-gray-900"
            >Password</label>
            <div class="text-sm">
              <a
                href="#"
                class="font-semibold text-indigo-600 hover:text-indigo-500"
              >Forgot password?</a>
            </div>
          </div>
          <div class="mt-2 relative">
            <input
              id="password"
              v-model="loginData.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              tabindex="2"
              @input="cleanValError('password')"
            >
            <p class="text-red-500 absolute top-[100%] text-sm">
              {{ validationError.password?._errors.at(0) }}
            </p>
          </div>
        </div>

        <div>
          <label
            for="remember"
            class="block text-sm font-medium leading-6 text-gray-900"
          >Remeber</label>
          <div class="mt-2 relative">
            <input
              id="remember"
              v-model="loginData.remember"
              name="remember"
              type="checkbox"
              autocomplete="remember"
              required
              class="block w-6 h-6 rounded-md border-0 py-1.5 text-indigo-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              tabindex="3"
              @input="cleanValError('remember')"
            >
            <p class="text-red-500 absolute top-[100%] text-sm">
              {{ validationError.remember?._errors.at(0) }}
            </p>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            tabindex="4"
          >
            Sign in
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Not a member?
        {{ ' ' }}
        <nuxt-link
          to="/register"
          class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          Start a 14 day free trial
        </nuxt-link>
      </p>
    </div>
  </div>
</template>
