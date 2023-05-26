import { FetchError } from 'ofetch'
import type { ApiFetch } from '../types/api'
import type { CreateApiFetchOptions } from '../types/createApiFetch'
import stringifyQuery from './stringifyQuery'
import { createError, useCookie } from '#imports'

export default function (baseFetch: NodeJS.Global['$fetch'], {
  cacheStorage,
  handleResponseValidationError,
  confirmCredentialsStore,
  csrf,
}: CreateApiFetchOptions): ApiFetch {
  function isCacheEnabled(...[request, options]: Parameters<NodeJS.Global['$fetch']>) {
    if (process.server)
      return false

    const method = typeof request === 'string'
      ? (options?.method?.toUpperCase() ?? 'GET')
      : request.method.toUpperCase()

    return method === 'GET'
  }

  function createCacheKey(...params: Parameters<NodeJS.Global['$fetch']>) {
    const [request, options] = params

    const path = typeof request === 'string'
      ? request
      : request.url

    const url = path.replace(/^(\/)+/, '')

    const query = (typeof request === 'string' && options?.query)
      ? stringifyQuery(options?.query)
      : undefined

    return query
      ? (url.match(/\?/) ? `${url}&${query}` : `${url}?${query}`)
      : url
  }

  function validateResponse(
    response: unknown,
    options: {
      fetchParams: Parameters<ApiFetch>
      preFetch: boolean
      cache: boolean
    }) {
    if (!options.fetchParams[2]?.validate)
      return

    const check = options.fetchParams[2].validate.safeParse(response)
    if (check.success)
      return

    if (handleResponseValidationError)
      void handleResponseValidationError(check.error, { ...options })

    throw createError('Database server response fails validation. Contact system administrator if error persists.')
  }

  async function onSuccess(response: unknown, onSuccess?: (response: unknown) => void | Promise<void>) {
    if (!onSuccess)
      return Promise.resolve()

    await onSuccess(response)
  }

  function fetchCsrfToken(target: NodeJS.Global['$fetch']) {
    return async (...params: Parameters<NodeJS.Global['$fetch']>) => {
      if (!csrf)
        throw createError('No csrf token has been setup.')

      if (process.server)
        throw createError('Cannot Fetch CSRF cookie on server side.')

      let fetchError: null | Error = null
      try {
        csrf.token.value = ''
        csrf.fetching.value = true

        await target(...params)

        csrf.token.value = useCookie('XSRF-TOKEN', { default: () => '' }).value
      }
      catch (error) {
        fetchError = (error instanceof Error) ? error : new Error('Error on fetching csrf token.')
      }
      finally {
        csrf.fetching.value = false
      }

      if (fetchError)
        throw fetchError

      if (!csrf.token.value)
        throw createError('Error on fetching csrf token.')
    }
  }

  const apiFetch = new Proxy(baseFetch, {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    get(target, p, _receiver: ApiFetch) {
      if (p in target)
        return target[p as keyof typeof target]

      if (p === 'fetchCsrfToken')
        return fetchCsrfToken(target)

      return undefined
    },
    async apply(target, thisArg, argArray: Parameters<ApiFetch>) {
      const [request, options, responseOptions] = argArray

      const preFetchedResponse = responseOptions?.preFetch
        ? await responseOptions.preFetch(request, options)
        : null

      if (preFetchedResponse) {
        validateResponse(preFetchedResponse, {
          preFetch: true, fetchParams: argArray, cache: false,
        })
        await onSuccess(preFetchedResponse, responseOptions?.onSuccess)
        return preFetchedResponse
      }

      try {
        const cb = async (cache: boolean) => {
          const response = await target(request, options)
          validateResponse(response, {
            fetchParams: argArray,
            preFetch: false,
            cache,
          })
          await onSuccess(response, responseOptions?.onSuccess)
          return response
        }

        const cacheKey = (responseOptions?.cache && isCacheEnabled(request, options))
          ? createCacheKey(request, options)
          : null

        return (cacheKey && cacheStorage)
          ? cacheStorage.handler({
            key: cacheKey,
            seconds: responseOptions?.cache ?? 0,
            cb: () => cb(true),
          })
          : cb(false)
      }
      catch (error) {
        if (
          error instanceof FetchError
          && confirmCredentialsStore?.isConfirmCredentialsErrorStatusCode(error.status)
        ) {
          return new Promise((resolve, reject) => {
            confirmCredentialsStore.requestConfirm({
              cb: () => apiFetch(request, options, responseOptions), reject, resolve,
            })
          })
        }

        throw error
      }
    },
  }) as ApiFetch

  return apiFetch
}
