# IDEA-20: Favorites Split — Visited vs Planning
**Status:** NOT_STARTED
**Priority:** 20/39
**Complexity:** S

## What's Already Implemented
Current `Favorite` model:
```prisma
model Favorite {
  userId    String
  citySlug  String
  createdAt DateTime @default(now())
  @@id([userId, citySlug])
  @@index([userId])
}
```
No `status` field. The toggle endpoint does a pure add/remove with no status concept. `FavoriteButton.vue` is a single heart with no status awareness.

## Revised Analysis
This is a **prerequisite for IDEA-13** (Trip Planner). Build this first.

**Toggle endpoint changes:** When city already favorited and user changes status (PLANNING → VISITED), the handler should **update** the existing record (preserve `createdAt`), not delete + recreate.

**FavoriteButton UI:** Single heart for initial save (defaults to PLANNING). On re-interaction, show a dropdown/split with "Visited" / "Planning" options. Keep it compact — a dropdown on hover over the already-favorited heart is the cleanest pattern.

**City detail endpoint:** Add `{ visitedCount, planningCount }` via a `groupBy` query on `Favorite` — parallel to the city data query.

**Session:** `auth/[...].ts` currently uses `include` to load favorites (existing rule violation — pre-existing, don't copy). The session `favoriteSlugs` will need to carry status. Consider returning `{ slug, status }[]` in the session instead of just `string[]` — or add a separate `favoriteStatuses` map to the session object.

## Implementation Plan

### Database Changes
```prisma
enum FavoriteStatus {
  VISITED
  PLANNING
}

// Add to existing Favorite model:
status FavoriteStatus @default(PLANNING)
```

No additional index needed — queries always filter by `userId` first (already indexed).

### API Endpoints
**Modify** `apps/nomad/src/server/api/favorites/toggle.post.ts`
- Accept optional `status: 'VISITED' | 'PLANNING'` in body (default `PLANNING`)
- Logic:
  - Record exists + same status → delete (unfavorite)
  - Record exists + different status → update status only (preserve createdAt)
  - Record does not exist → create with given status

**Modify** `apps/nomad/src/server/api/favorites/index.get.ts`
- Include `status` in response select

**Modify** `apps/nomad/src/server/api/favorites/slugs.get.ts`
- Include `status` per slug so `FavoriteButton` knows current status without extra fetch

**Modify** `apps/nomad/src/server/api/cities/[slug].get.ts`
- Add parallel `prisma.favorite.groupBy({ by: ['status'], where: { citySlug: slug }, _count: { _all: true } })` to return `{ visitedCount, planningCount }`

**Modify** `apps/nomad/src/server/api/auth/[...].ts`
- In session callback: load `{ slug, status }[]` instead of just `favoriteSlugs: string[]`

### Frontend Components/Pages
**Modify** `apps/nomad/src/shared/global.schema.ts`
- Add `status` field to `favoriteToggleSchema`

**Modify** `apps/nomad/src/components/FavoriteButton.vue`
- Add status-aware dropdown: two options "Visited" / "Planning" shown when city is already favorited
- Keep single heart for initial unfavorited state (tapping = PLANNING by default)

**Modify** `apps/nomad/src/composables/useFavoriteSlugs.ts`
- Track `{ slug, status }[]` instead of `string[]`
- Add `getFavoriteStatus(slug): FavoriteStatus | false` helper
- Update `isFavorited()` to also return status info

**Modify** `apps/nomad/src/components/dashboard/SavedCities.vue`
- Add two tabs: "Visited" / "Planning"
- Filter `favorites` computed by active tab

**Modify** `apps/nomad/src/pages/cities/[slug].vue`
- Add aggregate count badges: "82 been here · 34 planning to visit"

### i18n Changes
Add to all locale files:
```json
"favorites": {
  "statusVisited": "Visited",
  "statusPlanning": "Planning",
  "tabVisited": "Visited",
  "tabPlanning": "Planning to visit",
  "changeStatus": "Change status",
  "beenHere": "{count} been here",
  "planning": "{count} planning to visit"
}
```

## Dependencies
- Prerequisite for IDEA-13 (Trip Planner) — build this first.

## Notes
- Existing favorites in DB will default to `PLANNING` (the enum default) — no backfill needed.
- Do NOT use `include` in any new Prisma queries — the auth handler's existing `include` usage is a pre-existing violation, do not replicate.
- The `groupBy` for visitedCount/planningCount on the city detail endpoint runs in parallel with the main city query for no latency penalty.
