import type { ZodError } from 'zod'
import type { ApiFetch, ErrorData } from '../types/api'
import type { GetHeadersPayload } from './sanctum'
import type { ConvertDataCase } from './convertDataCase'
import type { CreateApiFetchOptions } from './createApiFetch'

export interface Laravel {
  createApiFetch: (
    baseFetch: NodeJS.Global['$fetch'],
    options: CreateApiFetchOptions
  ) => ApiFetch
  convertDataCase: <T>(data: T, newCase: 'camelCase' | 'snakeCase') => ConvertDataCase<T>
  capitalizeString: <T extends string>(value: T) => Capitalize<T>
  stringifyQuery: (query?: Record<string, unknown>) => string
  convertResponseErrorInZodError: <T>(data: ErrorData) => ZodError<T>
  getHeaders: (options: GetHeadersPayload) => Record<string, string>
  parseSetCookie: (setCookie: string) => string[]
}

export {}
