import { z } from 'zod'

export default function<T extends string>(value: T): Capitalize<T> {
  const capitalizeSchema = z
    .string()
    .min(1, 'Minum characters lenght is 1.')
    .regex(/^[a-zA-Z](([a-zA-Z0-9_-])+)?$/, 'Only alpha numeric names are allowed.')

  capitalizeSchema.parse(value)

  return value.substring(0, 1).toUpperCase() + value.substring(1) as Capitalize<T>
}
