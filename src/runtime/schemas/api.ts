import { z } from 'zod'
import { FetchError } from 'ofetch'

export const TimeStampsSchema = z.object({
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const PagePaginationSchema = z.object({
  currentPage: z.number().min(0).int(),
  from: z.number().min(0).int(),
  lastPage: z.number().min(0).int(),
  path: z.string().url(),
  perPage: z.number().min(0).int(),
  to: z.number().min(0).int(),
  total: z.number().min(0).int(),
  links: z.array(
    z.object({
      url: z.string().url().nullable(),
      label: z.string(),
      active: z.boolean(),
    }),
  ),
})

export const CursorPaginationSchema = z.object({
  nextCursor: z.string().nullable(),
  path: z.string().url(),
  perPage: z.number().min(0).int(),
  prevCursor: z.string().nullable(),
})

export const ErrorDataSchema = z.object({
  message: z.string(),
  errors: z.record(z.array(z.string())),
})

export const ValidationErrorResponseSchema = z.instanceof(FetchError).and(
  z.object({
    status: z.literal(422),
    data: ErrorDataSchema,
  }))

export function isValidationResponseError(error: Error): error is z.infer<typeof ValidationErrorResponseSchema> {
  return ValidationErrorResponseSchema.safeParse(error).success
}

export function simpleResource<Tdata extends z.ZodTypeAny>(dataSchema: Tdata) {
  return z.object({
    data: dataSchema,
  })
}

export function createResourceResponse<Tdata extends object>(data: Tdata | null) {
  return data ? { data } : null
}

export function resource<Tdata extends z.ZodTypeAny, Tmeta extends z.ZodTypeAny>(
  dataSchema: Tdata,
  metaSchema: Tmeta,
) {
  return z.object({
    data: dataSchema,
    meta: metaSchema,
  })
}

export function pagePaginatedResource<Tdata extends z.ZodTypeAny>(
  dataSchema: Tdata,
) {
  return resource(dataSchema, PagePaginationSchema)
}

export function cursorPaginatedResource<Tdata extends z.ZodTypeAny>(
  dataSchema: Tdata,
) {
  return resource(dataSchema, CursorPaginationSchema)
}
