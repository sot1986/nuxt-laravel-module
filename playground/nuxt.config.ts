export default defineNuxtConfig({
  modules: ['../src/module', 'sot-helpers', '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'],
  sotNuxtLaravel: {

  },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  nitro: {
    routeRules: {
      // '/dashboard': { ssr: false },
    },
  },
  runtimeConfig: {
    public: {
      baseURL: 'http://localhost:3000',
    },
  },
})
