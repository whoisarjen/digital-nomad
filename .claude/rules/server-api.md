---
paths:
  - "src/server/api/**/*.ts"
  - "src/server/utils/**/*.ts"
  - "src/server/middleware/**/*.ts"
  - "src/server/routes/**/*.ts"
---

# Server API Endpoint Rules

## Localization (every public endpoint)
```ts
const language = getLocale(event);
const select = getLocalizedSelect(language);
```
- `getLocale()` returns `CurrentLanguage = 'en'` (single literal, not union)
- `getLocalizedSelect()` maps language to suffix string (`'En'`, `'Pl'`, etc.)
- Both are auto-imported from `~/server/utils/i18n.utils.server`

## Prisma Queries
- **Always `select`, never `include` or `omit`**
- Use `as const` on every computed localized key:
  ```ts
  [`title${select}` as const]: true
  ```
- For nested relations, use nested `select`:
  ```ts
  cities: { select: { isPrimary: true, city: { select: { slug: true } } } }
  ```

## Response Transform
- Map Prisma result to clean response (strip locale suffixes):
  ```ts
  return { title: article[`title${select}` as const] ?? null };
  ```

## JSON Columns
- Only allowed cast: `as FaqJson[]` on JSON columns
- No `as unknown as X` or `as any` on Prisma results

## Return Types
- Never declare explicit return types — let TypeScript infer

## Validation
- Use `getValidatedRouterParams` or `getValidatedQuery` with Zod schemas from `~/shared/global.schema`

## Auto-imports
- `prisma` from `~/server/utils/prisma.utils.server`
- `getLocale`, `getLocalizedSelect` from `~/server/utils/i18n.utils.server`
- `defineEventHandler`, `getValidatedRouterParams`, `getValidatedQuery`, `createError` from Nitro/H3
