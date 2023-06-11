/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './playground/components/**/*.{js,vue,ts}',
    './playground/layouts/**/*.vue',
    './playground/pages/**/*.vue',
    './playground/plugins/**/*.{js,ts}',
    './playground/nuxt.config.{js,ts}',
    './playground/app.vue',
  ],
  theme: {
    extend: {
      textColor: {
        skin: {
          'base-notification': 'var(--color-text-notification)',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
