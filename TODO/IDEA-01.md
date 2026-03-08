# IDEA-01: City Check-Ins ("I'm Here Now")
**Status:** NOT_STARTED
**Priority:** 1/23
**Complexity:** L

## What's Already Implemented
Nothing. No check-in model, no check-in endpoints, no check-in UI anywhere in the codebase.

Auth system exists (`defineProtectedEventHandler` pattern established). Favorites system shows the correct server endpoint pattern to follow.

## Revised Analysis
**Broken unique constraint in spec:** The proposed `@@unique([userId, isActive])` is logically wrong — PostgreSQL would collide on `(userId, false)` for the second inactive record. Prisma has no partial unique index support. Enforce single-active-check-in in application logic inside the toggle handler (deactivate existing before creating new).

**Cron placement:** The auto-expire cron belongs in `apps/collector/server/api/cron/checkins-expire.get.ts` — not in the nomad app. Collector already has Vercel cron infrastructure and DB access. Pattern follows existing `weather-daily.get.ts`.

**Toggle semantics:** Toggling the same city again = check out. Toggling a different city = move to new city (deactivate old, activate new).

## Implementation Plan

### Database Changes
```prisma
model CheckIn {
  id         String    @id @default(cuid())
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @default(now()) @updatedAt
  userId     String
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  citySlug   String
  city       City      @relation(fields: [citySlug], references: [slug], onDelete: Cascade)
  arrivingAt DateTime?
  leavingAt  DateTime?
  isActive   Boolean   @default(true)

  @@index([userId, isActive])
  @@index([citySlug, isActive])
}
```
Add `checkIns CheckIn[]` back-relations to `User` and `City`.

### API Endpoints
**`apps/nomad/src/server/api/checkins/toggle.post.ts`** — POST, protected
- Body: `{ citySlug: string, arrivingAt?: string }`
- Deactivates existing active check-in for user (if any); creates new active check-in for target city (or just deactivates if same city = toggle off)
- Returns `{ checkedIn: boolean, citySlug: string | null }`

**`apps/nomad/src/server/api/checkins/city/[slug].get.ts`** — GET, public
- Returns `{ count: number }` of active check-ins for that city

**`apps/nomad/src/server/api/checkins/me.get.ts`** — GET, protected
- Returns `{ citySlug: string | null, arrivingAt: string | null }`

**Modify** `apps/nomad/src/server/api/cities/[slug].get.ts`
- Add parallel `prisma.checkIn.count({ where: { citySlug: slug, isActive: true } })` to return `activeCheckInCount`

**`apps/collector/server/api/cron/checkins-expire.get.ts`** — cron
- Sets `isActive = false` on records where `createdAt < 90 days ago AND isActive = true`

### Frontend Components/Pages
**New file**: `apps/nomad/src/composables/useCheckIn.ts`
- Wraps me endpoint + toggle mutation with optimistic update

**New file**: `apps/nomad/src/components/CheckInButton.vue`
- Auth-gated (shows sign-in prompt if not authenticated)
- Shows "Check in" / "I'm here" state based on current check-in status

**Modify** `apps/nomad/src/pages/cities/[slug].vue`
- Add `<CheckInButton>` to city hero area
- Show "X nomads here this month" count badge

**New file**: `apps/nomad/src/components/dashboard/CheckInStatus.vue`
- Current active check-in card on dashboard

### i18n Changes
Add to all locale files:
```json
"checkIn": {
  "button": "Check in",
  "checkedIn": "I'm here",
  "checkOut": "Check out",
  "signInToCheckIn": "Sign in to check in",
  "nomadsHere": "{count} nomad here | {count} nomads here this month",
  "currentlyIn": "Currently in {city}",
  "noActiveCheckIn": "Not checked in anywhere"
}
```

## Dependencies
- IDEA-12 (Season Ratings) wants to gate ratings on check-in history — soft dependency.
- [removed] (Trending) benefits from check-in velocity data.

## Notes
- Single-active constraint must be enforced in application logic, not DB constraint.
- Cron in collector, not nomad — follow the `weather-daily.get.ts` pattern exactly.
- 90-day auto-expiry keeps the "nomads here this month" count fresh and meaningful.
