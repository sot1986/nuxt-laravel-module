import type { GetCsrfHeadersPayload } from '../types/sanctum'
import { useCookie } from '#imports'

export function getCsrfHeaders(options: GetCsrfHeadersPayload) {
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
      .filter(c => options.cookieNames.includes(c.split('=')[0]))
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
