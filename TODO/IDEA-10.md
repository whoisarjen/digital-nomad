# IDEA-10: City Alerts / Watchlist

**Status:** NOT_STARTED
**Priority:** 10/23
**Complexity:** XL

## What's Already Implemented

The landing page (`apps/nomad/src/pages/index.vue`) already has a "soon" teaser card labeled "Monthly cost alerts" with the text "Get notified when cost of living changes in your saved cities". The teaser uses `LucideBell` and the `landing.soon` badge. No backend, no schema, no UI beyond this placeholder.

The `Favorite` model and full favorites flow (toggle, list, slugs composable, dashboard SavedCities widget) is fully implemented. This is the natural foundation — alerts extend favorites, they don't replace them.

Auth is implemented via `@sidebase/nuxt-auth` with session management. `defineProtectedEventHandler` is available in server utils for user-gated endpoints.

## Revised Analysis

This is the most complex idea in the batch. Several concerns based on the real codebase:

**Email library: not installed.** `apps/nomad/package.json` has zero email dependencies — no Resend, Nodemailer, SendGrid, Postmark. This is a hard blocker for the weekly digest. You need to pick and install an email provider before this feature can be completed. Given the existing Vercel deployment, **Resend** is the obvious choice (good Vercel integration, generous free tier, modern API).

**Threshold model for alerts.** The proposed schema tracks `threshold` + `direction` (ABOVE/BELOW) per metric. This is flexible but creates complexity: when the cron runs, it must query every active alert, fetch the current metric value for each city, and compare. With potentially many users and many alerts, this becomes O(alerts) queries. Better approach: cron fetches all cities' current values once, then loads all active alerts and evaluates in memory. This is feasible at current scale.

**"Cost change" vs. absolute threshold.** The original schema checks if a metric crosses a fixed threshold (e.g., "notify me when cost drops below $2000"). An alternative is "notify me when cost changes by X%". The Decimal threshold approach in the proposal is fine — keep it.

**`lastTriggered` prevents spam.** The schema's `lastTriggered DateTime?` field is critical. The cron should only re-trigger an alert if `lastTriggered` is null or older than the check interval (e.g., 7 days). This must be enforced in the cron logic.

**Max 10 alerts per user.** Enforce this at the POST endpoint level — `prisma.cityAlert.count({ where: { userId, isActive: true } })` and reject if >= 10.

**AlertMetric values.** The proposed enum values (COST_NOMAD, COST_EXPAT, INTERNET_SPEED, SAFETY) map to `City.costForNomadInUsd`, `City.costForExpatInUsd`, `City.internetSpeedCity`, and `City.safety`. Note that `safety` is a `Level` enum (LOW/MIDDLE/HIGH), not a Decimal, so comparing it with a Decimal threshold is awkward. Options: (a) exclude SAFETY from AlertMetric for now and only support numeric fields, or (b) map Level to a numeric value (LOW=1, MIDDLE=2, HIGH=3) for comparison. Recommendation: start with COST_NOMAD and INTERNET_SPEED only — these are the most valuable to nomads and are pure numeric fields.

**Cron placement.** The `apps/collector` app hosts all cron jobs (weather-daily, legacy cron). The alert digest cron belongs there too, not in `apps/nomad`.

**Dashboard section.** The dashboard page (`apps/nomad/src/pages/dashboard.vue`) currently has: NomadIdentity, RoadmapBoard, SavedCities, AccountDangerZone. The alert management UI fits as a new section between SavedCities and AccountDangerZone.

**Relationship to Favorites.** The schema uses `citySlug` (not a FK to Favorite). This is correct — you may want to alert on a city you haven't favorited. But the UX should nudge users to add alerts from the city page or from SavedCities.

## Implementation Plan

### Database Changes

Add to `packages/db/prisma/schema.prisma`:
```prisma
enum AlertMetric {
  COST_NOMAD
  COST_EXPAT
  INTERNET_SPEED
  SAFETY
}

enum AlertDirection {
  BELOW
  ABOVE
}

model CityAlert {
  id          String         @id @default(cuid())
  userId      String
  user        User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  citySlug    String
  city        City           @relation(fields: [citySlug], references: [slug], onDelete: Cascade)
  metric      AlertMetric
  threshold   Decimal        @db.Decimal(10, 2)
  direction   AlertDirection
  isActive    Boolean        @default(true)
  lastTriggered DateTime?
  createdAt   DateTime       @default(now())

  @@index([userId, isActive])
  @@index([isActive])
}
```

Also add relations to `User` and `City` models:
```prisma
// In User model:
alerts CityAlert[]

// In City model:
alerts CityAlert[]
```

User runs `prisma db push`.

### API Endpoints

All endpoints in `apps/nomad/src/server/api/alerts/`:

**`index.post.ts`** — Create alert
- `defineProtectedEventHandler`
- Validate body: `citySlug`, `metric` (AlertMetric enum), `threshold` (number), `direction` (AlertDirection enum)
- Check count: reject if user has >= 10 active alerts
- `prisma.cityAlert.create({ select: { id, metric, threshold, direction, citySlug, isActive, createdAt } })`

**`index.get.ts`** — List alerts for current user
- `defineProtectedEventHandler`
- `prisma.cityAlert.findMany({ where: { userId, isActive: true }, select: { id, metric, threshold, direction, citySlug, lastTriggered, createdAt, city: { select: { name, country } } }, orderBy: { createdAt: 'desc' } })`

**`[id].delete.ts`** — Delete / deactivate alert
- `defineProtectedEventHandler`
- Validate the alert belongs to the current user before deleting
- `prisma.cityAlert.delete({ where: { id, userId } })`

**Cron: `apps/collector/server/api/cron/alert-digest.get.ts`**
- Fetch all active alerts: `prisma.cityAlert.findMany({ where: { isActive: true }, select: { id, userId, citySlug, metric, threshold, direction, lastTriggered, user: { select: { email } } } })`
- For each unique citySlug, fetch current values once (group by city to avoid N+1)
- Evaluate each alert against current value
- Skip alerts where `lastTriggered` is within last 6 days (rate-limit to roughly weekly)
- For triggered alerts: send email via Resend, update `lastTriggered`
- Group triggered alerts by user to send one digest email per user, not one per alert

### Frontend Components/Pages

**`apps/nomad/src/components/dashboard/CityAlerts.vue`** (new)
- List current alerts with city name, metric, threshold, direction
- Delete button per alert
- "Add alert" form (city search, metric picker, threshold input, direction toggle)
- Show remaining alert slots (max 10)

**`apps/nomad/src/pages/dashboard.vue`** (modify)
- Import and add `<CityAlerts />` component below SavedCities section

**`apps/nomad/src/pages/cities/[slug].vue`** (modify)
- Add "Set Alert" button in the header badges area (next to FavoriteButton)
- Auth-gated via `<AuthGate>`

**`apps/nomad/src/composables/useCityAlerts.ts`** (new)
- Wraps GET `/api/alerts` via `useCustomQuery`

### i18n Changes

Add to `apps/nomad/src/locales/en.json`:
```json
"alerts": {
  "title": "City Alerts",
  "add": "Add Alert",
  "delete": "Remove",
  "metric": {
    "COST_NOMAD": "Nomad Cost",
    "COST_EXPAT": "Expat Cost",
    "INTERNET_SPEED": "Internet Speed",
    "SAFETY": "Safety"
  },
  "direction": {
    "BELOW": "drops below",
    "ABOVE": "rises above"
  },
  "maxReached": "Maximum 10 alerts reached",
  "noAlerts": "No alerts set. Add one from any city page.",
  "slotsRemaining": "{count} slots remaining",
  "notifyWhen": "Notify me when {city} {metric} {direction} {threshold}"
}
```

## Dependencies

- Requires an email provider to be installed (Resend recommended). This is a hard dependency before the cron can be useful.
- The landing page teaser (in `index.vue`) references "Monthly cost alerts" — once this ships, that card should either link to the dashboard or be removed.

## Notes

- **Install Resend first.** Without email, you can build the full CRUD for alerts (schema, API, UI) but the cron is inert. Consider doing the CRUD work first in one PR and wiring up email in a follow-up.
- The `SAFETY` metric is a `Level` enum, not a number. If you include it in `AlertMetric`, the cron needs to map Level → integer for threshold comparison. This is a source of bugs. Strong recommendation: omit SAFETY from the initial implementation and add it later.
- The alert digest email UX matters a lot. A single batched email per user ("3 of your city alerts triggered this week") is far better than 3 separate emails. Build the batching logic from the start.
- Consider adding a `Vercel Cron` entry in `vercel.json` for the collector app to run `alert-digest` weekly (e.g., every Monday at 08:00 UTC). Check whether the collector app has a `vercel.json` already.
- The existing `processInBatches` utility in the collector app can be used in the cron to avoid overwhelming the DB.
- The max-10-alerts rule must be enforced server-side, not just in the UI.
