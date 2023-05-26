import type { ComputedRef, Ref } from 'vue-demi'

export interface CacheItem<T = unknown> {
  expiration: string
  data: T
}

export interface CacheStorage {
  items: Ref<Record<string, CacheItem<unknown>>>
  isInitialized: ComputedRef<boolean>
  storageEstimate: Ref<StorageEstimate>
  init: () => Promise<void>
  getItem: <Tdata>(key: string) => Promise<Tdata | null>
  setItem: <T>(key: string, seconds: number, data: T) => Promise<void>
  removeItem: (key: string | RegExp) => Promise<void>
  clean: () => Promise<void>
  cleanExpired: () => Promise<void>
  handler: <Tdata>({ key, seconds, cb }: {
    key: string
    seconds: number
    cb: () => Promise<Tdata>
  }) => Promise<Tdata>
}

export {}
