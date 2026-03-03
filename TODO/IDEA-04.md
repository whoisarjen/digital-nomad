# IDEA-04: Country Landing Pages
**Status:** NOT_STARTED
**Priority:** 4/39
**Complexity:** M

## What's Already Implemented
Nothing. No `/pages/countries/` directory, no `/server/api/countries/` directory. However, zero schema changes are needed — `City.countrySlug`, `City.country`, and `City.countryCode` already exist.

## Revised Analysis
The `/regions/[region].vue` + `[region].get.ts` pattern is the **exact template** to follow. Key design decisions:

- **Grouping**: Use Prisma `groupBy` on `countrySlug` for the index listing, or `findMany({ distinct: ['countrySlug'] })`. `groupBy` is cleaner for getting aggregates (city count, avg cost, avg internet).
- **No localization needed in server endpoints** — country names are stored as plain strings in `City.country` (not bilingual titleEn/titlePl). No `getLocale`/`getLocalizedSelect` calls needed.
- **Zod validation**: Unlike regions (finite enum), `countrySlug` is a free-form string from the DB. Use `z.string().min(1).max(100)` and throw 404 if no cities found — don't use a static map.
- **URL slugs**: Use `/countries/[countrySlug]` in EN and `/kraje/[countrySlug]` in PL (or just `/countries/` universally — simpler). The `countrySlug` value is already a clean URL-safe slug in the DB.
- **Flag rendering**: Derive flag emoji from `countryCode` — no external library needed: `String.fromCodePoint(...[...code.toUpperCase()].map(c => c.charCodeAt(0) + 127397))`
- **City filtering**: The existing `getCitiesSchema` on `/api/cities` doesn't have a `countrySlug` field. The country detail endpoint should be its own dedicated endpoint (like regions) rather than extending the general cities endpoint. This avoids polluting the main cities filter schema.
- **Sorting**: Sort by average `MonthSummary.totalScore` for the current month — same as region pages.

## Implementation Plan

### Database Changes
None.

### API Endpoints
**New file**: `apps/nomad/src/server/api/countries/index.get.ts`
- Query: `prisma.city.groupBy({ by: ['countrySlug', 'country', 'countryCode'], _count: { id: true }, _avg: { costForNomadInUsd: true, internetSpeedCity: true }, orderBy: { _count: { id: 'desc' } } })`
- Returns: array of `{ countrySlug, country, countryCode, cityCount, avgCost, avgInternet }`

**New file**: `apps/nomad/src/server/api/countries/[countrySlug].get.ts`
- Validate `countrySlug` via Zod `z.string().min(1).max(100)`
- Follow `apps/nomad/src/server/api/regions/[region].get.ts` exactly:
  - Get current month's `MonthSummary` data joined to cities in this country
  - Return `{ country, countryCode, cityCount, stats: { costMin, costMax, avgSpeed, safetyHighCount }, cities: [...top 20] }`
- Use `select` only (never `include`)
- Throw 404 if no cities found for countrySlug

### Frontend Components/Pages
**New file**: `apps/nomad/src/pages/countries/index.vue`
- Country grid with flags (emoji), city count, cost range
- `useHead()` with title, description, canonical, hreflang, BreadcrumbList JSON-LD
- `defineI18nRoute({ paths: { en: '/countries', pl: '/kraje' } })`

**New file**: `apps/nomad/src/pages/countries/[countrySlug].vue`
- Mirror `apps/nomad/src/pages/regions/[region].vue` structure
- Dark hero with country flag (emoji), country name, aggregate stats chips
- City grid reusing `CityCard.vue`
- `useHead()` with full SEO: title, desc, canonical, hreflang, BreadcrumbList + ItemList JSON-LD
- `defineI18nRoute({ paths: { en: '/countries/[countrySlug]', pl: '/kraje/[countrySlug]' } })`

**New file**: `apps/nomad/src/server/api/__sitemap__/countries.ts`
- Query distinct `countrySlug` values: `prisma.city.findMany({ distinct: ['countrySlug'], select: { countrySlug: true } })`
- Return paths for all locales (EN + PL at minimum)

**New composable**: `apps/nomad/src/composables/useCountry.ts`
- Wraps `useCustomQuery` for both endpoints

**Modify**: `apps/nomad/nuxt.config.ts`
- Register country sitemap source
- Add route rule for country pages if needed

**Modify**: `apps/nomad/src/pages/cities/[slug].vue`
- Add link from city page to its country page (in the breadcrumb or a "More cities in [Country]" link)

### i18n Changes
Add to `en.json` and all locale files:
```json
"countryPage": {
  "title": "Best Digital Nomad Cities in {country} | Cost, Internet & Safety",
  "description": "{count} digital nomad cities in {country}. Compare costs, internet speeds, safety ratings, and climate.",
  "heading": "Digital Nomad Cities in {country}",
  "allCountries": "All Countries",
  "allCountriesTitle": "Digital Nomad Cities by Country",
  "allCountriesDesc": "Browse {count} countries with digital nomad city data.",
  "cityCount": "{count} cities"
}
```

## Dependencies
- IDEA-03 (Region pages): Country pages should link to their region page (e.g., Thailand → Southeast Asia). Region pages already exist.

## Notes
- `countrySlug` is already URL-safe in the DB — no slug generation needed.
- The country index page (`/countries`) creates ~150 new indexable pages with internal links — significant SEO surface area.
- Flag emoji approach avoids any external dependency and works in all modern browsers.
- Consider linking country pages from city cards (small flag + country name as a link) for internal link equity.
- Do NOT add `countrySlug` as a filter to the main `/api/cities` endpoint — use the dedicated country endpoint to keep the main filter schema clean.
