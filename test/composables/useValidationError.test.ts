import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ZodError, z } from 'zod'
import { computed, ref, watch } from 'vue'
import useValidationError from '../../src/runtime/composables/useValidationError'

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), milliseconds)
  })
}

describe('test useValidationError composable', () => {
  beforeEach(() => {
    vi.mock('#imports', () => ({
      computed, ref, watch,
    }))
  })

  it('can capture Validation error', async () => {
    const error = ref<null | ZodError>(null)

    const dataSchema = z.object({
      name: z.string().min(2),
      age: z.number().int().positive(),
    })

    type Data = z.infer<typeof dataSchema>
    const data = ref<Data>({ name: '', age: 4 })
    const { cleanValError, validationError } = useValidationError<Data>(error)

    expect(validationError.value._errors).toEqual([])

    const check = dataSchema.safeParse(data.value)

    error.value = check.success ? null : new ZodError<Data>(check.error.issues)

    await wait(100)

    expect(
      validationError.value.name?._errors,
    ).toEqual(['String must contain at least 2 character(s)'])

    cleanValError('name')

    expect(
      validationError.value.name).toEqual(undefined)

    cleanValError()

    expect(error.value).toBeNull()
  })
})
