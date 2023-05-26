import { addImportsDir, addPlugin, addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import defu from 'defu'
import { z } from 'zod'

// Module options TypeScript interface definition
export interface ModuleOptions {
  confirmCredentialsErrorStatusCode: number
}

export * from './runtime/types/laravel'

export * from './runtime/types/api'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'sot-nuxt-laravel',
    configKey: 'sotNuxtLaravel',
  },
  defaults: {
    confirmCredentialsErrorStatusCode: 423,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    addPlugin(resolver.resolve('./runtime/plugin'))

    const ConfigSchema = z.object({
      confirmCredentialsErrorStatusCode: z.number().min(400).max(500),
    })
    const config = ConfigSchema.partial().parse(
      nuxt.options.runtimeConfig.public.sotNuxtLaravel ?? {},
    )
    const moduleConfig = ConfigSchema.parse({
      confirmCredentialsErrorStatusCode: options.confirmCredentialsErrorStatusCode,
    })

    nuxt.options.runtimeConfig.public.sotNuxtLaravel = defu(
      config,
      moduleConfig,
    )

    addImportsDir([
      resolver.resolve('.', 'runtime', 'composables'),
    ])

    // Transpile runtime
    nuxt.options.build.transpile.push(resolver.resolve('./runtime'))

    addTemplate({
      filename: 'types/sot-nuxt-laravel.d.ts',
      getContents: () => [
        `import type { Laravel } from '${resolver.resolve('./runtime/types/laravel')}'`,
        '',
        'interface sotNuxtLaravelPlugin {',
        '  $laravel: Laravel',
        '}',
        'declare module \'#app\' {',
        '  interface NuxtApp extends sotNuxtLaravelPlugin {}',
        '}',
        'declare module \'vue\' {',
        '  interface ComponentCustomProperties extends sotNuxtLaravelPlugin {}',
        '}',
        'export {}',
      ].join('\n'),
    })

    nuxt.hook('prepare:types', (options) => {
      options.references.push({ path: resolver.resolve(nuxt.options.buildDir, 'types/sot-nuxt-laravel.d.ts') })
    })
  },
})
