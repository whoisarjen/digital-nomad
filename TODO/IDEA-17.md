# IDEA-17: Nomad Season Community Ratings
**Status:** NOT_STARTED
**Priority:** 17/23
**Complexity:** M

## What's Already Implemented
Nothing. No `SeasonRating` model exists. The auth infrastructure, the `Favorite` model (which provides the gating mechanic), and the monthly weather display on the city page are all in place.

## Revised Analysis

**Dependency on IDEA-14 (Check-ins):** IDEA-14 is not implemented and is not in scope here. The original plan says "only users who have checked in or favorited the city can rate." Gating on check-ins is blocked. Gating on Favorites (`Favorite` model already exists) is achievable today and is simpler. Revised gate: **only users who have favorited the city can rate its months.** This is a meaningful signal — if you've favorited a city you have at least a declared interest in it, and people who actually visited it tend to favorite it.

This means the eligibility check in the POST endpoint is a single `prisma.favorite.findUnique({ where: { userId_citySlug: { userId, citySlug } } })` call — cheap and already battle-tested from the favorites system.

**Thumbs up/down vs. numeric rating:** Thumbs up/down (boolean `isPositive`) is clean and easy to aggregate. The aggregated display ("Best months are Nov–Feb") computes as: for each month, calculate `positiveCount / totalVotes * 100`. Months above a threshold (e.g., 60%) are "best"; below another (e.g., 40%) are "avoid." This is straightforward and works well even with small sample sizes, unlike a 5-star system.

**Display text generation:** The aggregation happens on the server — the GET endpoint returns per-month `{ positiveCount, totalCount, positiveRate }` for all 12 months, plus a pre-computed `bestMonths` and `avoidMonths` array of month numbers. The frontend renders the text from these arrays.

**Interplay with existing MonthSummary data:** The city page already shows the algorithmic month score strip (IDEA-14 is implemented). The community season ratings should be displayed as a distinct "Community View" subsection below or alongside it — not replacing the data-driven strip. Two different signals: one objective (climate data), one subjective (community sentiment). Keep them visually separate.

**Schema note — `@@index([citySlug, month])`:** Correct and important. The primary read pattern is "all votes for citySlug X grouped by month", so this index covers it well.

**Changing a vote:** The `@@unique([userId, citySlug, month])` means a user can only have one vote per month per city. The POST endpoint should be an upsert — if a vote already exists for that `[userId, citySlug, month]`, update `isPositive`; otherwise create. This is more UX-friendly than a separate "delete and re-vote" flow.

## Implementation Plan

### Database Changes
Add to `/Users/kamilowczarek/Documents/GitHub/digital-nomad/packages/db/prisma/schema.prisma`:

```prisma
model SeasonRating {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt

  userId    String
  user      User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  citySlug  String
  city      City   @relation(fields: [citySlug], references: [slug], onDelete: Cascade)
  month     Int    // 1-12
  isPositive Boolean

  @@unique([userId, citySlug, month])
  @@index([citySlug, month])
  @@index([userId])
}
```

Add relations to existing models:
- `User`: add `seasonRatings SeasonRating[]`
- `City`: add `seasonRatings SeasonRating[]`

### API Endpoints

| File | Method | Auth | Description |
|------|--------|------|-------------|
| `apps/nomad/src/server/api/season-ratings/city/[slug].get.ts` | GET | Public | Aggregated ratings for all 12 months of a city |
| `apps/nomad/src/server/api/season-ratings/index.post.ts` | POST | Required | Upsert a month rating (must have favorited city) |

**GET `/api/season-ratings/city/[slug]`** — public. Groups votes by month and returns an array of 12 items:
```ts
{
  month: number,       // 1-12
  positiveCount: number,
  totalCount: number,
  userVote: boolean | null  // null if not authenticated or no vote
}
```
The `userVote` field requires an optional auth check via `getServerSession(event)` — no error thrown if unauthenticated, just `null`. The frontend derives `bestMonths` and `avoidMonths` client-side from `positiveCount / totalCount`.

Use `groupBy` is not available in Prisma on Neon driver adapter easily. Use raw `findMany` with `where: { citySlug, isActive: true }` and aggregate in JS. Given the 12-month ceiling and realistic vote counts, this is fine.

**POST `/api/season-ratings`** — protected via `defineProtectedEventHandler`. Validate body:
```ts
{ citySlug, month (1-12), isPositive }
```
1. Check `Favorite` exists for `userId + citySlug`. If not, throw `403` with message "You must save this city before rating its seasons."
2. `upsert` `SeasonRating` on the unique key `[userId, citySlug, month]`.
3. Return `{ month, isPositive }`.

### Zod Schemas
Add to `apps/nomad/src/shared/global.schema.ts`:

```ts
export const createSeasonRatingSchema = z.object({
  citySlug: z.string().min(1),
  month: z.number().int().min(1).max(12),
  isPositive: z.boolean(),
})
```

Note: `month` comes from a POST body, so it arrives as a number (not a string), unlike query params that need `.transform(Number)`.

### Composables
- `apps/nomad/src/composables/useSeasonRatings.ts` — wraps GET `/api/season-ratings/city/[slug]` via `useCustomQuery`
- `apps/nomad/src/composables/useSubmitSeasonRating.ts` — wraps POST via mutation (follow `vote.post.ts` pattern)

### Frontend Components/Pages

New components:
- `apps/nomad/src/components/CitySeasonRatings.vue` — full section component. Renders a row of 12 month tiles (reuse or mirror the existing monthly weather strip styling for visual consistency). Each tile shows: month abbreviation, thumbs-up/down buttons (auth-gated), and a percentage bar if there are votes. Shows a summary text line at the top: "Community says: Best months are Nov–Feb. Avoid July–Aug."
- No separate sub-components needed for v1 — keep it in one file.

Modify:
- `apps/nomad/src/pages/cities/[slug].vue` — add `<CitySeasonRatings :city-slug="citySlug" />` below the Monthly Weather section (`<!-- ─── Monthly Weather ─── -->`), giving it its own card/section within the light content zone.

### i18n Changes
Add to `apps/nomad/src/locales/en.json`:

```json
"seasonRatings": {
  "title": "Community Season Ratings",
  "subtitle": "Would you go back in this month?",
  "positiveBtn": "Yes",
  "negativeBtn": "No",
  "noVotes": "No votes yet",
  "bestMonths": "Community says: Best months are {months}.",
  "avoidMonths": "Avoid: {months}.",
  "noData": "Not enough votes yet to show a trend.",
  "mustFavorite": "Save this city to rate its seasons",
  "loginToRate": "Sign in to rate"
}
```

Mirror keys to `apps/nomad/src/locales/pl.json`.

## Dependencies
- **Favorite model** (already implemented, [removed] equivalent is already done as `Favorite` exists in schema).
- IDEA-14 (Check-ins) is explicitly NOT a dependency in this revised plan — gating is done on Favorites only.

## Notes
- **Gating rationale change:** Gating on Favorites rather than check-ins is a deliberate simplification. It avoids blocking on IDEA-14 and is still a meaningful quality signal. Can be relaxed later to "favorited OR checked in" once IDEA-14 ships.
- **Minimum votes threshold:** Consider not displaying `bestMonths`/`avoidMonths` summary text until a city has at least 3 total votes. Otherwise a single user's opinion would appear as "Community says."
- **No delete endpoint in v1:** Users can flip their vote by submitting again (upsert). There is no need for an explicit delete. If a user wants to undo entirely, that can come in v2.
- **Spam resilience:** Each user can cast at most 12 votes per city (one per month). The Favorite gate prevents drive-by voting.
- **Display alongside algorithmic score:** Make the community section visually distinct from the existing `MonthSummary` strip. Use a different color scheme or a clear label ("Community" vs. "Weather Data") to avoid confusion.
