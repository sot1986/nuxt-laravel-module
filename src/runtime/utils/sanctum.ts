import type { GetHeadersPayload } from '../types/sanctum'
import { useCookie } from '#imports'

export function getHeaders(options: GetHeadersPayload) {
  const headers: Record<string, string> = {}

  const token = useCookie('XSRF-TOKEN', { default: () => '' }).value

  if (token)
    headers['X-XSRF-TOKEN'] = token

  if (process.client)
    return headers

  headers.referer = options.baseAppUrl

  if (options.cookieesRequestHeaders.cookie) {
    headers.cookie = options.cookieesRequestHeaders.cookie
      .split('; ')
      .filter((c) => {
        const cookie = c.split('=')[0]
        return options.cookieNames.reduce(
          (check, name) => check && (
            typeof name === 'string'
              ? name === cookie
              : name.test(cookie)), true)
      })
      .join('; ')
  }

  return headers
}

export function parseSetCookie(setCookie: string): string[] {
  const cookies = setCookie.split(', ')
  const result: string[] = []

  for (let index = cookies.length - 1; index >= 0; index -= 1) {
    const cookie = cookies[index]

    if (cookie.match(/^[a-zA-Z0-9\-_]+=/)) {
      result.push(cookie)
      continue
    }

    if (index > 0)
      cookies[index - 1] = `${cookies[index - 1]}, ${cookie}`
  }

  return result
}
