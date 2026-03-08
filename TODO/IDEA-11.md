# IDEA-11: Data Freshness Transparency
**Status:** NOT_STARTED
**Priority:** 11/23
**Complexity:** S

## What's Already Implemented
- `City.updatedAt` exists (Prisma `@updatedAt`)
- Cron jobs in `apps/collector/` update city data periodically
- No data source labels or freshness indicators on city pages

## Revised Analysis
Simple, high E-E-A-T impact feature. The `City.updatedAt` timestamp already serves as the freshness signal — no new DB fields needed.

**Per-metric timestamps are overkill for V1.** Use `City.updatedAt` as a single freshness signal for the whole city record. Different data sources (Open-Meteo, Numbeo, Speedtest) update at different times, but the city `updatedAt` reflects the most recent update of any field.

**Methodology page** is the highest-value SEO component of this idea — "how are digital nomad cities ranked" is a genuine search query. It establishes E-E-A-T authority and differentiates from competitors with opaque data.

**Freshness indicator logic:**
- Green: updated within 30 days
- Yellow: 31–90 days
- Red: 91+ days (data may be stale)

**Data source attribution per section** (not per field) is the right granularity for V1:
- Weather section: "Open-Meteo"
- Cost section: "Numbeo"
- Internet section: "Speedtest Global Index"
- Air quality section: "IQAir"
- Last updated: `city.updatedAt` formatted as "3 days ago" or "March 2026"

## Implementation Plan

### Database Changes
None. Use existing `City.updatedAt`.

### API Endpoints
**Modify** `apps/nomad/src/server/api/cities/[slug].get.ts`
- Add `updatedAt: true` to the city select

### Frontend Components/Pages
**New file**: `apps/nomad/src/components/DataFreshnessBadge.vue`
- Props: `updatedAt: string`
- Computes days since update
- Renders colored dot (green/yellow/red) + "Updated X days ago" or "Updated March 2026"

**New file**: `apps/nomad/src/components/DataSourceLabel.vue`
- Props: `source: string` (e.g., "Open-Meteo")
- Small "Source: Open-Meteo" label rendered under each data section

**Modify** `apps/nomad/src/pages/cities/[slug].vue`
- Add `<DataFreshnessBadge :updated-at="data.updatedAt" />` to city page header
- Add `<DataSourceLabel source="..." />` under each major data section (Weather, Cost, Internet, Air Quality)

**New file**: `apps/nomad/src/pages/methodology.vue`
- `defineI18nRoute({ paths: { en: '/methodology', pl: '/metodologia' } })`
- Full SEO: `useHead` targeting "how are digital nomad cities ranked", "nomad city data sources"
- Explains: all data sources, update frequency, scoring formula for `totalScore`, how MonthSummary is built
- Static content (no API call needed)
- BreadcrumbList JSON-LD

**Add link** to `/methodology` in site footer

### i18n Changes
Add to all locale files:
```json
"freshness": {
  "updatedDaysAgo": "Updated {days} days ago",
  "updatedToday": "Updated today",
  "updatedThisMonth": "Updated this month",
  "fresh": "Fresh data",
  "aging": "Data may be aging",
  "stale": "Data may be outdated",
  "source": "Source: {name}",
  "methodology": "Data Methodology"
}
```

## Dependencies
None.

## Notes
- `City.updatedAt` is a single timestamp for the whole row. Multiple data sources update at different times — this is a V1 simplification. Document in the methodology page.
- The methodology page is static content — consider writing it as a proper editorial piece, not just a technical spec page. It should read naturally for both users and Google.
- Add "Data sources" link in the city page footer area (near copyright/attribution for images).
- This feature directly addresses the trust gap vs NomadList (whose data is famously inaccurate).
