import type { ZodSchema, z } from 'zod'
import type * as api from '../schemas/api'

export type TimeStamps = z.infer<typeof api.TimeStampsSchema>
export type PagePagination = z.infer<typeof api.PagePaginationSchema>
export type CursorPagination = z.infer<typeof api.CursorPaginationSchema>
export type ErrorData = z.infer<typeof api.ErrorDataSchema>
export type ValidationErrorResponse = z.infer<typeof api.ValidationErrorResponseSchema>

type ArrayKeys<T extends unknown[]> =
T extends Record<infer Index, unknown>
  ? Index extends `${number}`
    ? Index
    : never
  : never

type ObjectKeys<T extends object> =
T extends unknown[]
  ? ArrayKeys<T>
  : keyof T & string

export type NestedKeyOf<T extends object> =
T extends Record<infer Key, unknown>
  ? Key extends string | number
    ? ObjectKeys<T> | (T[Key] extends object
      ? `${ObjectKeys<Pick<T, Key>>}.${NestedKeyOf<T[Key]>}`
      : never
    )
    : never
  : never

type SplitArrayKeys<T extends string> =
T extends `${infer Key}.${infer NestedKey}`
  ? [`${Key}`, ...SplitArrayKeys<NestedKey>]
  : [`${T}`]

export type NestedKeyPathsOf<T extends object> = SplitArrayKeys<NestedKeyOf<T>>

export type ApiFetchBuilder<T> = T extends (request: infer Req, options?: infer Opt) => Promise<unknown>
  ?
    & T
    & (<Resp>(request: Req, options?: Opt, responseOptions?: {
      validate?: ZodSchema<Resp>
      onSuccess?: (response: Resp) => void | Promise<void>
      preFetch?: (request: Req, options?: Opt) => Promise<Resp | null>
      cache?: number
      loading?: { value: boolean }
    }) => Promise<Resp>)
  : T

export type DifferentProperties<
Toriginal extends object,
Taugment extends object,
> =
Taugment extends Record<infer Key, unknown>
  ? Key extends keyof Toriginal
    ? never
    : Key
  : never

export type ApiFetch = ApiFetchBuilder<NodeJS.Global['$fetch']>

export type NewPropsApiFetch = DifferentProperties<NodeJS.Global['$fetch'], ApiFetch>

export {}
