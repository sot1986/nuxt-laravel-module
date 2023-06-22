export interface GetHeadersPayload {
  baseAppUrl: string
  cookieNames: (string | RegExp)[]
  cookieesRequestHeaders: { cookie?: string }
}

export {}
