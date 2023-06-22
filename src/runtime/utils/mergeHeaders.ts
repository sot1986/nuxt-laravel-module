export default function (newHeaders: Record<string, string>, options: { headers?: HeadersInit }) {
  Object.entries(newHeaders).forEach(([name, value]) => {
    if (options.headers instanceof Headers) {
      options.headers.append(name, value)
      return
    }

    if (Array.isArray(options.headers)) {
      options.headers.push([name, value])
      return
    }

    if (!options.headers) {
      options.headers = { [name]: value }
      return
    }

    options.headers[name] = value
  })
}
