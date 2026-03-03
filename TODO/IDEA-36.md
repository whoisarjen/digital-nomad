# IDEA-36: Historical Cost Trends
**Status:** NOT_STARTED
**Priority:** 36/39
**Complexity:** S (start now) → L (payoff later)

## What's Already Implemented
Nothing. No `CostSnapshot` model, no snapshot cron.

## Revised Analysis
**START THIS IMMEDIATELY.** The schema + cron take one day to implement. The value compounds over 6–12 months as snapshots accumulate. Every month you delay is a month of data permanently lost.

**The UI can wait** — ship the model and cron now. Add the trend visualization to city pages once 6+ months of data exists.

**Snapshot frequency:** Monthly is correct. Weekly would be overkill and expensive to store. Monthly snapshots × 500 cities = 500 rows/month = 6,000 rows/year — tiny.

**Cron placement:** `apps/collector/server/api/cron/cost-snapshot.get.ts` — collector handles all data collection. Run on the 1st of each month.

**Which cost fields to snapshot:**
- `costForNomadInUsd` — primary
- `costForExpatInUsd` — secondary
- `costForLocalInUsd` — secondary
- Skip `costForFamilyInUsd` for V1 to keep snapshots lean

**Idempotency:** The cron should skip if a snapshot for the current month already exists (`@@unique([citySlug, snapshotMonth])`).

## Implementation Plan

### Database Changes
```prisma
model CostSnapshot {
  id            String   @id @default(cuid())
  citySlug      String
  city          City     @relation(fields: [citySlug], references: [slug])
  costNomad     Decimal  @db.Decimal(10, 2)
  costExpat     Decimal  @db.Decimal(10, 2)
  costLocal     Decimal  @db.Decimal(10, 2)
  snapshotMonth DateTime // store as first day of month: new Date(year, month-1, 1)

  @@unique([citySlug, snapshotMonth])
  @@index([citySlug])
}
```

### API Endpoints
**Future (add after 6+ months of data)**: `apps/nomad/src/server/api/cities/[slug]/cost-history.get.ts`
- Returns all snapshots for a city ordered by `snapshotMonth asc`
- Client computes % change between periods

### Cron
**New file**: `apps/collector/server/api/cron/cost-snapshot.get.ts`
- Runs monthly (first day of month)
- Queries all cities: `prisma.city.findMany({ select: { slug, costForNomadInUsd, costForExpatInUsd, costForLocalInUsd } })`
- Upserts snapshots: `prisma.costSnapshot.createMany({ data: [...], skipDuplicates: true })`
- Returns `{ snapshotted: N }`

**Modify** `apps/collector/vercel.json`
- Add cron entry: `{ "path": "/api/cron/cost-snapshot", "schedule": "0 0 1 * *" }` (midnight on 1st of month)

### Frontend Components/Pages (Future — after 6+ months of data)
**New file**: `apps/nomad/src/components/CostTrendChart.vue`
- Simple line chart (use `chart.js` or a lightweight alternative already in the project)
- Shows `costForNomadInUsd` over time
- "Cost has [increased/decreased] X% in the past 12 months"

**Modify** `apps/nomad/src/pages/cities/[slug].vue`
- Add `<CostTrendChart :city-slug="slug" />` after the cost section — only render if ≥ 3 data points exist

## Dependencies
None. This is infrastructure — build it before everything else that depends on data.

## Notes
- **Ship the cron and schema NOW** — every delayed month is permanently lost data.
- The `snapshotMonth` field should always be stored as the first day of the month in UTC (e.g., `new Date(Date.UTC(2026, 2, 1))` for March 2026) for consistent grouping.
- The `skipDuplicates: true` option in `createMany` makes the cron idempotent — safe to run multiple times per month.
- The UI (trend chart) is NOT the priority here. The data collection cron is. Add the chart UI once you have enough data to make it meaningful.
- Add a manual backfill endpoint or script to create initial snapshots from current city costs as a "T=0" baseline.
