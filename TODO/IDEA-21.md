# IDEA-21: Schengen 90/180 Day Calculator
**Status:** NOT_STARTED
**Priority:** 21/39
**Complexity:** M

## What's Already Implemented
Nothing. No `/tools/` pages directory exists. No Schengen-related logic anywhere in the codebase. `City.region` (Region enum) is available for non-Schengen recommendations.

## Revised Analysis
Core feature is pure date arithmetic — entirely client-side. The complexity is in:
1. Setting up `/tools/` page structure and i18n routing
2. The rolling 180-day window algorithm (common mistake: treating it as a fixed calendar period)
3. Non-Schengen city recommendations — filter by region/country

**Rolling window algorithm:**
For any check date D: look back 180 days. Sum overlapping days from each entry/exit pair within `[D - 180, D]`. Must not exceed 90.

```ts
for each date D:
  windowStart = D - 180 days
  daysUsed = sum of overlap between each [entry, exit] pair and [windowStart, D]
  if daysUsed >= 90: you're at limit
nextSafeEntry = date when oldest days fall off the 180-day window
```

**Non-Schengen recommendations:** Use a hardcoded list of Schengen member countries (26) to filter `City.country`. Any `region !== 'Europe'` is automatically non-Schengen. Among European cities, filter out the 26 Schengen members. No API change strictly needed — a simple static `SCHENGEN_COUNTRIES` set in a constant.

**i18n routing:** Start with English-only path `/tools/schengen-calculator`. Add `/narzedzia/kalkulator-schengen` for PL in a follow-up pass. The `defineI18nRoute` pattern is established.

**SSR:** Page has no server-side data dependency. Use `definePageMeta({ ssr: false })` or leave SSR on with empty initial state — both work.

**Shareable state:** Store entry/exit pairs in URL query params as `?e=2025-01-10:2025-02-15,2025-03-01:2025-04-20` — nice-to-have V2.

## Implementation Plan

### Database Changes
None.

### API Endpoints
None for the calculator itself. Optionally extend `GET /api/cities` with `nonSchengen=true` param for recommendations — a 5-line addition to `getCitiesSchema` and `index.get.ts`.

### Frontend Components/Pages
**New file**: `apps/nomad/src/pages/tools/schengen-calculator.vue`
- `defineI18nRoute({ paths: { en: '/tools/schengen-calculator' } })`
- Full SEO `useHead`: title "Schengen Calculator for Digital Nomads | 90/180 Day Tracker"
- Entry/exit date pair inputs with add/remove rows
- Computed: `daysUsed`, `daysRemaining`, `nextSafeEntry`, `isOverLimit`
- Visual progress bar (0–90, color-coded: green < 60, yellow 60–80, red 80+)
- Warning + non-Schengen city recommendations when < 20 days remain

**New file**: `apps/nomad/src/composables/useSchengenCalculator.ts`
- Input: `entries: Ref<Array<{ from: string; to: string }>>`
- Pure date arithmetic, no API calls
- Exports: `daysUsed`, `daysRemaining`, `nextSafeEntry`, `isOverLimit`

**New file**: `apps/nomad/src/components/SchengenEntryRow.vue`
- Two date inputs (entry date, exit date), remove button

**New constant**: Add `SCHENGEN_COUNTRY_CODES` set to `apps/nomad/src/shared/global.utils.ts`
- 26 Schengen member country codes for filtering recommendations

**Add link** in footer or nav to `/tools/schengen-calculator`

**Sitemap:** Add static entry via `nuxt.config.ts` `sitemap.urls` — simpler than a `__sitemap__` API for fixed URLs.

### i18n Changes
Add to all locale files:
```json
"schengen": {
  "title": "Schengen 90/180 Day Calculator",
  "subtitle": "Track your Schengen zone days remaining",
  "addEntry": "Add entry",
  "entryDate": "Entry date",
  "exitDate": "Exit date",
  "daysUsed": "{days} days used",
  "daysRemaining": "{days} days remaining",
  "nextSafeEntry": "Next safe entry: {date}",
  "overLimit": "You are over the 90-day limit",
  "lowDays": "Running low — consider these non-Schengen cities:",
  "noEntries": "Add your first Schengen entry above"
}
```

## Dependencies
None. Fully self-contained. Shares `/tools/` directory with IDEA-22.

## Notes
- Non-Schengen European countries to include in recommendations: UK, Ireland, Albania, Bosnia, Kosovo, North Macedonia, Moldova, Montenegro, Serbia, Ukraine, Georgia, Armenia, Azerbaijan.
- The rolling 180-day window is commonly misunderstood — implement carefully and add a clear tooltip/explanation on the page.
- Add the tools pages to the sitemap statically.
