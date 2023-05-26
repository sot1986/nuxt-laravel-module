import type { FetchError } from 'ofetch'
import type { ComputedRef } from 'vue-demi'

export interface ConfirmState {
  cb: () => Promise<unknown>
  resolve: (value: unknown) => void
  reject: (error: Error) => void
}

export type ConfirmCredentialsErrorStatusCode = number & { __brand: 'ConfirmCredentialsErrorStatusCode' }

export interface ConfirmCredentialsError extends FetchError {
  status: ConfirmCredentialsErrorStatusCode
}

export interface ConfirmCredentialsStore {
  needConfirmCredentials: ComputedRef<boolean>
  init: () => void
  requestConfirm: (payload: ConfirmState) => void
  cancelConfirm: (message: string) => void
  isConfirmCredentialsErrorStatusCode: (value?: number) => value is ConfirmCredentialsErrorStatusCode
  handler: <
  Tdata, Tparams extends unknown[],
  >(receiver: (...params: Tparams) => Promise<Tdata>) => (...params: Tparams) => Promise<void>
}
export {}
