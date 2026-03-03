# IDEA-09: Prominent Nomad Score
**Status:** PARTIAL
**Priority:** 9/39
**Complexity:** M

## What's Already Implemented
- `MonthSummary.totalScore` exists in schema and is returned by city APIs
- City cards already show `totalScore` inline next to a star icon (small/secondary)
- No `/best-cities/` index page exists
- No `NomadScoreBadge` component with circular visual exists
- No annual composite score is pre-computed — must be derived from 12-month average at query time

## Revised Analysis
The score field exists but is not prominent. There is no stored "annual average" — it must be computed via Prisma `groupBy` with `_avg: { totalScore: true }` on `MonthSummary` at query time. No schema changes needed.

**Route namespace note:** `/best-cities/index.vue` is the IDEA-09 landing page; `/best-cities/[region].vue` (IDEA-03) and `/best-cities/[month].vue` (IDEA-10) share this directory. Build `best-cities/` as a directory from the start.

**Score scale:** Confirm the actual `totalScore` range before labeling "0–100". `OPTIONS_RANKS` uses values 2–4 (stars) — the scale may differ. Label accurately.

**Circular SVG badge:** Start with a styled pill badge with color coding; add the ring as a polish pass. Keep the component simple initially.

## Implementation Plan

### Database Changes
None.

### API Endpoints
**New file**: `apps/nomad/src/server/api/rankings/best-cities.get.ts`
- `prisma.monthSummary.groupBy({ by: ['citySlug'], _avg: { totalScore: true }, orderBy: { _avg: { totalScore: 'desc' } }, take: 50 })`
- Then hydrate city fields in a second `prisma.city.findMany({ where: { slug: { in: slugs } }, select: { slug, name, country, costForNomadInUsd, internetSpeedCity, safety, image: { select: { url } } } })`
- Merge and return ranked list with `nomadScore` field

### Frontend Components/Pages
**New file**: `apps/nomad/src/components/NomadScoreBadge.vue`
- Props: `score: number`, `size: 'sm' | 'md' | 'lg'`
- Color: green (≥70), yellow (40–69), red (<40)
- V1: pill badge; V2: circular SVG ring

**New file**: `apps/nomad/src/pages/best-cities/index.vue`
- Ranked table: rank number, city name, country, `NomadScoreBadge`, cost, internet speed
- Full SEO: `useHead` with title targeting "best cities for digital nomads 2026"
- ItemList + BreadcrumbList JSON-LD
- `defineI18nRoute({ paths: { en: '/best-cities', pl: '/najlepsze-miasta' } })`

**New file**: `apps/nomad/src/composables/useBestCities.ts`
- Wraps `useCustomQuery` for the new rankings endpoint

**New file**: `apps/nomad/src/server/api/__sitemap__/best-cities.ts`
- Single static entry (index page only)

**Modify**: `apps/nomad/src/components/CityCard.vue` and `apps/nomad/src/pages/cities/[slug].vue`
- Replace inline score display with `<NomadScoreBadge>`

### i18n Changes
Add to all locale files:
```json
"bestCities": {
  "title": "Best Digital Nomad Cities {year} | Ranked by Nomad Score",
  "description": "Top 50 cities ranked by composite nomad score covering cost, internet, safety, and climate.",
  "heading": "Best Digital Nomad Cities",
  "rank": "Rank",
  "nomadScore": "Nomad Score"
}
```

## Dependencies
- IDEA-03 and IDEA-10 share the `/best-cities/` directory — build directory structure first.

## Notes
- Rankings page fresh content signal: update monthly when `MonthSummary` data refreshes.
- Score tooltips (sub-score breakdown) are a V2 polish — skip for initial launch.
- Verify actual score range from the DB before coding color thresholds.
