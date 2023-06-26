import { appendResponseHeader } from 'h3'
import { z } from 'zod'
import { useNotificationStore } from '../stores/notifications'
import { defineNuxtPlugin, useNuxtApp, useRequestEvent, useRequestHeaders, useRuntimeConfig } from '#imports'
import type { ApiFetch } from '~/.nuxt/types/sot-nuxt-laravel'

export default defineNuxtPlugin(() => {
  const { $laravel, $pinia } = useNuxtApp()

  const { public: { baseURL } } = useRuntimeConfig()

  const cookieesRequestHeaders = useRequestHeaders(['cookie'])
  const event = useRequestEvent()
  const notificationStore = useNotificationStore($pinia)

  function getHeaders() {
    return $laravel.getHeaders({
      baseAppUrl: baseURL,
      cookieesRequestHeaders,
      cookieNames: ['XSRF-TOKEN', 'laravel_session', /^remember_web_/i],
    })
  }

  const baseApi = $fetch.create({
    baseURL: 'http://localhost',
    credentials: 'include',
    headers: {
      Accept: 'Application/json',
    },
    onRequest({ options }) {
      // $laravel.mergeHeaders({ ...getHeaders() }, options)
      options.headers = { ...options.headers, ...getHeaders() }

      if (options.body)
        options.body = $laravel.convertDataCase(options.body, 'snakeCase')

      if (options.query)
        options.query = $laravel.convertDataCase(options.query, 'snakeCase')
    },
    onRequestError() {

    },
    onResponse({ response }) {
      response._data = $laravel.convertDataCase<unknown>(response._data, 'camelCase')

      if (process.client)
        return

      const setCookie = response.headers.get('set-cookie')
      if (setCookie) {
        $laravel.parseSetCookie(setCookie).forEach((cookie) => {
          appendResponseHeader(event, 'set-cookie', cookie)
        })
      }
    },
    onResponseError({ response, options }) {
      if ($laravel.headerExists(notificationStore.SilenceHeader, options.headers))
        return

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

  const api: ApiFetch = $laravel.createApiFetch(baseApi, {})

  function fetchCsrfToken() {
    return baseApi<void>('/sanctum/csrf-cookie')
  }

  return { provide: { api, fetchCsrfToken } }
})
