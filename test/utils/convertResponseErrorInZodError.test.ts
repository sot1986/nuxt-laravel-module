import { ZodError } from 'zod'
import { describe, expect, it } from 'vitest'
import convertResponseErrorInZodError from '../../src/runtime/utils/convertResponseErrorInZodError'

describe('test conversion of body data in Zod Error', () => {
  it.each([
    { body: { message: 'Error Message', errors: { name: ['Name is Required'], email: ['email is required', 'email is not a valid email.'] } }, paths: ['name', 'email'], issuesCount: 3 },
  ])('can convert base object', ({ body, paths, issuesCount }) => {
    const error = convertResponseErrorInZodError(body)

    expect(error).toBeInstanceOf(ZodError)

    const issues = error.issues

    expect(issues).toHaveLength(issuesCount)

    issues.forEach((issue) => {
      issue.path.forEach((path) => {
        expect(paths).include(path)
      })
    })
  })
})
