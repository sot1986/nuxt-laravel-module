import { describe, expect, it } from 'vitest'
import mergeHeaders from '../../src/runtime/utils/mergeHeaders'

describe('test merge Headers', () => {
  it('can merge undefined headers', () => {
    const options = {}

    const headers = {
      Name1: 'Value1',
      Name2: 'Value2',
    }

    mergeHeaders(headers, options)

    expect(options).toEqual({ headers })
  })

  it('can merge object headers', () => {
    const options = {
      headers: {
        Name1: 'Value1',
        Name2: 'Value2',
      },
    }

    const headers = {
      Name3: 'Value3',
      Name4: 'Value4',
    }

    mergeHeaders(headers, options)

    expect(options).toEqual({
      headers: {
        Name1: 'Value1',
        Name2: 'Value2',
        Name3: 'Value3',
        Name4: 'Value4',
      },
    })
  })

  it('can merge array headers', () => {
    const options = {
      headers: [
        ['Name1', 'Value1'],
        ['Name2', 'Value2'],
      ] as HeadersInit,
    }

    const headers = {
      Name3: 'Value3',
      Name4: 'Value4',
    }

    mergeHeaders(headers, options)

    expect(options).toEqual({
      headers: [
        ['Name1', 'Value1'],
        ['Name2', 'Value2'],
        ['Name3', 'Value3'],
        ['Name4', 'Value4'],
      ],
    })
  })

  it('can merge Headers instance', () => {
    const options = {
      headers: new Headers({
        Name1: 'Value1',
        Name2: 'Value2',
      }),
    }
    const headers = {
      Name3: 'Value3',
      Name4: 'Value4',
    }
    mergeHeaders(headers, options)

    expect(options.headers.has('Name1')).toBe(true)
    expect(options.headers.has('Name2')).toBe(true)
    expect(options.headers.has('Name3')).toBe(true)
    expect(options.headers.has('Name4')).toBe(true)
  })
})
