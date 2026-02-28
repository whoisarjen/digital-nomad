// https://nuxt.com/docs/api/configuration/nuxt-config
import { LOCALES } from './src/constants/global.constant'

export default defineNuxtConfig({
  srcDir: 'src/',
  compatibilityDate: '2024-11-01',
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  app: {
    head: {
      title: 'Digital Nomad - Find Your Next Nomad City',
      meta: [
        { name: 'description', content: 'Compare 500+ cities by cost, weather, internet, safety & more. Find the perfect city for your digital nomad lifestyle.' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      ],
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-lucide-icons',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
  ],
  i18n: {
    baseUrl: 'https://nomad.whoisarjen.com',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root',
    },
    locales: LOCALES.map(({ code, name }) => ({
      code,
      language: code,
      file: `${code}.json`,
      name,
    })),
    lazy: true,
    langDir: '../src/locales',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    vueI18n: './src/i18n.config.ts',
  },
  nitro: {
    vercel: {
      regions: ['fra1'],
    },
  },
  image: {
    providers: {
      unsplash: {
        options: {
          baseURL: 'https://images.unsplash.com'
        }
      }
    }
  },
})