import type { ComputedRef, Ref } from 'vue-demi'
import { ZodError, type ZodFormattedError, type ZodIssue } from 'zod'
import type { NestedKeyOf } from '../types/api'
import convertResponseErrorInZodError from '../utils/convertResponseErrorInZodError'
import { isValidationResponseError } from '../schemas/api'
import { computed, ref, watch } from '#imports'

export default function<Tdata extends object>(
  error: Ref<Error | null>,
): {
    cleanValError: (key?: NestedKeyOf<Tdata>) => void
    validationError: ComputedRef<ZodFormattedError<Tdata, string>>
  } {
  const issues = ref([]) as Ref<ZodIssue[]>
  const validationError = computed(() => new ZodError<Tdata>(issues.value).format())

  watch(error, () => {
    if (!error.value && issues.value.length) {
      issues.value = []
      return
    }

    if (!error.value)
      return

    if (error.value instanceof ZodError) {
      issues.value = error.value.issues
      return
    }

    if (isValidationResponseError(error.value)) {
      const zodError = convertResponseErrorInZodError(error.value.data)
      issues.value = [...zodError.issues]
    }
  }, { immediate: true })

  function cleanValError(key?: NestedKeyOf<Tdata>) {
    if (!key) {
      error.value = null
      return
    }

    issues.value = issues.value.filter(i => i.path.join('.') !== String(key))
  }

  return {
    cleanValError,
    validationError,
  }
}
