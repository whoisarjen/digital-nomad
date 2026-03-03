# Project Rules

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
