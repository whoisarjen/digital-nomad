# Best Cities Rankings — Design Doc

**Date:** 2026-03-07
**Feature:** IDEA-09 (revised — per-month rankings)

## Problem

`MonthSummary.totalScore` exists and is shown inline on city cards, but there is no dedicated rankings surface. Users cannot discover which cities are objectively best for a given month, and we are not capturing SEO traffic for "best digital nomad cities [month] [year]" queries.

## Solution

Hub + per-month detail architecture: one index page listing all 12 months, and one dedicated ranked page per month. 13 total indexed pages.

## URL Structure

```
/best-cities                 → hub: 12 month cards
/best-cities/january         → January top 50
/best-cities/february        → February top 50
... (all 12 months)
```

Month slug always uses English name (january–december) across all locales. Base path is localized:
- EN: `/best-cities`
- PL: `/najlepsze-miasta`

## Data

### MonthSummary schema facts
- `month`: `String @db.VarChar(2)` — stored as "01"–"12"
- `totalScore`: `Int @db.SmallInt` — integer; OPTIONS_RANKS thresholds are 2/3/4 (stars)
- `@@unique([citySlug, month])` — one row per city per month

### Month slug → DB value map
```ts
const MONTH_SLUG_MAP = {
  january: '01', february: '02', march: '03', april: '04',
  may: '05', june: '06', july: '07', august: '08',
  september: '09', october: '10', november: '11', december: '12',
}
```

### New API endpoint
`GET /api/rankings/best-cities`
- For the hub page only
- Query: `prisma.monthSummary.findMany` with `distinct: ['month']`, ordered by `[{ month: 'asc' }, { totalScore: 'desc' }]`
- Select: `month`, `totalScore`, `citySlug`, `city: { name, country, image }`
- Returns 12 rows — one #1 city per month

### Reused API endpoint
Month detail pages use the existing `GET /api/cities?orderBy=totalScore&sort=desc&months=01&limit=50`.
No new endpoint needed for the detail page.

## Components

### NomadScoreBadge.vue
- Props: `score: number`
- Color coding: `score >= 4` → green, `score === 3` → yellow, `score <= 2` → red
- V1: colored pill (`4 ★`)
- Used on: month detail page rows

## Pages

### pages/best-cities/index.vue
- Grid of 12 month cards
- Each card: month name, #1 city `<CustomNuxtImg>` (width/height required), city name, score badge
- Links to `/best-cities/[month]`
- SEO: title "Best Cities for Digital Nomads 2026", description, ogType website
- JSON-LD: ItemList (12 month entries) + BreadcrumbList
- `defineI18nRoute` with localized base paths for all 11 languages

### pages/best-cities/[month].vue
- Validates `month` param against `MONTH_SLUG_MAP` — throws 404 if invalid
- Fetches via existing `useCities` composable with month + totalScore sort
- Ranked table: rank #, city name + country, NomadScoreBadge, cost ($X/mo), internet (Mbps), safety
- SEO: title "Best Digital Nomad Cities in January 2026", description per month
- JSON-LD: ItemList (top cities with url/name/position) + BreadcrumbList

## Composables

### useBestCities.ts
- Wraps `useCustomQuery` for `GET /api/rankings/best-cities`
- Used by hub page only

## Sitemap

### server/api/__sitemap__/best-cities.ts
- 13 entries: `/best-cities` + `/best-cities/january` through `/best-cities/december`

## i18n

Add `bestCities` key to all locale files:
```json
{
  "bestCities": {
    "title": "Best Cities for Digital Nomads {year}",
    "monthTitle": "Best Digital Nomad Cities in {month} {year}",
    "hub": "Browse by Month",
    "rank": "Rank",
    "nomadScore": "Nomad Score"
  }
}
```

## Files Changed

### New
- `apps/nomad/src/server/api/rankings/best-cities.get.ts`
- `apps/nomad/src/server/api/rankings/__tests__/best-cities.get.test.ts`
- `apps/nomad/src/composables/useBestCities.ts`
- `apps/nomad/src/components/NomadScoreBadge.vue`
- `apps/nomad/src/components/__tests__/NomadScoreBadge.test.ts`
- `apps/nomad/src/pages/best-cities/index.vue`
- `apps/nomad/src/pages/best-cities/[month].vue`
- `apps/nomad/src/server/api/__sitemap__/best-cities.ts`
- `apps/nomad/src/server/api/__sitemap__/__tests__/best-cities.test.ts`

### Modified
- `apps/nomad/src/i18n/locales/en.json` (add bestCities keys)
- `apps/nomad/src/i18n/locales/pl.json` (add bestCities keys)
- (other locale files with fallback strings)

## Not In Scope
- CityCard score badge replacement (no CityCard.vue exists)
- Score tooltip sub-score breakdown (V2)
- IDEA-03 `/best-cities/[region].vue` and IDEA-10 `/best-cities/[month].vue` deep pages
