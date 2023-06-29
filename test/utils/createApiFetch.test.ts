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
    const err = new Error(message)
    return (() => new Promise((resolve, reject) => reject(err))) as unknown as typeof $fetch
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

  it('set loading false at end if promise is ok or not', async () => {
    const dummyFetch = createDummyFetch('response')
    const apiFetch1 = createApiFetch(dummyFetch, {})
    const loading = { value: false }
    const r1 = await apiFetch1('/', undefined, { loading })
    expect(loading.value).toBe(false)

    expect(r1).toEqual('response')

    const errorDummy = createDummyFetchThanFails('error message')
    const apiFetch2 = createApiFetch(errorDummy, {})
    await expect(() => apiFetch2('', {}, { loading })).rejects.toThrowError(/error message/)
    expect(loading.value).toBe(false)
  })

  it('fails when running multiple parallel promises', async () => {
    const dummyFetch1 = createDummyFetch('response1')
    const apiFetch1 = createApiFetch(dummyFetch1, {})
    const loading = { value: true }

    await apiFetch1('', undefined, { loading }).catch(() => {
      expect(loading.value).toBe(true)
    })
  })
})
