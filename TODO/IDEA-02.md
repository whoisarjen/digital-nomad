# IDEA-02: English Proficiency Score

**Status:** NOT_STARTED
**Priority:** 02/23
**Complexity:** S

## What's Already Implemented

Nothing. The `City` model has no `englishProficiency` field. No filter, no badge, no seed data.

## Revised Analysis

The original plan is sound and genuinely low-effort. A few refinements based on the real codebase:

**Data granularity.** EF EPI is country-level data, not city-level. This matches the pattern already used for `internetSpeedCountry` (scraped once, applied to all cities in a country). The `countryCode` field on `City` is the right join key.

**Score vs. Level.** The original plan proposes storing a `Decimal` (0-100 EF score) and displaying it as a High/Medium/Low badge. The existing schema already uses the `Level` enum (`LOW | MIDDLE | HIGH`) for all qualitative dimensions (safety, pollution, healthCare, etc.). Storing a raw Decimal and then deriving the Level at display time adds complexity for no benefit — unless you plan to expose the raw numeric score. Recommendation: store both, or store just a `Level` field named `englishLevel` that fits the existing enum pattern. However, keeping the raw Decimal also enables future range filtering, so `Decimal?` is the better call.

**Filter pattern.** The existing `filters.get.ts` endpoint returns a `pickers` object consumed by `FiltersDrawer` via `SinglePicker`. The safety and pollution pickers already use `OPTIONS_LEVEL_GTE` / `OPTIONS_LEVEL_LTE`. Adding `englishProficiency` follows the exact same pattern — add it to the `pickers` response, add a zod field to `getCitiesSchema`, add a `where` clause in `index.get.ts`. The `SinglePicker` component renders it automatically.

**Seed approach.** EF EPI data is published annually as a PDF/webpage. The simplest approach is a one-time collector script at `apps/collector/server/api/_legacy_cron/english-proficiency.get.ts` that maps EF country scores to the `englishProficiency` field via `countryCode`. This mirrors the `internets.get.ts` pattern (scrape → `city.updateMany` by country).

**Score-to-Level mapping.** EF EPI bands: Very High 600+, High 550-599, Moderate 500-549, Low <500. Map to `LOW | MIDDLE | HIGH` for the filter, store raw Decimal for display.

**City page display.** The city detail page (`/cities/[slug].vue`) has a Quality of Life section currently showing only safety and healthcare. English proficiency fits naturally here. The API endpoint `cities/[slug].get.ts` needs `englishProficiency: true` added to its `select`.

**i18n.** The current filter label system in `SinglePicker` auto-capitalizes the `name` prop (e.g. `englishProficiency` → "English Proficiency"). The existing `filters.pickers` object key becomes the URL query param name, so `englishProficiency` works cleanly.

## Implementation Plan

### Database Changes

Add to `City` model in `packages/db/prisma/schema.prisma`:
```prisma
englishProficiency Decimal? @db.Decimal(5, 2)
```

User runs `prisma db push` as usual.

### API Endpoints

**Seed script (collector):**
- Create `apps/collector/server/api/_legacy_cron/english-proficiency.get.ts`
- Fetches EF EPI data (manual JSON embed or scrape), maps country scores to cities via `countryCode`
- Uses `prisma.city.updateMany({ where: { countryCode: ... }, data: { englishProficiency: ... } })`

**City list filter (`apps/nomad/src/server/api/cities/filters.get.ts`):**
- Add `englishProficiency: true` to the `select` in `city.findMany`
- Add an `englishProficiency` entry to the returned `pickers` object using `OPTIONS_LEVEL_GTE` pattern (gte operation, LOW/MIDDLE/HIGH thresholds mapped from the Decimal)

Alternatively, expose raw numeric options derived from the actual data distribution using `getSingleOptions` — this lets users filter by score directly.

**City list query (`apps/nomad/src/server/api/cities/index.get.ts`):**
- Add `englishProficiency: true` to the city `select` inside `monthSummary.findMany`
- Add a `where` clause block: `if (query.englishProficiency) { AND.push({ englishProficiency: { gte: query.englishProficiency } }) }`

**City detail (`apps/nomad/src/server/api/cities/[slug].get.ts`):**
- Add `englishProficiency: true` to the `select`

### Frontend Components/Pages

**`apps/nomad/src/shared/global.schema.ts`:**
- Add `englishProficiency` field to `getCitiesSchema` (optional string → number pipe, same as `internets`)

**`apps/nomad/src/pages/cities/[slug].vue`:**
- Add English proficiency row to the Quality of Life section card
- Display as numeric score + derived badge (High/Medium/Low) using a helper function matching `formatLevel`

**`apps/nomad/src/pages/index.vue`:**
- No change needed — filter is handled via `FiltersDrawer` + `pickers` from the API

### i18n Changes

Add to all locale files under `apps/nomad/src/locales/`:
```json
"city": {
  "englishProficiency": "English Proficiency"
}
```

For the filter, `SinglePicker` auto-labels from the key, so no extra key needed unless you want a translated label. Add to `filters` section if desired:
```json
"filters": {
  "englishProficiency": "English"
}
```

## Dependencies

None. Standalone feature.

## Notes

- EF EPI data is country-level. Cities in the same country will share the same score. This is acceptable and consistent with how `internetSpeedCountry` works.
- The `MonthSummary` model also has fields mirrored from `City` (safety, pollution, etc.) for query performance. If `englishProficiency` needs to be sortable in the main city list (which queries `monthSummary`), you would need to add it to `MonthSummary` as well and sync it via the total-score cron. Given it changes at most once per year, this is low priority — skip it initially and filter/sort directly on `City` if needed.
- The `SinglePicker` label for filter pickers is auto-derived from the `name` prop by splitting on `_` and uppercasing. The key `englishProficiency` becomes "English Proficiency" automatically — no i18n required for the filter label, only for the city detail page row.
- The `OPTIONS_LEVEL_GTE` approach (Low+, Middle+) matches the safety/pollution filter UX. For a Decimal field, you can also just define 3-4 numeric cutpoints from the EF score distribution instead of mapping to the Level enum.
