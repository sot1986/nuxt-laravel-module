import { z } from 'zod'

import { LaraApiSchemas } from '#imports'

export const UserSchema = z.object({
  id: z.coerce.bigint(),
  name: z.string().min(1).max(255),
  email: z.string().min(1).max(255).email(),
})

export const AuthSchema = UserSchema.merge(z.object({
  emailVerifiedAt: z.string().datetime().nullable(),
  mfaEnabled: z.boolean().nullable(),
})).merge(LaraApiSchemas.TimeStampsSchema).partial({
  mfaEnabled: true,
})

export const PostSchema = z.object({
  id: z.coerce.bigint(),
  title: z.string().min(1).max(255),
  content: z.string().min(1).max(1000),
  userId: z.coerce.bigint().positive(),
}).merge(LaraApiSchemas.TimeStampsSchema)

export type Auth = z.infer<typeof AuthSchema>
