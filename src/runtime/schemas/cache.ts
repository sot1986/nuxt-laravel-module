import { z } from 'zod'

export function createCacheItemSchema<Tdata extends z.ZodTypeAny>(
  dataSchema: Tdata,
) {
  return z.object({
    expiration: z.string(),
    response: dataSchema,
    key: z.string(),
  })
}
