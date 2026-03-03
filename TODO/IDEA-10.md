# IDEA-10: Best Cities by Month Pages
**Status:** NOT_STARTED
**Priority:** 10/39
**Complexity:** M

## What's Already Implemented
Nothing. No `/best-cities/` pages exist. However, the data infrastructure is complete — `MonthSummary` table has all needed data.

The existing `apps/nomad/src/pages/regions/[region].vue` + `apps/nomad/src/server/api/regions/[region].get.ts` is the **exact blueprint** to follow. The `REGION_SLUG_MAP` pattern in `apps/nomad/src/shared/global.utils.ts` should be replicated as a `MONTH_SLUG_MAP`.

## Revised Analysis
The original plan is sound. Key decisions based on codebase patterns:

- Use a `MONTH_SLUG_MAP` constant (`{ january: '01', february: '02', ... }`) and `MONTH_SLUGS` array for validation — mirror `REGION_SLUG_MAP`
- The API should query `MonthSummary` by month number, join to `City`, sort by `totalScore` desc, limit 20
- Month slug pages conflict with `regions/[region]` if both live under `/best-cities/[*]` — they need separate routes:
  - Regions: `/best-cities/europe` → `pages/best-cities/regions/[region].vue`
  - Or months stay at `/best-cities/january` since region hub pages live at `/regions/[region]` (already implemented under `/regions/`)
- The month pages can live at `/best-cities/[month].vue` with no conflict since regions live at `/regions/[region]`

## Implementation Plan

### Database Changes
None.

### API Endpoints
**New file**: `apps/nomad/src/server/api/cities/best-for-month/[month].get.ts`
- Validate `month` param against `MONTH_SLUG_MAP`
- Query: `prisma.monthSummary.findMany({ where: { month: monthNumber }, orderBy: { totalScore: 'desc' }, take: 20, select: { totalScore, weatherIcon, apparentTemperatureMax, rainSum, sunshineDuration, city: { select: { slug, name, country, costForNomadInUsd, internetSpeedCity, safety, ... } } } })`
- Return `{ month, cities: [...] }`

### Frontend Components/Pages
**New file**: `apps/nomad/src/pages/best-cities/[month].vue`
- Follow `apps/nomad/src/pages/regions/[region].vue` structure exactly
- Month navigation tabs (Jan–Dec) at top for switching
- City grid using existing `CityCard.vue` with month-specific weather data shown
- `defineI18nRoute({ paths: { en: '/best-cities/[month]', pl: '/najlepsze-miasta/[month]' } })`
- `useHead()` with title, description, canonical, hreflang, ItemList JSON-LD, FAQPage JSON-LD, BreadcrumbList JSON-LD

**New file**: `apps/nomad/src/server/api/__sitemap__/best-cities-months.ts`
- Return 12 paths per locale (24 total: EN + PL)

**Modify**: `apps/nomad/nuxt.config.ts`
- Register new sitemap source

**New constants**: Add `MONTH_SLUG_MAP` and `MONTH_SLUGS` to `apps/nomad/src/shared/global.utils.ts`

**New composable**: `apps/nomad/src/composables/useBestCitiesForMonth.ts`
- Wraps `useCustomQuery` for the new endpoint

### i18n Changes
Add to `en.json` and all locale files:
```json
"bestCitiesMonth": {
  "title": "Best Digital Nomad Cities in {month} | Weather, Cost & Rankings",
  "description": "Top 20 digital nomad cities for {month} ranked by weather, cost, and quality of life.",
  "heading": "Best Cities in {month}",
  "faqQuestion": "What is the best digital nomad city in {month}?",
  "faqAnswer": "{city} ranks #1 in {month} with a score of {score}/100, average temperature of {temp}°C, and a monthly cost of ${cost}."
}
```
Also add month names under `"months"` key (may already exist for `MonthsPicker`).

## Dependencies
- IDEA-01: The "best months" concept is complementary — city pages link back to month pages and vice versa.
- IDEA-03/IDEA-09: If a `/best-cities/` index page is needed, IDEA-09 covers the top-50 rankings page at that route.

## Notes
- The `/regions/[region].vue` pattern is the exact template — copy it, adapt for months.
- Month slugs in URLs should always be English regardless of locale (only the `/najlepsze-miasta/` prefix changes in PL).
- Crawl budget is not a concern for 24 pages (12 months × 2 locales).
- Internal linking: city pages should link to their best month pages once IDEA-01 "Best months" labels are added.
