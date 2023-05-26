export default function (query?: Record<string, unknown>): string {
  if (!query)
    return ''

  const baseQuery: string[] = []

  Object.entries(query).forEach(([key, value]) => {
    if (typeof value === 'object' && !value)
      return baseQuery.push(`${key}=`)

    if (typeof value === 'string' || typeof value === 'number')
      return baseQuery.push(`${key}=${value}`)

    if (typeof value === 'boolean')
      return baseQuery.push(`${key}=${value ? '1' : '0'}`)

    if (typeof value !== 'object')
      return

    if (Array.isArray(value))
      return baseQuery.push(...value.map(v => `${key}=${v as string}`))

    if (value) {
      return Object.entries(value).forEach(([k, v]) => {
        if (typeof v === 'string' || typeof v === 'number')
          return baseQuery.push(`${key}[${k}]=${v}`)

        if (typeof v === 'object')
          return baseQuery.push(`${key}[${k}]=${v ? '1' : '0'}`)
      })
    }
  })

  return baseQuery.join('&')
}
