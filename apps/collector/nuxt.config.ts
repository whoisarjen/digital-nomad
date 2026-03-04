// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: '.',
  compatibilityDate: '2025-03-11',
  modules: ['@nuxt/test-utils/module'],
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  devServer: { port: 3001 },
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
})
