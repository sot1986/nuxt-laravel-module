<script setup lang="ts">
import type { z } from 'zod'
import { navigateTo } from 'nuxt/app'
import { LaraAuthSchemas, ref, useAsyncData, useNuxtApp, useValidationError } from '#imports'

defineOptions({
  name: 'RegisterPage',
  inheritAttrs: false,
})

const { $api } = useNuxtApp()

const registerData = ref<z.infer<typeof LaraAuthSchemas.RegisterSchema>>({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
})

const { error, execute } = useAsyncData('login', async () => {
  const body = LaraAuthSchemas.RegisterSchema.parse(registerData.value)
  await $api<void>('/sanctum/csrf-cookie')
  return $api('/register', { method: 'POST', body })
}, { server: false, immediate: false })

const { validationError, cleanValError } = useValidationError<z.infer<typeof LaraAuthSchemas.RegisterSchema>>(error)

async function register() {
  await execute()

  if (error.value)
    return

  return navigateTo('/dashboard')
}

function resetRegister() {
  cleanValError()
  registerData.value = {
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
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
        @reset.prevent="resetRegister"
        @submit.prevent="register"
      >
        <div>
          <label
            for="name"
            class="block text-sm font-medium leading-6 text-gray-900"
          >Full name</label>
          <div class="mt-2 relative">
            <input
              id="name"
              v-model="registerData.name"
              name="name"
              type="text"
              autocomplete="name"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Your full name..."
              tabindex="1"
              @input="cleanValError('name')"
            >
            <p class="text-red-500 absolute top-[100%] text-sm">
              {{ validationError.name?._errors.at(0) }}
            </p>
          </div>
        </div>

        <div>
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900"
          >Email address</label>
          <div class="mt-2 relative">
            <input
              id="email"
              v-model="registerData.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              tabindex="2"
              placeholder="Your email..."
              @input="cleanValError('email')"
            >
            <p class="text-red-500 absolute top-[100%] text-sm">
              {{ validationError.email?._errors.at(0) }}
            </p>
          </div>
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium leading-6 text-gray-900"
          >Password</label>
          <div class="mt-2 relative">
            <input
              id="password"
              v-model="registerData.password"
              name="password"
              type="password"
              autocomplete="password"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              tabindex="3"
              placeholder="Your password..."
              @input="cleanValError('password')"
            >
            <p class="text-red-500 absolute top-[100%] text-sm">
              {{ validationError.password?._errors.at(0) }}
            </p>
          </div>
        </div>

        <div>
          <label
            for="confirm-password"
            class="block text-sm font-medium leading-6 text-gray-900"
          >Confirm password</label>
          <div class="mt-2 relative">
            <input
              id="confirm-password"
              v-model="registerData.passwordConfirmation"
              name="confirm-password"
              type="password"
              autocomplete="confirm-password"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              tabindex="4"
              placeholder="confirm your password..."
              @input="cleanValError('passwordConfirmation')"
            >
            <p class="text-red-500 absolute top-[100%] text-sm">
              {{ validationError.passwordConfirmation?._errors.at(0) }}
            </p>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            tabindex="5"
          >
            Register
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Already a member?
        {{ ' ' }}
        <nuxt-link
          to="/login"
          class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          Sign in
        </nuxt-link>
      </p>
    </div>
  </div>
</template>
