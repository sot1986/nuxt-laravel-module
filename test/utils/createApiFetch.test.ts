/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, ref } from 'vue'
import { z } from 'zod'
import createApiFetch from '../../src/runtime/utils/createApiFetch'

describe('test createFetchApi Proxy test', () => {
  function createDummyFetch<T>(data: T) {
    return (() => new Promise(resolve => resolve(data))) as unknown as typeof $fetch
  }

  function createDummyFetchThanFails(message: string) {
    return (() => new Promise((resolve, reject) => reject(new Error(message)))) as unknown as typeof $fetch
  }

  beforeEach(() => {
    vi.mock('#imports', () => ({
      ref,
      computed,
      createError: (message: string) => new Error(message),
      useCookie: () => ({ value: 'test-token' }),
    }))
  })

  it.each([
    { data: { id: 1, name: 'Matteo' } },
    { data: [{ id: 1, name: 'Matteo' }, { id: 2, name: 'Giulio' }] },
  ])('test proxy creation with no options', async (resp) => {
    const dummyFetch = createDummyFetch(resp)

    const apiFetch = createApiFetch(dummyFetch, {})

    const r = await apiFetch('/')

    expect(r).toEqual(resp)
  })

  it('throws Nuxt error if response validation fails', async () => {
    const schema = z.object({
      id: z.number(),
      name: z.string().min(8),
    })
    const resp: z.infer<typeof schema> = { id: 10, name: 'Short' }
    const dummyFetch = createDummyFetch(resp)

    const apiFetch = createApiFetch(dummyFetch, {})

    await expect(() => apiFetch('', {}, { validate: schema })).rejects.toThrowError(/Database server response fails validation./)
  })

  it('prefetch data if requested', async () => {
    const dummyFetch = createDummyFetch({ data: 'message fetched' })
    const apiFetch = createApiFetch(dummyFetch, {})

    const preFetch = () => new Promise<{ data: string }>(resolve => resolve({ data: 'message prefetched' }))

    const response = await apiFetch('', undefined, { preFetch })

    expect(response).toEqual({ data: 'message prefetched' })
  })

  it('can fetch csrf Token', async () => {
    const dummyFetch = createDummyFetch({ data: 'message fetched' })

    const token = ref('initial')
    const loading = ref(false)

    const apiFetch = createApiFetch(dummyFetch, {
      csrf: {
        token,
        fetching: loading,
      },
    })

    await apiFetch.fetchCsrfToken('sanctum-endpoint')

    expect(token.value).toBe('test-token')
    expect(loading.value).toBe(false)
  })

  it('throws error on fetching csrf if options is not prepare', async () => {
    const dummyFetch = createDummyFetch({ data: 'message fetched' })
    const apiFetch = createApiFetch(dummyFetch, {})

    await expect(() => apiFetch.fetchCsrfToken('endpoint')).rejects
      .toThrowError(/No csrf token has been setup./)
  })

  it('complete fetching before throwing error if it was not successfull', async () => {
    const dummyFetch = createDummyFetchThanFails('Csrf not working.')

    const token = ref('initial')
    const loading = ref(false)

    const apiFetch = createApiFetch(dummyFetch, {
      csrf: {
        token,
        fetching: loading,
      },
    })

    await expect(() => apiFetch.fetchCsrfToken('endpoint')).rejects
      .toThrowError(/Csrf not working./)

    expect(loading.value).toBe(false)
    expect(token.value).toBe('')
  })
})
