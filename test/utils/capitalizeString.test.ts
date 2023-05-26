import { describe, expect, it } from 'vitest'
import capitalizeString from '../../src/runtime/utils/capitalizeString'

describe('test capitalize function', () => {
  it.each([
    { value: 'word', capitalized: 'Word' },
    { value: 'Word-name', capitalized: 'Word-name' },
    { value: 'name1', capitalized: 'Name1' },
    { value: 'A', capitalized: 'A' },
    { value: 'snake_case', capitalized: 'Snake_case' },
  ])('can correctly capitalize the value', ({ value, capitalized }) => {
    const newValue = capitalizeString(value)

    expect(newValue).toBe(capitalized)
  })

  it.each([
    { value: '1sd' },
    { value: '' },
    { value: 'Two Words' },
  ])('throw errors if string does not meet minimum requirements', ({ value }) => {
    expect(() => {
      capitalizeString(value)
    }).toThrowError()
  })
})
