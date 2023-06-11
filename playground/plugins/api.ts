import { appendResponseHeader } from 'h3'
import { z } from 'zod'
import type { ApiFetch } from '../../src/module'
import { useNotificationStore } from '../stores/notifications'
import { defineNuxtPlugin, useNuxtApp, useRequestEvent, useRequestHeaders, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin(() => {
  const { $laravel, $pinia } = useNuxtApp()

  const { public: { baseURL } } = useRuntimeConfig()

  const cookieesRequestHeaders = useRequestHeaders(['cookie'])
  const event = useRequestEvent()
  const notificationStore = useNotificationStore($pinia)

  function getCsrfHeaders() {
    return $laravel.utils.getCsrfHeaders({
      baseAppUrl: baseURL as string,
      cookieesRequestHeaders,
      cookieNames: ['XSRF-TOKEN', 'laravel_session'],
    })
  }

  const baseApi = $fetch.create({
    baseURL: 'http://localhost',
    credentials: 'include',
    headers: {
      Accept: 'Application/json',
    },
    onRequest({ options }) {
      options.headers = { ...getCsrfHeaders(), ...options.headers }

      if (options.body)
        options.body = $laravel.utils.convertDataCase(options.body, 'snakeCase')

      if (options.query)
        options.query = $laravel.utils.convertDataCase(options.query, 'snakeCase')
    },
    onResponse({ response }) {
      response._data = $laravel.utils.convertDataCase<unknown>(response._data, 'camelCase')

      if (process.client)
        return

      const setCookie = response.headers.get('set-cookie')
      if (setCookie) {
        $laravel.utils.parseSetCookie(setCookie).forEach((cookie) => {
          appendResponseHeader(event, 'set-cookie', cookie)
        })
      }
    },
    onResponseError({ response }) {
      const ErrorDataSchema = z.object({ message: z.string() })
      const check = ErrorDataSchema.safeParse(response._data)
      const message = check.success ? check.data.message : 'Backend communication error.'
      void notificationStore.addNotification({
        type: 'error',
        message,
        title: 'Backend Error',
      })
    },
  })

  const api: ApiFetch = $laravel.utils.createApiFetch(baseApi, {
    handleResponseValidationError(err) {
      console.error(err.issues.at(0)?.message)
    },
  })

  return { provide: { api } }
})
