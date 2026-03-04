# IDEA-17: Internet Speed Rankings Page
**Status:** NOT_STARTED
**Priority:** 17/39
**Complexity:** S

## What's Already Implemented
- `City.internetSpeedCity` (Int, Mbps) and `City.internetSpeedCityRanking` (Int) both exist in schema
- Both are returned by `GET /api/cities/[slug]` but NOT by the list endpoint
- No `/fastest-internet/` pages exist

## Revised Analysis
This is among the lowest-effort ideas in the backlog — pure read from existing data, no computation needed, simple table UI.

**Pagination concern:** 500+ cities in a table needs pagination or virtual scrolling for performance. Show top 100 with "load more" or `?page=` pagination — do not return all 500 in one response.

**Ranking display:** `internetSpeedCityRanking` is a pre-computed global rank (lower number = faster). On per-region pages, still show the global rank column — useful context ("this city ranks #12 globally, #3 in Europe").

**Region filter tabs:** Implement as `<NuxtLink>` to sub-pages, not client-side filter state, so each region variant is a crawlable URL.

**Ordering:** `orderBy: { internetSpeedCityRanking: 'asc' }` (lower rank = faster). Same result as `internetSpeedCity desc` if data is consistent.

## Implementation Plan

### Database Changes
None.

### API Endpoints
**New file**: `apps/nomad/src/server/api/rankings/fastest-internet/index.get.ts`
- `prisma.city.findMany({ orderBy: { internetSpeedCityRanking: 'asc' }, take: 100, select: { slug, name, country, region, internetSpeedCity, internetSpeedCityRanking, image: { select: { url } } } })`
- Support optional `?page=` for pagination

**New file**: `apps/nomad/src/server/api/rankings/fastest-internet/[region].get.ts`
- Validates `region` param against `REGION_SLUG_MAP`
- Filters `where: { region: regionEnum }`, same select/order

### Frontend Components/Pages
**New file**: `apps/nomad/src/pages/fastest-internet/index.vue`
- Ranked table: global rank, city + country flag, region, speed (Mbps), speed visualization (progress bar)
- Region tabs at top linking to `/fastest-internet/[region]`
- Full SEO: title "Cities with Fastest Internet for Remote Work | 2026 Rankings"
- `useHead` with FAQ JSON-LD: "Which city has the fastest internet for digital nomads?"

**New file**: `apps/nomad/src/pages/fastest-internet/[region].vue`
- Same structure, region-filtered
- `defineI18nRoute` with EN/PL paths

**New file**: `apps/nomad/src/composables/useFastestInternet.ts`

**New file**: `apps/nomad/src/server/api/__sitemap__/fastest-internet.ts`
- 7 region pages + 1 global = 8 paths per locale

### i18n Changes
Add to all locale files:
```json
"fastestInternet": {
  "title": "Cities with Fastest Internet for Remote Work | {year} Rankings",
  "description": "Internet speed rankings for 500+ cities. Find the best city for remote work by connection speed.",
  "heading": "Fastest Internet for Remote Workers",
  "rank": "Rank",
  "speed": "Speed",
  "globalRank": "Global Rank",
  "mbps": "{speed} Mbps",
  "faqQuestion": "Which city has the fastest internet for digital nomads?",
  "faqAnswer": "{city} has the fastest average internet speed at {speed} Mbps, ranking #1 globally for remote workers."
}
```

## Dependencies
None. Fully standalone.

## Notes
- Add `internetSpeedCity` and `internetSpeedCityRanking` to the cities list endpoint select if they're not already included — city cards may want to show speed.
- Speed visualization: normalize against the maximum speed in the dataset (not a fixed 1000 Mbps scale) so bars are meaningful.
- Consider adding a "Copy shareable link" for each city's row.
