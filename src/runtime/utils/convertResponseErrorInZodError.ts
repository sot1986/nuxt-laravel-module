import type { ZodIssue } from 'zod'
import { ZodError } from 'zod'
import type { ErrorData } from '../types/api'

export default function<T>(data: ErrorData): ZodError<T> {
  const issues: ZodIssue[] = []

  Object.entries(data.errors).forEach(([key, errors]) => {
    const path = key.split('.')

    errors.forEach((message) => {
      issues.push({ code: 'custom', message, path })
    })
  })

  return new ZodError<T>(issues)
}
