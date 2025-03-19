// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src/',
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-lucide-icons'],
  nitro: {
    vercel: {
      regions: ['fra1'],
      functions: {
        maxDuration: 60
      }
    },
  },
})