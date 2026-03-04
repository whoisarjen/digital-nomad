# IDEA-29: City x Month Deep Pages
**Status:** NOT_STARTED
**Priority:** 29/39
**Complexity:** M

## What's Already Implemented
Nothing. No `/cities/[slug]/[month]` nested route structure.

## Revised Analysis
**Crawl budget is the primary concern.** 500 cities × 12 months = 6,000 potential pages. Start with top 100 cities only (1,200 pages) and only index where month-to-month variance is high (seasonal cities). Use `noindex` liberally on low-value pages.

**Nuxt nested routes:** The existing `/cities/[slug].vue` is a single file. Adding a sub-route `/cities/[slug]/[month]` requires converting to a directory: `pages/cities/[slug]/index.vue` and `pages/cities/[slug]/[month].vue`. This is the most significant structural change — it moves the existing city detail page.

**Data source:** `MonthSummary` already has everything needed per city/month. No new data collection.

**Content strategy:** Each page should have unique content beyond just the MonthSummary data. Add templated text like "Bangkok in January: expect an average temperature of 28°C, minimal rainfall (12mm), and 8.5 hours of sunshine daily. This is one of Bangkok's peak tourist months with low humidity making it ideal for exploring." — generated from MonthSummary fields, not hardcoded.

**Internal linking:** City month pages link to: the main city page, the "best cities for [month]" ranking (IDEA-10), and other months for the same city (month navigation strip).

**API endpoint:** Dedicated `GET /api/cities/[slug]/month/[month].get.ts` following the existing `[slug].get.ts` pattern.

## Implementation Plan

### Database Changes
None.

### API Endpoints
**New file**: `apps/nomad/src/server/api/cities/[slug]/month/[month].get.ts`
- Validates `slug` and `month` (1–12 integer or month name string)
- Queries:
  - City base data (same select as main city endpoint)
  - MonthSummary for that specific month: `prisma.monthSummary.findFirst({ where: { citySlug: slug, month: monthNumber }, select: { ... } })`
- Returns 404 if city or month data not found
- Follow `getLocale()` + `getLocalizedSelect()` pattern for localized city name

### Frontend Components/Pages
**Restructure**: Rename `apps/nomad/src/pages/cities/[slug].vue` → `apps/nomad/src/pages/cities/[slug]/index.vue`
- Same content, just moved to support the new nested route structure

**New file**: `apps/nomad/src/pages/cities/[slug]/[month].vue`
- Validates `month` param (convert to number 1–12)
- Month navigation tabs (Jan–Dec) at top for switching between months
- Main content: month-specific weather data prominently displayed
- City base data (cost, internet, safety) below — this doesn't change by month
- Templated prose: "In [month], [city] has an average temperature of [X]°C..."
- `useHead` with month-specific title, description, and JSON-LD
- `noindex` for cities not in the top 100 (check against a `TOP_CITY_SLUGS` constant)
- Hreflang alternates for EN/PL

**New file**: `apps/nomad/src/composables/useCityMonth.ts`
- Wraps `useCustomQuery` for the new endpoint

**New constant**: `TOP_CITY_SLUGS` set in `apps/nomad/src/shared/global.utils.ts`
- Top 100 city slugs by average MonthSummary totalScore — generate this list from a DB query once and hardcode

**New file**: `apps/nomad/src/server/api/__sitemap__/cities-months.ts`
- Returns paths for top 100 cities × 12 months × 2 locales = 2,400 entries

**Modify** `apps/nomad/nuxt.config.ts`
- Register new sitemap source

### i18n Changes
Add to all locale files:
```json
"cityMonth": {
  "title": "{city} in {month}: Weather, Cost & Nomad Guide",
  "description": "{city} in {month}: {temp}°C average, {rain}mm rainfall. Complete digital nomad guide.",
  "monthNav": "Other months",
  "weatherHeading": "Weather in {city} in {month}",
  "nomadScore": "Nomad score for {month}: {score}/100",
  "bestMonthLabel": "One of the best months",
  "avoidLabel": "Consider avoiding"
}
```

## Dependencies
- IDEA-01 (Month strip): month pages link back to city page month strip
- IDEA-10 (Best cities by month): cross-linking between these pages

## Notes
- **Renaming the city page to `[slug]/index.vue` is a structural change** — test that existing routes (`/cities/bangkok`) still resolve correctly after the move.
- The `TOP_CITY_SLUGS` list should be statically defined (not a DB query at runtime) for the `noindex` check.
- Crawl budget: only submit the top 100 cities × 12 months in the sitemap. The other 400 cities' month pages exist but have `noindex`.
- Start with only EN and PL locales in the sitemap (same as other dynamic pages).
