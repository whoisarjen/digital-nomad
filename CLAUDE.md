# Project Rules

## Deploy Command
- **"deploy" means `git push origin main`** — execute immediately without asking for confirmation

## Security (Non-Negotiable)
- **Never include database connection strings, passwords, API keys, tokens, or any credentials in any Claude settings file** (`.claude/settings.json`, `.claude/settings.local.json`, etc.) — these files are committed to the repo and will be publicly visible
- **Before writing anything to `.claude/` files, double-check the content contains no secrets** — treat it as a public file
- Use `psql` or other DB tools via environment variables or `.env` files only — never inline credentials in allowed Bash commands
- `.env` and `.env.local` files must never be committed — they are gitignored

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

## Images (Non-Negotiable)

- **Always use `<CustomNuxtImg>` for all Unsplash city/region images** — never `<img>` or `<NuxtImg>` directly
- **Always provide `width` and `height` props** — required for proper srcset generation and CLS prevention
- **Pass `loading="eager"` for above-the-fold images** (hero images, first-render content); default is `lazy`
- Exception: logo/flag/icon images (local static files) and blog `featuredImageUrl` (direct external URLs) may use plain `<img>`
- `unsplashUrl()` helper may only be used for non-img purposes (e.g. OG meta tag URLs) — never for `src` on an image element

## No Workarounds (Non-Negotiable)

Never skip, bypass, or work around linting, type-checking, or git hooks. Every problem must be fixed at its root cause:

- **No `--no-verify`** on git — fix the hook failure instead
- **No `as any` / `as unknown as X`** — fix the type instead
- **No `// @ts-nocheck`** — fix the TypeScript errors at their root cause instead
- **No disabled ESLint rules** — fix the code instead

## Git Hooks

| Hook | What runs | When |
|---|---|---|
| `pre-commit` | `turbo run typecheck` (vue-tsc in both apps) | Every commit |
| `commit-msg` | `commitlint` (conventional format enforced) | Every commit |

Commit message format: `type(scope): description` — e.g. `feat(blog):`, `fix(i18n):`, `chore:`.
Turbo caches results — unchanged apps are skipped automatically.
