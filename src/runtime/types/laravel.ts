import type { ZodError } from 'zod'
import type { ApiFetch, ErrorData } from '../types/api'
import type * as schemas from '../schemas'
import type { ConvertDataCase } from './convertDataCase'
import type { CreateApiFetchOptions } from './createApiFetch'

export interface Laravel {
  schemas: typeof schemas
  utils: {
    createApiFetch: (
      baseFetch: NodeJS.Global['$fetch'],
      options: CreateApiFetchOptions
    ) => ApiFetch
    convertDataCase: <T>(data: T, newCase: 'camelCase' | 'snakeCase') => ConvertDataCase<T>
    capitalizeString: <T extends string>(value: T) => Capitalize<T>
    stringifyQuery: (query?: Record<string, unknown>) => string
    convertResponseErrorInZodError: <T>(data: ErrorData) => ZodError<T>
  }
}

export {}
