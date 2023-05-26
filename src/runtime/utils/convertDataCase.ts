import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import type { ConvertDataCase } from '../types/convertDataCase'

function convertURLSearchParams(
  data: URLSearchParams, newCase: 'camelCase' | 'snakeCase',
): ConvertDataCase<URLSearchParams> {
  const newData = new URLSearchParams()

  data.forEach((value, key) => {
    const newCaseKey = useChangeCase(key, newCase).value
    newData.append(newCaseKey, value)
  })

  return newData
}

function convertFormData<T>(data: FormData & T, newCase: 'camelCase' | 'snakeCase'): ConvertDataCase<T> {
  const newData = new FormData()

  data.forEach((value, key) => {
    const newCaseKey = useChangeCase(key, newCase).value
    newData.append(
      newCaseKey,
      value,
    )
  })

  return newData as ConvertDataCase<T>
}

export default function convertDataCase<T>(data: T, newCase: 'camelCase' | 'snakeCase'): ConvertDataCase<T> {
  if (data instanceof URLSearchParams)
    return convertURLSearchParams(data, newCase) as ConvertDataCase<T>

  if (data instanceof FormData)
    return convertFormData(data, newCase)

  if (typeof data !== 'object' || !data)
    return data as ConvertDataCase<T>

  if (
    data instanceof ArrayBuffer
    || ArrayBuffer.isView(data)
    || data instanceof Blob
    || data instanceof ReadableStream
  )
    return data as ConvertDataCase<T>

  if (Array.isArray(data))
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data.map(d => convertDataCase(d, newCase)) as ConvertDataCase<T>

  const newCaseObject = {} as Record<string, unknown>
  Object.entries(data).forEach(([key, value]) => {
    const newCaseKey = useChangeCase(key, newCase).value
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const newValue = convertDataCase(value, newCase)
    newCaseObject[newCaseKey] = newValue
  })
  return newCaseObject as ConvertDataCase<T>
}
