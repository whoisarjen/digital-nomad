# IDEA-06: Cost / Runway Calculator
**Status:** NOT_STARTED
**Priority:** 06/23
**Complexity:** M

## What's Already Implemented
- All four cost tiers exist on `City` model and are fetched by the city slug API
- `costForNomadInUsd` is returned by the cities list endpoint; `costForExpatInUsd` and `costForLocalInUsd` are NOT returned by the list endpoint (only by `/cities/[slug]`)
- No calculator pages exist

## Revised Analysis
**City page widget** shares implementation with [removed] Part A — same `AffordabilityWidget.vue` component, two input modes: monthly income (surplus/deficit) and total savings (runway).

**Standalone ranked page** needs all cities with all cost tiers. The existing `/api/cities` list is paginated and caps at 100 items — cannot be reused. A new lean endpoint returning all cities with cost fields only is the right approach, cached aggressively via ISR.

**Formula:**
```
runway = savings / monthlyCost                              (no income)
runway = savings / (monthlyCost - monthlyIncome)            (with income)
if monthlyIncome >= monthlyCost: show "Indefinitely"
```

**Shareable URL:** Store `savings`, `income`, `tier` as query params: `/tools/runway-calculator?savings=50000&income=3000&tier=nomad`. Follows existing route.query pattern.

**Display:** Show top 50 by runway, "load more" for the rest. Sorting is client-side since all data is loaded.

## Implementation Plan

### Database Changes
None.

### API Endpoints
**New file**: `apps/nomad/src/server/api/tools/runway.get.ts`
- No query params, returns all cities with only cost fields
- `prisma.city.findMany({ select: { slug, name, country, costForNomadInUsd, costForExpatInUsd, costForLocalInUsd, costForFamilyInUsd, image: { select: { url } } } })`
- No pagination — ~500 cities × 5 fields = small payload (~50KB)
- Add Nitro ISR rule: `'/api/tools/runway': { isr: 3600 }` in `nuxt.config.ts`

### Frontend Components/Pages
**New file**: `apps/nomad/src/pages/tools/runway-calculator.vue`
- `defineI18nRoute({ paths: { en: '/tools/runway-calculator' } })`
- Inputs: `savings` (number input) + `income` (optional), tier toggle (nomad/expat/local/family)
- Inputs sync to URL query params via `router.push({ query })`
- Uses `useRunwayData()` composable (wraps new endpoint)
- Ranked city list: sorted client-side by runway months desc, top 50 shown, "show more" button
- Dynamic `useHead`: title/description reflects savings amount for shareability

**New file**: `apps/nomad/src/composables/useRunwayData.ts`
- Wraps `useCustomQuery` for `/api/tools/runway`
- No reactive deps, cached for session duration

**Modify**: `apps/nomad/src/components/AffordabilityWidget.vue` (shared with [removed])
- Add "total savings" input mode alongside "monthly income" mode
- Shows runway months for each tier when savings entered

**Add link** in footer or nav to `/tools/runway-calculator`

### i18n Changes
Add to all locale files:
```json
"runway": {
  "title": "Cost & Runway Calculator | How Long Can You Live Abroad?",
  "subtitle": "See how many months your savings will last in 500+ cities",
  "savings": "Total savings",
  "monthlyIncome": "Monthly income (optional)",
  "tierLabel": "Lifestyle",
  "resultsTitle": "Cities ranked by runway",
  "months": "{months} months",
  "indefinite": "Indefinitely",
  "showMore": "Show more cities",
  "shareTitle": "${savings} savings — Runway in {count}+ cities"
}
```

## Dependencies
- [removed]: Shares `AffordabilityWidget.vue` — build together.
- IDEA-05: Shares `/tools/` page directory — build together.

## Notes
- `Decimal` cost fields: use `Number(cost)` before arithmetic.
- For `monthlyIncome >= monthlyCost`: show "Indefinitely" — never display negative numbers.
- The standalone page is fully public and indexable (no auth gate).
- Sitemap: static entry via `nuxt.config.ts` alongside IDEA-05.
- Round runway months to 1 decimal: `(savings / cost).toFixed(1)`.
