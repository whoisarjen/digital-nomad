# IDEA-16: Cheapest Cities by Region Pages
**Status:** NOT_STARTED
**Priority:** 16/39
**Complexity:** S

## What's Already Implemented
Nothing. The existing cities index endpoint supports cost-ascending ordering but is paginated and filtered through MonthSummary — not suitable for SEO pages (paginated/filtered URLs get `noindex`). Dedicated pages needed.

## Revised Analysis
Dedicated pages are required for SEO — cannot reuse the main index with preset params (those get `noindex` when params present, per existing pattern).

**Relative cost indicator** ("43% cheaper than European average") is the key differentiator. Requires computing region average cost at query time — the existing region endpoint already computes `costMin`/`costMax`; add `avgCost` is one line.

**Global `/cheapest-cities` page** (worldwide) + 7 regional pages. Use the same endpoint with/without region filter.

**Route:** `/cheapest-cities` and `/cheapest-cities/[region]` — clean, intent-matching URLs.

**Cost data source:** `City.costForNomadInUsd` directly — not `MonthSummary`. Cost doesn't vary by month in the current data model. Avoids month-dependency for a cost ranking page.

**Null values:** `costForNomadInUsd` is non-nullable on `City` model — no null sorting issue.

## Implementation Plan

### Database Changes
None.

### API Endpoints
**New file**: `apps/nomad/src/server/api/rankings/cheapest-cities/index.get.ts`
- Returns top 50 cheapest cities globally, `orderBy: { costForNomadInUsd: 'asc' }`
- Includes `globalAvgCost` in response for relative indicator
- `select` only: slug, name, country, region, costForNomadInUsd, internetSpeedCity, safety, image

**New file**: `apps/nomad/src/server/api/rankings/cheapest-cities/[region].get.ts`
- Validates `region` param against `REGION_SLUG_MAP`
- Returns cities for that region sorted by `costForNomadInUsd asc`
- Includes `regionAvgCost` for relative indicator calculation

### Frontend Components/Pages
**New file**: `apps/nomad/src/pages/cheapest-cities/index.vue`
- Global cheapest page, full SEO

**New file**: `apps/nomad/src/pages/cheapest-cities/[region].vue`
- Per-region cheapest page
- Relative indicator computed client-side: `((cityCost - regionAvgCost) / regionAvgCost * 100).toFixed(0)` → "X% cheaper than regional average"
- `defineI18nRoute` with EN/PL paths

**New file**: `apps/nomad/src/composables/useCheapestCities.ts`

**New file**: `apps/nomad/src/server/api/__sitemap__/cheapest-cities.ts`
- 7 region slugs + 1 global = 8 paths per locale

### i18n Changes
Add to all locale files:
```json
"cheapestCities": {
  "title": "Cheapest Digital Nomad Cities in {region} | 2026 Cost Rankings",
  "globalTitle": "Cheapest Digital Nomad Cities Worldwide | 2026 Rankings",
  "description": "Cities sorted by monthly cost for digital nomads. Live data.",
  "cheaperThanAverage": "{pct}% cheaper than {region} average",
  "moreExpensiveThanAverage": "{pct}% more expensive than {region} average"
}
```

## Dependencies
- IDEA-03: Region pages already exist under `/regions/`. Cheapest cities is a separate SEO intent at `/cheapest-cities/`. No conflict.

## Notes
- English URL slugs universally (no `/najtansze-miasta/` in PL) — simpler and defensible.
- Region names for display come from existing `regions` i18n keys.
- Add Nitro ISR route rule for these endpoints — cost data is updated infrequently.
