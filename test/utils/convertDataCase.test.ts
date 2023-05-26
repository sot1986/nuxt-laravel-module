import { describe, expect, it } from 'vitest'

import convertDataCase from '../../src/runtime/utils/convertDataCase'

describe('request are converted in snake Case', () => {
  it.each([
    {
      before: { name: 'Matteo', yearsOld: 50 },
      after: { name: 'Matteo', years_old: 50 },
    },
    {
      before: { name: 'Matteo', address: { countryCode: 'IT' } },
      after: { name: 'Matteo', address: { country_code: 'IT' } },
    },
  ]) ('Objectes are converted to Snake Case', ({ before, after }) => {
    const data = convertDataCase(before, 'snakeCase') as unknown

    expect(data).toEqual(after)
  })

  it('Search Parameters are converted to Snake Case', () => {
    const beforeData = new URLSearchParams()
    beforeData.append('firstName', 'Matteo')
    beforeData.append('lastName', 'Presot')
    beforeData.append('address', 'viaGermania')

    const afterData = convertDataCase(beforeData, 'snakeCase') as unknown
    expect(afterData).toBeInstanceOf(URLSearchParams)

    const keys = Array.from((afterData as URLSearchParams).keys())
    expect(keys).toEqual(['first_name', 'last_name', 'address'])

    const values = Array.from((afterData as URLSearchParams).values())
    expect(values).toEqual(['Matteo', 'Presot', 'viaGermania'])
  })

  it('FormData are converted to Snake Case', () => {
    const dataBefore = new FormData()
    const bornDate = new Date('1986/02/25').toISOString()

    dataBefore.append('firstName', 'Matteo')
    dataBefore.append('lastName', 'Presot')
    dataBefore.append('address', 'viaGermania')
    dataBefore.append('bornDate', bornDate)

    const afterData = convertDataCase(dataBefore, 'snakeCase') as unknown
    expect(afterData).toBeInstanceOf(FormData)

    const keys = Array.from((afterData as FormData).keys())
    expect(keys).toEqual(['first_name', 'last_name', 'address', 'born_date'])

    const values = Array.from((afterData as FormData).values())
    expect(values).toEqual(['Matteo', 'Presot', 'viaGermania', bornDate])
  })
})
