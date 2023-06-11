import createApiFetch from './utils/createApiFetch'
import * as schemas from './schemas'
import convertDataCase from './utils/convertDataCase'
import capitalizeString from './utils/capitalizeString'
import stringifyQuery from './utils/stringifyQuery'
import convertResponseErrorInZodError from './utils/convertResponseErrorInZodError'
import { getCsrfHeaders, parseSetCookie } from './utils/sanctum'
import type { Laravel } from './types/laravel'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin<{ laravel: Laravel }>(() => {
  return {
    provide: {
      laravel: {
        schemas,
        utils: {
          createApiFetch,
          convertDataCase,
          capitalizeString,
          stringifyQuery,
          convertResponseErrorInZodError,
          getCsrfHeaders,
          parseSetCookie,
        },
      },
    },
  }
})
