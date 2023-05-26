import type {
  ConfirmCredentialsErrorStatusCode,
  ConfirmCredentialsStore, ConfirmState,
} from '../types/confirmCredentials'
import { computed, ref } from '#imports'

export default function (statusCodeError = 423): ConfirmCredentialsStore {
  const state = ref<null | ConfirmState>(null)

  const needConfirmCredentials = computed(() => !!state.value)

  function init() {
    state.value = null
  }

  function requestConfirm(payload: ConfirmState) {
    init()

    state.value = { ...payload }
  }

  function cancelConfirm(message: string) {
    if (!state.value)
      return

    const { reject } = state.value

    init()

    reject(new Error(message))
  }

  function isConfirmCredentialsErrorStatusCode(value?: number): value is ConfirmCredentialsErrorStatusCode {
    return value === statusCodeError
  }

  function handler<
  Tdata,
  Tparams extends unknown[],
  >(receiver: (...params: Tparams) => Promise<Tdata>) {
    return async (...params: Tparams) => {
      await receiver(...params)

      if (!state.value)
        return

      try {
        const response = await state.value.cb()

        state.value.resolve(response)
      }
      catch (error) {
        const reason = error instanceof Error
          ? error
          : new Error('Cannot complete callback.')

        state.value.reject(reason)
      }
      finally {
        init()
      }
    }
  }

  return {
    needConfirmCredentials,
    init,
    requestConfirm,
    cancelConfirm,
    isConfirmCredentialsErrorStatusCode,
    handler,
  }
}
