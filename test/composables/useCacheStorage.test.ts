import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, ref } from 'vue'
import { type StorageLike } from '@vueuse/core'
import useCacheStorage from '../../src/runtime/composables/useCacheStorage'

describe('test useCacheStorage composables', () => {
  beforeEach(() => {
    vi.mock('#imports', () => ({
      ref,
      computed,
      createError: (message: string) => new Error(message),
    }))

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  class TestStorage implements StorageLike {
    #data = {} as Record<string, string>

    constructor(data: Record<string, string> = {}) {
      this.#data = { ...data }
    }

    getItem(key: string) {
      return this.#data[key] ?? null
    }

    setItem(key: string, value: string) {
      this.#data[key] = value
    }

    removeItem(key: string) {
      if (key in this.#data)
        delete this.#data[key]
    }
  }

  it.each([
    { key: 'first', data: { value: 10 }, seconds: 10 },
  ]) ('test base crud operations', async ({ key, data, seconds }) => {
    const testStorage = new TestStorage()

    const time = vi.setSystemTime(new Date('2020-10-10T10:00:00'))

    const { items, init, isInitialized, storageEstimate, setItem, getItem, removeItem } = useCacheStorage({ maxStorageSize: 100000, storageLike: testStorage })

    expect(items.value).toEqual({})

    await init()

    expect(isInitialized.value).toBe(true)

    await setItem(key, seconds, data)

    const response = await getItem(key)

    time.advanceTimersToNextTimer()

    const estimate = storageEstimate.value.quota

    expect(estimate).toBeGreaterThanOrEqual(0)

    expect(response).toEqual(data)

    time.advanceTimersByTime(seconds + 1)

    const response1 = await getItem(key)

    expect(response1).toBeNull()

    expect(items.value).toEqual({})

    await setItem(key, seconds, data)

    time.advanceTimersByTime(seconds - 1)

    const response2 = await getItem(key)

    expect(response2).toEqual(data)

    await removeItem(key)

    const response3 = await getItem(key)

    expect(response3).toBeNull()
  })

  it.each([
    { key: 'users', seconds: 60, data: [{ id: 1, name: 'Matteo' }, { id: 2, name: 'Stefania' }] },
  ])('can handle promises responses', async ({ key, seconds, data }) => {
    const testStorage = new TestStorage()

    let counter = 0

    function api(value: unknown) {
      counter += 1
      return new Promise<unknown>(resolve => resolve(value))
    }

    const time = vi.setSystemTime(new Date('2020-10-10T10:00:00'))

    const { init, handler } = useCacheStorage({ maxStorageSize: 100000, storageLike: testStorage })

    await init()

    const response = await handler({ key, seconds, cb: () => api(data) })
    await time.advanceTimersToNextTimerAsync()

    expect(response).toEqual(data)
    expect(counter).toBe(1)

    time.advanceTimersByTime(seconds - 10)

    const response1 = await handler({ key, seconds, cb: () => api(data) })
    await time.advanceTimersToNextTimerAsync()

    expect(response1).toEqual(data)
    expect(counter).toBe(1)

    time.advanceTimersByTime(11)

    const response2 = await handler({ key, seconds, cb: () => api(data) })
    await time.advanceTimersToNextTimerAsync()

    expect(response2).toEqual(data)
    expect(counter).toBe(2)
  })
})
