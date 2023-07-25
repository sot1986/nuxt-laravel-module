import type { ZodIssue } from 'zod'
import { ZodError } from 'zod'
import type { ErrorData } from '../types/api'

export default function<T>(data: ErrorData): ZodError<T> {
  const issues: ZodIssue[] = []

  Object.entries(data.errors).forEach(([key, errors]) => {
    const path = key.split('.').map(k => k.match(/^\d+$/) ? Number(k) : k)

    errors.forEach((message) => {
      issues.push({ code: 'custom', message, path })
    })
  })

  return new ZodError<T>(issues)
}
