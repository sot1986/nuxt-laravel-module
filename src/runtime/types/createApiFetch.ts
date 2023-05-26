import type { ZodError } from 'zod'
import type { Ref } from 'vue-demi'
import type { ApiFetch } from '../types/api'
import type { CacheStorage } from '../types/cache'
import type { ConfirmCredentialsStore } from '../types/confirmCredentials'

export interface CreateApiFetchOptions {
  cacheStorage?: CacheStorage
  confirmCredentialsStore?: ConfirmCredentialsStore
  csrf?: {
    token: Ref<string>
    fetching: Ref<boolean>
  }
  handleResponseValidationError?: (
    error: ZodError, options: { fetchParams: Parameters<ApiFetch>; preFetch: boolean; cache: boolean }
  ) => void | Promise<void>
}
export {}
