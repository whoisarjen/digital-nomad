---
paths:
  - "src/components/**/*.vue"
  - "src/pages/**/*.vue"
  - "src/layouts/**/*.vue"
  - "src/app.vue"
---

# Vue Component Rules

## Stack
- Vue 3 `<script setup lang="ts">` + Tailwind CSS
- Icons: `nuxt-lucide-icons` (e.g., `<LucideHeart />`)
- Images: `<NuxtImg>` from `@nuxt/image`
- Links: `<NuxtLink>` with `localePath()` for i18n routing

## i18n
- Use `$t('key')` in templates, `t('key')` in script
- `useCustomI18n()` wraps `useI18n()` — use it for locale-aware logic
- `localePath('/path')` for all internal navigation
- Translations live in `src/locales/{lang}.json`

## Data Fetching
- Use composables (`useCities`, `useArticles`, etc.) — never raw `$fetch` in components
- Destructure: `const { data, isPending } = await useCities(query)`

## SEO (pages only)
- `useHead()` / `useSeoMeta()` for meta tags
- `useSchemaOrg()` for JSON-LD structured data
