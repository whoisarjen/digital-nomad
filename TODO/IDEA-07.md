# IDEA-07: Geoarbitrage Calculator
**Status:** NOT_STARTED
**Priority:** 7/39
**Complexity:** M

## What's Already Implemented
- `City.costForNomadInUsd`, `costForExpatInUsd`, `costForLocalInUsd`, `costForFamilyInUsd` all exist and are rendered in `apps/nomad/src/pages/cities/[slug].vue` (Cost of Living section)
- `PricesPicker.vue` exists in `FiltersDrawer.vue` with min/max range filter — covers "filter by affordability" semantically, but has no single-ceiling "My budget" input and no delta on city cards
- No calculator components exist anywhere

## Revised Analysis
**Part A (City Widget)** and IDEA-22's city widget are the same component — build as one `AffordabilityWidget.vue` with two input modes: monthly income (surplus/deficit) and total savings (runway months).

**Part B (Explore Filter):** The existing `PricesPicker` operates server-side (writes URL params). The "My budget" filter should use `localStorage` via a `useBudget.ts` composable — not a URL param — to avoid SEO pollution and conflicts with the existing price range filter. The city list already has `costForNomadInUsd` per card; delta computation is client-side against already-fetched data.

**Slider range:** $300–$15,000 (not $500–$10,000 as in spec — expat costs in some cities exceed $5,000).

**localStorage budget** won't increment the URL-based filter count badge — that's acceptable. The budget is a personal overlay, not a server filter.

## Implementation Plan

### Database Changes
None.

### API Endpoints
None. All data is in existing city responses.

### Frontend Components/Pages
**New file**: `apps/nomad/src/components/AffordabilityWidget.vue`
- Props: `costNomad`, `costExpat`, `costLocal`, `costFamily`
- Mode toggle: "Monthly income" (surplus/deficit) vs "Total savings" (runway months)
- Lifestyle tier tabs (nomad/expat/local/family)
- Color coding: green (surplus), yellow (tight, < -$200), red (over budget)
- Placement in `cities/[slug].vue`: after Cost of Living section

**New file**: `apps/nomad/src/composables/useBudget.ts`
- `budget: Ref<number | null>` persisted to `localStorage`
- SSR-safe: only accesses localStorage on client
- Exports: `setBudget(v: number | null)`, `budget`

**New file**: `apps/nomad/src/components/BudgetFilter.vue`
- Single numeric input or slider for monthly nomad budget
- Calls `useBudget().setBudget(value)` on change
- Clear/reset button when budget is set
- Add inside `FiltersDrawer.vue` before `PricesPicker`

**Modify**: `apps/nomad/src/pages/index.vue`
- Import `useBudget`
- When `budget` is set: show delta badge on each city card
  - "Save ${amount}/mo" (green) or "${amount} over budget" (red/amber)

### i18n Changes
Add to all locale files:
```json
"affordability": {
  "widgetTitle": "Can I afford this?",
  "monthlyIncome": "Monthly income",
  "surplus": "Surplus",
  "deficit": "Deficit",
  "runwayMonths": "{months} months of runway",
  "lifestyle": "Lifestyle",
  "affordable": "Comfortable",
  "tight": "Tight",
  "overBudget": "Over budget",
  "totalSavings": "Total savings"
},
"budget": {
  "filterLabel": "My monthly budget",
  "savesPerMonth": "Save ${amount}/mo",
  "overBudget": "${amount} over budget",
  "clearBudget": "Clear budget"
}
```

## Dependencies
- IDEA-22: The city-page widget is identical — build one `AffordabilityWidget.vue` for both.

## Notes
- `costForNomadInUsd` is `Decimal` in Prisma; serialize with `Number()` defensively in the widget.
- The existing `PricesPicker` server-side filter and `BudgetFilter` client-side overlay coexist without conflict — they serve different UX intents.
- Runway sub-feature should show only when savings amount is entered, not by default.
