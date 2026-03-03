# IDEA-08: Comparison SEO Enhancement
**Status:** PARTIAL
**Priority:** 8/39
**Complexity:** M (remaining gaps are medium)

## What's Already Implemented
Far more than the original plan assumed. Current state of `apps/nomad/src/pages/compare/[slugs].vue`:

- `useHead()` with full reactive SEO: `og:title`, `og:description`, `og:url`, `og:type: 'article'`, canonical, hreflang for all 11 locales ✅
- `noindex, nofollow` guard when data is missing ✅
- BreadcrumbList JSON-LD ✅
- Article JSON-LD ✅
- **FAQPage JSON-LD** with 4 generated questions (cost, internet, safety, best month) ✅
- `costDiffLabel` badge: "{City} X% cheaper" shown in the dark header ✅
- `speedDiffLabel` badge: "{City} +N Mbps" shown in the dark header ✅
- `useComparisonContent()` composable: intro paragraph, cost/internet/safety/healthcare/weather/verdict narratives ✅
- "Who Should Choose" section for each city (profile bullets) ✅
- "Overall Verdict" section (winner declared with data) ✅
- Popular comparisons on compare index page ✅
- **Full sitemap**: ALL city pair combinations chunked across 50 API calls via `apps/nomad/src/server/api/__sitemap__/comparisons.ts` ✅
- Compare index: full `useHead()` with BreadcrumbList, og:title, canonical, hreflang ✅

## Revised Analysis
The original plan's major items are already done. Remaining gaps:

1. **`og:image` missing on compare pages** — the `meta` array in `useHead()` has no `og:image`. City A's Unsplash image URL is already fetched and available. One line to add.

2. **Two `Place` JSON-LD entities** — the existing JSON-LD uses `Article` type. Adding `Place` schema for each city is additive and signals geographic relevance to Google.

3. **Related comparisons section** — "You might also compare: Bangkok vs HCMC, Bangkok vs KL..." is the most valuable missing piece for internal linking and user retention. The compare index already generates popular pairs — a similar derivation for same-region or similar-cost cities works here.

4. **City pages linking to relevant comparisons** — city page currently has a generic "Compare" CTA. Should link to 2-3 specific popular comparisons involving that city. Requires a lightweight "related comparisons" API call.

5. **`percentageDifferences` API extension** — NOT needed. The frontend already computes all diffs via `costDiffLabel` and `speedDiffLabel` computed props. Moving to API adds latency with no benefit. Leave on the frontend.

## Implementation Plan

### Database Changes
None.

### API Endpoints
**New file**: `apps/nomad/src/server/api/compare/related/[slug].get.ts`
- Given a single city slug, returns 4–6 related comparison pairs
- Query: fetch cities where `region = city.region`, ordered by `costForNomadInUsd` proximity, limit 6, exclude queried city
- Returns `{ slugs: string, cityAName: string, cityBName: string }[]`
- Uses `buildCompareSlug()` from `~/shared/global.utils`
- Prisma `select` only: `slug`, `name`, `country`, `region`, `costForNomadInUsd`

### Frontend Components/Pages
**Modify**: `apps/nomad/src/pages/compare/[slugs].vue`

1. Add `og:image` to `useHead()` meta array:
   ```ts
   { property: 'og:image', content: data.value.cityA.featuredImageUrl ?? '' }
   ```

2. Add two `Place` JSON-LD entities to the `jsonLd` array:
   ```ts
   { '@context': 'https://schema.org', '@type': 'Place', 'name': cityAName, 'description': `...`, 'url': `${BASE_URL}/cities/${cityA.slug}` }
   // same for cityB
   ```

3. Add related comparisons section below the "Data Attribution" paragraph — 4–6 `NuxtLink` cards using same style as compare index popular pairs grid.

**New composable**: `apps/nomad/src/composables/useCompareRelated.ts`
- Wraps `useCustomQuery` for `/api/compare/related/${slug}`
- Takes `Ref<string>` for city slug

**Modify**: `apps/nomad/src/pages/cities/[slug].vue`
- In the Compare CTA section, replace generic `/compare` link with 2–3 specific comparison links
- Use `useCompareRelated` composable with the city's slug

### i18n Changes
Add to `en.json` and all locale files under `"compare"`:
```json
"relatedComparisons": "Related Comparisons",
"relatedComparisonsCta": "See all comparisons"
```

## Dependencies
- IDEA-05: Adding city-page compare links requires the city page to have `useHead()` (for proper SEO of those pages). Can be shipped independently on the compare page side.

## Notes
- The sitemap already covers ALL city pair combinations — the original plan's "pre-generate top 190" is already exceeded.
- `percentageDifferences` API extension is unnecessary — already computed on frontend.
- `Place` JSON-LD has limited rich result support but signals geographic relevance. Add it, don't rely on it.
- Related comparisons should use **region matching** as primary signal, not alphabetical — "Bangkok vs Bali" is more natural than "Bangkok vs Barcelona".
- The `og:image` gap is a one-liner fix and a quick win — social shares of compare pages currently have no image preview.
