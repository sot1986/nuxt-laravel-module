import createApiFetch from './utils/createApiFetch'
import convertDataCase from './utils/convertDataCase'
import capitalizeString from './utils/capitalizeString'
import stringifyQuery from './utils/stringifyQuery'
import convertResponseErrorInZodError from './utils/convertResponseErrorInZodError'
import { getHeaders, parseSetCookie } from './utils/sanctum'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      laravel: {
        createApiFetch,
        convertDataCase,
        capitalizeString,
        stringifyQuery,
        convertResponseErrorInZodError,
        getHeaders,
        parseSetCookie,
      },
    },
  }
})
