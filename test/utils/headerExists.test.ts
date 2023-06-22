import { describe, expect, it } from 'vitest'
import headerExists from '../../src/runtime/utils/headerExists'

describe('test header Exists', () => {
  it.each([
    { headers: undefined, name: 'Silence', result: false },
    { headers: { Silence: '1' }, name: 'Silence', result: true },
    { headers: { silence: '1' }, name: 'Silence', result: true },
    { headers: { silEnce: '1' }, name: 'silence', result: true },
    { headers: new Headers({ silence: '1' }), name: 'silence', result: true },
    { headers: new Headers({ silence: '1' }), name: 'Silence', result: true },
    { headers: [['Silence', '1']], name: 'silence', result: true },
  ])('check header existance with any typeof headers', ({ headers, name, result }) => {
    expect(headerExists(name, headers as unknown as HeadersInit)).toBe(result)
  })
})
