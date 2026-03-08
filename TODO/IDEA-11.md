# IDEA-11: Granular Cost Breakdown
**Status:** IN_PROGRESS
**Priority:** 11/23
**Complexity:** M

## What's Already Done
- 55 price fields added directly to `City` model (flat, no separate table)
- Data seeded for all matched cities via `/api/_legacy_cron/seed-city-prices` endpoint
- Source: Numbeo data (TheChance101/cost-of-living on GitHub, ~4956 cities)
- Collector endpoint at `apps/collector/server/api/_legacy_cron/seed-city-prices.get.ts`
- Raw JSON at `packages/db/cost-of-living.json`

## Remaining Work

## What's Already Implemented
- Aggregate cost fields exist (`costForNomadInUsd`, `costForExpatInUsd`, `costForLocalInUsd`, `costForFamilyInUsd`) but no line-item breakdown
- Nothing else. No `CityPrice` model, no price endpoints, no cost breakdown UI.

## Revised Analysis
**The model and UI are easy. Data collection is the hard problem.** Building the schema and UI takes ~1 day. Collecting 30-50 accurate price items for 50 cities takes weeks.

**Data source options (in order of preference):**
1. **Numbeo API** — structured, reliable, ~$50–200/month for commercial access. Best quality.
2. **Numbeo web scraping** — fragile, ToS issue, not recommended.
3. **User submissions** — free but slow to populate, needs moderation.
4. **Manual research** — accurate but not scalable.

**Recommendation:** Start with user submissions (IDEA-16 style) to seed the data, and explore Numbeo API access for automation once there's a budget.

**Coverage:** Start with top 20 nomad cities, 15-20 items each (not 50 items). Ship something useful before trying to be comprehensive.

**Categories vs items:** 30-50 individual items is overwhelming UI. Group into expandable categories. Show 5 top items by default, "Show more" for full list.

## Implementation Plan

### Database Changes
```prisma
enum PriceCategory {
  FOOD
  HOUSING
  TRANSPORT
  UTILITIES
  ENTERTAINMENT
  PERSONAL_CARE
}

model CityPrice {
  id         String        @id @default(cuid())
  citySlug   String
  city       City          @relation(fields: [citySlug], references: [slug])
  category   PriceCategory
  item       String        // "Meal at inexpensive restaurant"
  itemPl     String?       // PL translation of item name
  priceUsd   Decimal       @db.Decimal(10, 2)
  updatedAt  DateTime      @updatedAt

  @@unique([citySlug, item])
  @@index([citySlug, category])
}
```

### API Endpoints
**`apps/nomad/src/server/api/cities/[slug]/prices.get.ts`** — GET, public
- Returns all price items for a city grouped by category
- `select` only: category, item, itemPl (if PL locale), priceUsd, updatedAt
- Respects locale for item name (use `getLocale` + return appropriate item field)

### Frontend Components/Pages
**New file**: `apps/nomad/src/components/CostBreakdown.vue`
- Props: `prices: PriceByCategoryGroup[]`, `locale: string`
- Expandable category sections (accordion style)
- Show 5 items per category by default, "Show all X items" toggle
- Each item: name, price in USD, optional local currency conversion
- "Data source" attribution per item or per section

**Modify** `apps/nomad/src/pages/cities/[slug].vue` (or `[slug]/index.vue` after [removed] restructure)
- Add `<CostBreakdown />` below the existing aggregate cost section
- Lazy-load with `useCustomQuery` (don't block city page render)

**New file**: `apps/nomad/src/composables/useCityPrices.ts`
- Wraps `useCustomQuery` for prices endpoint
- `lazy: true` to avoid blocking city page initial load

**New file**: `packages/db/prisma/seeds/city-prices.ts`
- Initial seed data for top 20 cities
- JSON file of `{ citySlug, category, item, priceUsd }` records

### i18n Changes
Add to all locale files:
```json
"costBreakdown": {
  "title": "Cost Breakdown",
  "showAll": "Show all {count} items",
  "showLess": "Show less",
  "categories": {
    "FOOD": "Food & Restaurants",
    "HOUSING": "Housing",
    "TRANSPORT": "Transport",
    "UTILITIES": "Utilities",
    "ENTERTAINMENT": "Entertainment",
    "PERSONAL_CARE": "Personal Care"
  },
  "perMonth": "/month",
  "dataSource": "Source: Numbeo"
}
```

## Dependencies
- [removed]: If city page is restructured to `[slug]/index.vue`, this component goes in that file.

## Notes
- **Data collection is 90% of the effort.** Do not start building the UI until data exists for at least 10 cities.
- Consider Numbeo API commercial license ($50-200/month) once site traffic justifies it — automating 50+ price items for 500 cities is only feasible with their API.
- The `@@unique([citySlug, item])` constraint uses the English item name as the unique key — this means `itemPl` is optional and the English name is canonical.
- Price comparison ("A restaurant meal in Bangkok costs 70% less than in Lisbon") is a compelling feature that requires computing diffs client-side or via the compare endpoint ([removed]).
