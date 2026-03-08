# IDEA-15: Trip Planner (Extend Favorites)
**Status:** NOT_STARTED
**Priority:** 15/23
**Complexity:** XL

## What's Already Implemented
Nothing. No trip planner UI, no reorder API, no plan month API, no public trip view.

## Revised Analysis
**Requires [removed] first.** The `status` field from [removed] changes the Favorite model shape that this extends.

**Drag-to-reorder NOT recommended.** No drag library is installed (`@vueuse/core` doesn't ship a sortable list). Adding `vue-draggable-next` or similar adds dependency weight and accessibility complexity. **Use up/down arrow buttons for reordering** — same UX outcome, significantly simpler implementation, keyboard accessible with `aria-label`.

**Shareable trip link privacy:** The spec proposes `/trips/[userId]` which exposes internal user IDs. Instead, add a `tripShareToken` field to `User` (a `cuid()` default), route as `/trips/[tripShareToken]`. Avoids leaking user IDs.

**Month-specific weather** is already in `MonthSummary` — join on `plannedMonth` in the trip endpoint. No new data collection needed.

**Running total cost** is computed client-side — sum `costForNomadInUsd` for all planning favorites with `plannedMonth` set.

## Implementation Plan

### Database Changes
```prisma
// Add to existing Favorite model (after [removed]'s status field):
order        Int?
plannedMonth Int?  // 1-12

// Add to User model:
tripShareToken String @unique @default(cuid())
```

### API Endpoints
**`apps/nomad/src/server/api/favorites/reorder.patch.ts`** — PATCH, protected
- Body: `{ items: Array<{ citySlug: string, order: number }> }`
- Upserts `order` for each favorite
- Returns `{ updated: number }`

**`apps/nomad/src/server/api/favorites/plan.patch.ts`** — PATCH, protected
- Body: `{ citySlug: string, plannedMonth: number | null }`
- Updates `plannedMonth` on the favorite record
- Returns `{ plannedMonth: number | null }`

**`apps/nomad/src/server/api/trips/[token].get.ts`** — GET, public
- Finds `User` by `tripShareToken`
- Returns PLANNING favorites with `order`, `plannedMonth`, city data (name, country, image, `costForNomadInUsd`), and `monthSummary` for the planned month (weatherIcon, temperature)
- No auth required

**Modify** `apps/nomad/src/server/api/favorites/index.get.ts`
- Include `order`, `plannedMonth` in response
- Default sort: `order asc nulls last, createdAt desc` when `status = PLANNING`

### Frontend Components/Pages
**New file**: `apps/nomad/src/composables/useTripPlanner.ts`
- `reorderFavorites()` mutation wrapping PATCH endpoint
- `setPlanMonth(citySlug, month)` mutation

**New file**: `apps/nomad/src/components/dashboard/TripPlanner.vue`
- Ordered list of PLANNING favorites
- Up/down arrow buttons per row for reordering (with `aria-label`)
- Dropdown month selector (Jan–Dec + "Not set") per city
- Running total cost at bottom (sum of cities with `plannedMonth` set)
- Share button: copies `/trips/[tripShareToken]` to clipboard
- Month-specific weather preview icon per city when `plannedMonth` is set

**Modify** `apps/nomad/src/components/dashboard/SavedCities.vue`
- Planning tab renders `<TripPlanner>` instead of (or alongside) the grid view

**New file**: `apps/nomad/src/pages/trips/[token].vue`
- Public read-only trip view
- Fetches `GET /api/trips/[token]`
- Shows ordered cities with planned months and weather previews
- `noindex` meta (private user content)
- `defineI18nRoute({ paths: { en: '/trips/[token]', pl: '/trasy/[token]' } })`

### i18n Changes
Add to all locale files:
```json
"trip": {
  "planner": "Trip Planner",
  "planMonth": "Planned month",
  "notPlanned": "Month not set",
  "shareTrip": "Share trip",
  "linkCopied": "Link copied!",
  "totalCost": "Est. monthly total",
  "monthlyBudget": "~${cost}/mo",
  "publicView": "{name}'s Trip",
  "noPlanning": "No cities in Planning list yet",
  "moveUp": "Move up",
  "moveDown": "Move down"
}
```

## Dependencies
- **[removed] is a hard prerequisite** — the planner operates on PLANNING favorites.
- IDEA-14 / [removed]: month-specific weather data comes from `MonthSummary` already in DB.

## Notes
- `tripShareToken` addition to `User` is a simple `prisma db push` — one field.
- Public trip page must set `noindex` in head meta — it's private user content.
- Running total only sums cities where `plannedMonth IS NOT NULL`.
- Up/down arrow reordering must be keyboard navigable: `<button aria-label="Move up">` / `<button aria-label="Move down">`.
- The public trip view at `/trips/[token]` should gracefully handle tokens that don't exist (404 page, not server error).
