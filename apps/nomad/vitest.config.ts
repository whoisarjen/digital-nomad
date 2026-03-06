import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    {
      name: 'mock-nuxt-imports',
      resolveId(id) {
        if (id === '#imports') return '\0virtual:#imports'
      },
      load(id) {
        if (id === '\0virtual:#imports') return 'export {}'
      },
    },
    {
      name: 'inject-nuxt-auto-imports',
      enforce: 'pre',
      transform(code, id) {
        if (!id.includes('/src/server/') || id.includes('__tests__')) return
        const autoImports = [
          'defineEventHandler',
          'defineSitemapEventHandler',
          'getLocale',
          'getLocalizedSelect',
          'getValidatedRouterParams',
          'getQuery',
          'prisma',
          'buildSitemapAlternatives',
        ]
        const used = autoImports.filter((name) => code.includes(name))
        if (used.length) {
          return `import { ${used.join(', ')} } from '#imports';\n${code}`
        }
      },
    },
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/__tests__/**/*.{test,spec}.ts'],
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,vue}'],
      exclude: [
        'src/**/__tests__/**',
        'src/locales/**',
        '**/*.d.ts',
      ],
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
      },
    },
  },
})
