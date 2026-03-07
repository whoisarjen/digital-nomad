// https://nuxt.com/docs/api/configuration/nuxt-config
import { LOCALES } from './src/constants/global.constant'

const fullSitePath = process.env.NUXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NUXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000'

export default defineNuxtConfig({
  srcDir: 'src/',
  serverDir: 'src/server',
  compatibilityDate: '2025-03-11',
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  devServer: { port: 3000 },
  site: {
    url: 'https://nomad.whoisarjen.com',
    name: 'Digital Nomad',
    description: 'Compare 500+ cities by cost, weather, internet, safety & more. Find the perfect city for your digital nomad lifestyle.',
    defaultLocale: 'en',
  },
  runtimeConfig: {
    NUXT_AUTH_SECRET: process.env.NUXT_AUTH_SECRET,
  },
  app: {
    head: {
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
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@sidebase/nuxt-auth',
  ],
  auth: {
    baseURL: `${fullSitePath}/api/auth`,
    originEnvKey: '',
    provider: {
      type: 'authjs',
      trustHost: false,
    },
    sessionRefresh: {
      enableOnWindowFocus: false,
      enablePeriodically: 3600000,
    },
  },
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
    langDir: '../src/locales',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    vueI18n: './src/i18n.config.ts',
  },
  sitemap: {
    autoI18n: {
      locales: LOCALES.map(({ code }) => ({ code, language: code, _sitemap: code, _hreflang: code })),
      defaultLocale: 'en',
      strategy: 'prefix_except_default',
    },
    exclude: [
      '/dashboard',
      '/join',
    ],
    cacheMaxAgeSeconds: 86400,
    defaultSitemapsChunkSize: 1000,
    defaults: {
      changefreq: 'weekly',
    },
    sitemaps: {
      pages: {
        includeAppSources: true,
      },
      cities: {
        sources: ['/api/__sitemap__/cities'],
        includeAppSources: false,
      },
      articles: {
        sources: ['/api/__sitemap__/articles'],
        includeAppSources: false,
      },
      regions: {
        sources: ['/api/__sitemap__/regions'],
        includeAppSources: false,
      },
      countries: {
        sources: ['/api/__sitemap__/countries'],
        includeAppSources: false,
      },
    },
  },
  robots: {
    allow: ['/'],
    disallow: ['/api/'],
    sitemap: 'https://nomad.whoisarjen.com/sitemap_index.xml',
  },
  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Digital Nomad',
      url: 'https://nomad.whoisarjen.com',
      logo: 'https://nomad.whoisarjen.com/logo.svg',
    },
  },
  ogImage: {
    enabled: false,
  },
  nitro: {
    vercel: {
      regions: ['fra1'],
    },
    routeRules: {
      '/__sitemap__/**': { isr: true },
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