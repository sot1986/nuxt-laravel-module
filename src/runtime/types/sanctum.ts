export interface GetCsrfHeadersPayload {
  baseAppUrl: string
  cookieNames: string[]
  cookieesRequestHeaders: { cookie?: string }
}

export {}
