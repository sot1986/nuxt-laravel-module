import { describe, expect, it } from 'vitest'

import stringifyQuery from '../../src/runtime/utils/stringifyQuery'

describe('validate stringigyQuery utils', () => {
  it.each([
    { obj: undefined, query: '' },
    { obj: { name: 'Matteo' }, query: 'name=Matteo' },
    { obj: { age: '4' }, query: 'age=4' },
    { obj: { check: false }, query: 'check=0' },
    { obj: { orderBy: ['date', '-id'] }, query: 'orderBy=date&orderBy=-id' },
    { obj: { address: { street: 'Via Germania', number: 4 } }, query: 'address[street]=Via Germania&address[number]=4' },
  ]) ('can convert all type of object', (param) => {
    const query = stringifyQuery(param.obj)

    expect(query).toBe(param.query)
  })
})
