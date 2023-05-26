import { type StorageLike, useStorage } from '@vueuse/core'
import type { CacheItem, CacheStorage } from '../types/cache'
import { computed, createError, ref } from '#imports'

export default function (
  options: { storageLike?: StorageLike; maxStorageSize: number },
): CacheStorage {
  const items = useStorage<Record<string, CacheItem>>('api_fetch_cache', {}, options.storageLike)

  const storageEstimate = ref<StorageEstimate>({
    quota: undefined,
    usage: undefined,
  })

  const isInitialized = computed(() => process.server
    ? false
    : typeof storageEstimate.value.quota === 'number',
  )

  async function init() {
    if (!isInitialized.value)
      await updateStorageEstimate()

    if (!isInitialized.value)
      throw createError('Cannot initialize Cache Storage')

    return cleanExpired()
  }

  function updateStorageEstimate() {
    return new Promise<void>((resolve) => {
      const quota = encodeURIComponent(JSON.stringify(options.storageLike)).length

      const usage = Math.round(quota / options.maxStorageSize * 100)

      storageEstimate.value = { quota, usage }

      resolve()
    })
  }

  function getItem<Tdata>(key: string): Promise<Tdata | null> {
    if (!isInitialized.value)
      return Promise.resolve(null)

    return new Promise<Tdata | null>((resolve) => {
      const cacheData = key in items.value
        ? items.value[key]
        : null

      if (!cacheData)
        return resolve(null)

      if (new Date(cacheData.expiration).getTime() < new Date().getTime()) {
        void removeItem(key)
        return resolve(null)
      }

      resolve(cacheData.data as Tdata)
    })
  }

  async function setItem<T>(
    key: string, seconds: number, data: T,
  ) {
    await cleanExpired()

    await new Promise<void>((resolve) => {
      if (!storageEstimate.value.quota)
        return resolve()

      if (!seconds)
        return resolve()

      if (
        storageEstimate.value.quota
        + encodeURIComponent(JSON.stringify(data)).length
        > options.maxStorageSize
      )
        return resolve()

      const expiration = new Date(new Date().getTime() + seconds).toISOString()

      items.value[key] = { expiration, data }
      resolve()
    })

    return updateStorageEstimate()
  }

  async function removeItem(key: string | RegExp) {
    await new Promise<void>((resolve) => {
      if (typeof key === 'string' && key in items.value) {
        delete items.value[key]
        return resolve()
      }

      if (typeof key === 'object') {
        Object.keys(items.value).forEach((k) => {
          if (k.match(key))
            delete items.value[k]
        })
      }

      resolve()
    })

    return updateStorageEstimate()
  }

  function clean() {
    if (!isInitialized.value)
      return Promise.resolve()

    items.value = {}
    return updateStorageEstimate()
  }

  async function cleanExpired() {
    if (!isInitialized.value)
      return Promise.resolve()

    await Promise.all([...Object.entries(items.value)
      .filter(c => (new Date().getTime() > new Date(c[1].expiration).getTime()))]
      .map(c => removeItem(c[0])),
    )
  }

  async function handler<Tdata>(
    { key, seconds, cb }: { key: string; seconds: number; cb: () => Promise<Tdata> },
  ) {
    const cachedResponse = await getItem<Tdata>(key)

    if (cachedResponse)
      return cachedResponse

    const data = await cb()

    void setItem(key, seconds, data)

    return data
  }

  return {
    items,
    isInitialized,
    storageEstimate,
    init,
    getItem,
    setItem,
    removeItem,
    clean,
    cleanExpired,
    handler,
  }
}
