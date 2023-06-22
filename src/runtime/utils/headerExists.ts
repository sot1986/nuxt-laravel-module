export default function (name: string, headers?: HeadersInit): boolean {
  if (!headers)
    return false

  if (headers instanceof Headers)
    return headers.has(name)

  if (Array.isArray(headers))
    return headers.map(h => h[0].toLowerCase()).includes(name.toLowerCase())

  return Object.keys(headers).map(h => h.toLowerCase()).includes(name.toLowerCase())
}
