# IDEA-37: Trending Cities List
**Status:** NOT_STARTED
**Priority:** 37/39
**Complexity:** M

## What's Already Implemented
- `Favorite.createdAt` exists — enables favorites velocity computation
- `CheckIn` model does NOT exist yet (IDEA-11)

## Revised Analysis
**Can be built without IDEA-11 (check-ins).** Favorite velocity alone is a meaningful momentum signal. `Favorite.createdAt` is already in the DB — count new favorites per city in the last 30 days vs. the prior 30 days to get a velocity/growth rate.

**Trending formula (V1 — favorites-only):**
```
growth_rate = (favorites_last_30_days / favorites_prior_30_days) - 1
```
Cities with 0 prior favorites but 1+ recent favorites get a special "emerging" tag.

**Trending formula (V2 — after IDEA-11):** Weight in check-in velocity for a richer signal.

**Update frequency:** The trending page should recompute weekly (not on every page visit). Use ISR caching: `{ isr: 604800 }` (revalidate weekly).

**Minimum threshold:** A city needs ≥ 5 recent favorites to appear as trending (prevents tiny/obscure cities from dominating the list due to a single user's favorites streak).

**"Trending" vs "most favorited":** These are different. Sort by `growth_rate` (momentum), not by absolute favorite count. Cities with 500 favorites adding 50 more are trending; cities with 5000 favorites adding 50 more are not.

**Methodology page:** Link to IDEA-24's methodology page to explain the trending algorithm. Transparency is important here — "trending" is a loaded word.

## Implementation Plan

### Database Changes
None.

### API Endpoints
**New file**: `apps/nomad/src/server/api/rankings/trending.get.ts`
- Compute recent (last 30 days) and prior (31–60 days) favorite counts per city:
  ```ts
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  // Use prisma.$queryRaw or groupBy with where clause for date ranges
  ```
- Filter to cities with ≥ 5 recent favorites
- Sort by growth_rate desc, take 20
- Hydrate with city data (name, country, image, costForNomadInUsd) via second `findMany` query
- Apply ISR: `{ isr: 604800 }` in `nuxt.config.ts` routeRules

### Frontend Components/Pages
**New file**: `apps/nomad/src/pages/trending.vue`
- `defineI18nRoute({ paths: { en: '/trending', pl: '/trendy' } })`
- Ranked list of 20 trending cities
- Each card shows: rank, city name, country, image, `+X% more saves this month` growth indicator
- Full SEO: `useHead` targeting "fastest growing digital nomad cities", "trending nomad cities 2026"
- Link to methodology page explaining the ranking
- "Updated weekly" note

**New file**: `apps/nomad/src/composables/useTrending.ts`
- Wraps `useCustomQuery` for trending endpoint

### i18n Changes
Add to all locale files:
```json
"trending": {
  "title": "Trending Digital Nomad Cities",
  "subtitle": "Fastest growing cities by nomad interest this month",
  "heading": "Trending Now",
  "growthRate": "+{pct}% more saves",
  "emerging": "Emerging",
  "updatedWeekly": "Updated weekly",
  "methodology": "How is trending calculated?"
}
```

## Dependencies
- IDEA-11 (Check-ins): V2 trending signal. Not required for V1.
- IDEA-24 (Data Freshness / Methodology): cross-link to methodology page.

## Notes
- The `$queryRaw` approach or two separate `groupBy` queries (one for each 30-day window) are both valid. Test performance on the DB — 500 cities × favorites = small dataset, should be fast.
- Growth rate of 0 previous / 1+ recent = "emerging" tag (special handling, not infinite % growth).
- ISR weekly caching means the trending page is computationally cheap to serve. Compute once, cache for 7 days.
- "Trending" is an overloaded marketing term — be precise. "Cities with the most growth in nomad saves this month" is accurate. Use shorter "Trending" in UI but explain precisely in the methodology.
- Add trending page to sitemap (single static URL).
