# IDEA-16: City Tips (User-Generated Content)
**Status:** NOT_STARTED
**Priority:** 16/23
**Complexity:** L

## What's Already Implemented
Nothing. No `CityTip`, `TipVote`, or `TipCategory` models exist in the schema. No tip-related API endpoints or components exist. The auth infrastructure required (session, `defineProtectedEventHandler`, `useAuth`) is fully in place and working.

## Revised Analysis

The original plan is sound. A few points to sharpen:

**Upvotes counter approach:** The original schema stores `upvotes Int @default(0)` as a denormalized count. Given that `TipVote` is a separate model providing the ground truth, the counter risks going out of sync. Two options:
1. Keep the counter and increment/decrement atomically inside a Prisma transaction (simpler reads, small sync risk).
2. Drop the counter and always compute `_count.votes` in queries (always accurate, slightly more expensive).

Recommendation: Option 2 — drop `upvotes` from `CityTip`, use `_count: { select: { votes: true } }` in Prisma queries. Given current traffic scale there is no reason to denormalize.

**`isActive` flag vs. hard delete:** Keep `isActive Boolean @default(true)` so reports can soft-delete without losing data for moderation.

**Report mechanism:** The original plan mentions a report/flag endpoint. For a first iteration, a simple `reportedAt DateTime?` column on `CityTip` is enough — no separate `TipReport` table needed yet. Set it to `now()` on report; a future admin panel reads `where: { reportedAt: { not: null } }`.

**Rate limit (1 tip per category per city per user):** Already enforced by the `@@unique([userId, citySlug, category])` composite unique — the DB itself rejects duplicates. No application-level rate-limiting needed beyond catching the Prisma unique constraint error and returning a clean 409.

**Enum naming convention:** The schema uses `PascalCase` enum values everywhere (e.g., `Level { LOW, MIDDLE, HIGH }`). Keep `TipCategory` values in `SCREAMING_SNAKE_CASE` to match Prisma enum convention used in this project.

**Content language:** Tips are free-form user text — not localized like Article content. No bilingual fields needed. The `content` field is a single `@db.VarChar(150)` string.

**i18n note:** The UI labels for each category need locale keys in `en.json` (and `pl.json`). The category enum values are stored in the DB as-is; the frontend maps them to display labels via i18n.

## Implementation Plan

### Database Changes
Add to `/Users/kamilowczarek/Documents/GitHub/digital-nomad/packages/db/prisma/schema.prisma`:

```prisma
enum TipCategory {
  SIM_CARD
  COWORKING
  NEIGHBORHOOD
  FOOD
  VISA
  SAFETY
  TRANSPORT
}

model CityTip {
  id        String      @id @default(cuid())
  createdAt DateTime    @default(now())
  updatedAt DateTime    @default(now()) @updatedAt

  userId    String
  user      User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  citySlug  String
  city      City        @relation(fields: [citySlug], references: [slug], onDelete: Cascade)
  category  TipCategory
  content   String      @db.VarChar(150)
  isActive  Boolean     @default(true)
  reportedAt DateTime?

  votes     TipVote[]

  @@unique([userId, citySlug, category])
  @@index([citySlug, category])
  @@index([userId])
}

model TipVote {
  userId    String
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  tipId     String
  tip       CityTip @relation(fields: [tipId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@id([userId, tipId])
  @@index([tipId])
}
```

Add relations to existing models:
- `User`: add `tips CityTip[]` and `tipVotes TipVote[]`
- `City`: add `tips CityTip[]`

### API Endpoints

All files live under `apps/nomad/src/server/api/tips/`:

| File | Method | Auth | Description |
|------|--------|------|-------------|
| `apps/nomad/src/server/api/tips/city/[slug].get.ts` | GET | Public | Fetch all active tips for a city, grouped by category, with vote counts and caller's own vote status |
| `apps/nomad/src/server/api/tips/index.post.ts` | POST | Required | Submit a new tip (enforces unique constraint) |
| `apps/nomad/src/server/api/tips/vote.post.ts` | POST | Required | Toggle upvote on a tip (create/delete TipVote) |
| `apps/nomad/src/server/api/tips/report.post.ts` | POST | Required | Set `reportedAt` on a tip |

**GET `/api/tips/city/[slug]`** — public endpoint. Returns tips grouped by category sorted by vote count desc. When user is authenticated (optional session check via `getServerSession`), also returns `userVotedTipIds` array so the frontend can show which tips the user already voted on. Use `select` with `_count: { select: { votes: true } }`, never `include`.

**POST `/api/tips`** — protected. Validate body with Zod schema: `{ citySlug, category, content }`. Catch Prisma `P2002` unique violation and throw `409 Conflict` with message "You already submitted a tip for this category in this city."

**POST `/api/tips/vote`** — protected. Toggle pattern identical to `favorites/toggle.post.ts`. Validate `{ tipId }`. Find existing `TipVote`, delete if exists (voted: false), create if not (voted: true). Also verify the tip exists and `isActive === true`.

**POST `/api/tips/report`** — protected. Validate `{ tipId }`. Set `reportedAt = new Date()` on the tip. Idempotent (re-reporting is fine). Soft-hide from public feed: GET endpoint filters `where: { isActive: true, reportedAt: null }`.

### Zod Schemas
Add to `apps/nomad/src/shared/global.schema.ts`:

```ts
export const TIP_CATEGORIES = ['SIM_CARD', 'COWORKING', 'NEIGHBORHOOD', 'FOOD', 'VISA', 'SAFETY', 'TRANSPORT'] as const
export type TipCategoryValue = typeof TIP_CATEGORIES[number]

export const createTipSchema = z.object({
  citySlug: z.string().min(1),
  category: z.enum(TIP_CATEGORIES),
  content: z.string().min(1).max(150),
})

export const voteTipSchema = z.object({
  tipId: z.string().min(1),
})

export const reportTipSchema = z.object({
  tipId: z.string().min(1),
})
```

### Composables
- `apps/nomad/src/composables/useCityTips.ts` — wraps GET `/api/tips/city/[slug]` via `useCustomQuery`
- `apps/nomad/src/composables/useSubmitTip.ts` — wraps POST via `useMutation` from TanStack Query (check how features/vote.post.ts is called from the existing `FeatureCard.vue` for the mutation pattern)

### Frontend Components/Pages

New components:
- `apps/nomad/src/components/CityTips.vue` — top-level section component for the city page. Renders tabs/pills for each category. Shows tips for selected category. Has an "Add Tip" button (auth-gated via `AuthGate`).
- `apps/nomad/src/components/CityTipCard.vue` — single tip card: content text, vote count button (thumbs up), report icon (small, subtle). Uses `AuthGate` to disable voting if not logged in.
- `apps/nomad/src/components/CityTipForm.vue` — inline form: textarea (150 chars, countdown), category pre-selected from active tab, submit button.

Modify:
- `apps/nomad/src/pages/cities/[slug].vue` — add `<CityTips :city-slug="citySlug" />` section below the Monthly Weather section, above the Related Articles widget.

### i18n Changes
Add to `apps/nomad/src/locales/en.json` under a new `tips` key:

```json
"tips": {
  "title": "Nomad Tips",
  "subtitle": "Real tips from people who've been there",
  "addTip": "Add a tip",
  "submit": "Submit",
  "placeholder": "Share a practical tip for fellow nomads... (150 chars max)",
  "loginToAdd": "Sign in to add a tip",
  "loginToVote": "Sign in to vote",
  "noTips": "No tips yet. Be the first!",
  "alreadySubmitted": "You've already submitted a tip for this category",
  "reported": "Reported",
  "categories": {
    "SIM_CARD": "SIM & Internet",
    "COWORKING": "Coworking",
    "NEIGHBORHOOD": "Neighborhood",
    "FOOD": "Food",
    "VISA": "Visa & Admin",
    "SAFETY": "Safety",
    "TRANSPORT": "Transport"
  }
}
```

Mirror keys to `apps/nomad/src/locales/pl.json`.

## Dependencies
- No hard dependencies on other IDEAs.
- IDEA-19 (Public Nomad Profiles) depends on this — tips submitted by a user appear on their profile page.

## Notes
- **No separate admin UI** is needed in v1. Reported tips are filtered out from the public feed via `reportedAt: null`. Review them directly in the DB or via a future admin panel.
- **Spam concern:** The `@@unique([userId, citySlug, category])` constraint limits each user to 7 tips total per city (one per category). This is a strong natural spam deterrent.
- **`isActive` vs `reportedAt`:** `isActive` is for future admin hard-hide (e.g., manually disabled). `reportedAt` is for user-reported content. Separating them gives two independent control levers without complexity.
- **No pagination in v1:** There can be at most 1 tip per category per user per city. With say 100 users who have tipped a city and 7 categories, that is at most 700 tips per city total — well within a single query. Pagination is unnecessary at this scale.
- **Vote count sort:** Sort tips by `_count.votes` descending within each category so best tips bubble up organically.
