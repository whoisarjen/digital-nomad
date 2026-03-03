# Project Rules

## Deploy Command
- **"deploy" means `git push origin main`** — execute immediately without asking for confirmation

## Security (Non-Negotiable)
- **Never include database connection strings, passwords, or credentials in any Claude settings file** (`.claude/settings.json`, `.claude/settings.local.json`, etc.)
- Use `psql` or other DB tools via environment variables or `.env` files only — never inline credentials in allowed Bash commands

## Prisma Queries (Non-Negotiable)
- **Always use `select`, never `include` or `omit`** — only fetch the exact fields needed
- Follow the deante-monorepo pattern exactly

## Server Endpoint Pattern (Non-Negotiable)
Every server API endpoint must follow this exact pattern from `src/server/api/blog/[slug].get.ts`:

1. **Localization setup** — always start with:
   ```ts
   const language = getLocale(event);
   const select = getLocalizedSelect(language);
   ```

2. **Prisma `select` with computed keys** — use `as const` on localized field keys:
   ```ts
   select: {
     slug: true,
     [`title${select}` as const]: true,
     [`excerpt${select}` as const]: true,
   }
   ```

3. **Transform with computed access** — map Prisma result to clean response:
   ```ts
   return {
     title: article[`title${select}` as const] ?? null,
   };
   ```

4. **Type narrowing via `CurrentLanguage`** — `getLocale()` returns `CurrentLanguage = 'en'` (single literal, not union). This makes computed keys resolve to one known Prisma property at the type level (e.g. `titleEn`), while runtime uses the actual language. Same pattern as deante's `CurrentLanguage = 'pl'`.

5. **No explicit return types** — let TypeScript infer from the transform.

6. **Only `as` allowed**: `as const` on computed keys, `as FaqJson[]` on JSON columns. No `as unknown as X` or `as any` on Prisma results.

## TDD Workflow (Non-Negotiable)

Every task goes through Red → Green → Refactor. No exceptions.

### The Cycle
1. **Red** — Write a failing test that describes the desired behavior (the effect, not the implementation)
2. **Green** — Write the minimum code to make the test pass
3. **Refactor** — Clean up; run tests again to confirm they still pass

### Test Commands
```bash
cd apps/nomad
npm run test          # watch mode (use during development)
npm run test:run      # single run (use for CI)
npm run test:coverage # coverage report
```

From repo root:
```bash
npm test              # runs all tests via turbo
```

### Test File Location
Tests live next to the source file in a `__tests__/` subdirectory:
```
src/
  server/api/blog/
    [slug].get.ts
    __tests__/
      [slug].get.test.ts    ← server route test
  composables/
    useCities.ts
    __tests__/
      useCities.test.ts     ← composable test
  components/
    CityCard.vue
    __tests__/
      CityCard.test.ts      ← component test
```

### Server Route Tests
Mock `prisma` and `getLocale`/`getLocalizedSelect` with `vi.hoisted()` + `vi.mock('#imports')`. Import the handler inside `beforeAll` (after Nuxt env initializes):

```ts
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { createMockH3Event } from '~/test/mocks/h3-event'

const { prismaMock, getLocaleMock } = vi.hoisted(() => ({
  prismaMock: { article: { findFirstOrThrow: vi.fn() } },
  getLocaleMock: vi.fn(() => 'En' as const),
}))

vi.mock('#imports', async (importOriginal) => ({
  ...(await importOriginal()),
  prisma: prismaMock,
  getLocale: getLocaleMock,
  getLocalizedSelect: vi.fn(() => 'En'),
}))

describe('GET /api/blog/[slug]', () => {
  let handler: Awaited<typeof import('~/server/api/blog/[slug].get')>
  beforeAll(async () => { handler = await import('~/server/api/blog/[slug].get') })

  it('returns title for valid slug', async () => {
    prismaMock.article.findFirstOrThrow.mockResolvedValue({ titleEn: 'Hello', ... })
    const result = await handler.default(createMockH3Event({ params: { slug: 'hello' } }))
    expect(result.title).toBe('Hello')
  })
})
```

### Composable Tests
- **No Nuxt lifecycle** → call directly or use `withSetup` from `~/test/utils/withSetup`
- **Needs Nuxt auto-imports / `useI18n` / etc.** → use `mountSuspended` + `mockNuxtImport` from `@nuxt/test-utils/runtime`

### Component Tests
Use `mountSuspended` from `@nuxt/test-utils/runtime`. Test rendered output and emitted events — never internal state.

```ts
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CityCard from '~/components/CityCard.vue'

it('renders city name', async () => {
  const wrapper = await mountSuspended(CityCard, { props: { city } })
  expect(wrapper.text()).toContain('Barcelona')
})
```

### MSW (network mocking)
For composables using `$fetch`/`useFetch`, override MSW handlers per-test:
```ts
import { server } from '~/test/setup'
import { http, HttpResponse } from 'msw'

server.use(http.get('/api/cities', () => HttpResponse.json({ data: [] })))
