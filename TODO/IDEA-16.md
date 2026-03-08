# IDEA-16: User City Reviews
**Status:** NOT_STARTED
**Priority:** 16/23
**Complexity:** M

## What's Already Implemented
Nothing. No `CityReview` model, no review endpoints, no review UI.

## Revised Analysis
Clean idea with clear schema. Start with 3 dimensions instead of 5 to reduce form friction — users who see a 5-dimension form are more likely to skip. Add dimensions in V2 once the feature is established.

**Recommended V1 dimensions (3):**
- Overall experience (1-5) — replaces the composite
- Value for money (1-5)
- Internet reliability (1-5)

**Text review:** Keep at 500 chars. Optional, not required — rated-only reviews are valid.

**Aggregate display:** Show average across each dimension + total review count. Only show averages when ≥ 3 reviews (to avoid misleading 5.0/5 from one review).

**Moderation:** `isActive: false` flag + report mechanism (simple: increment a `reportCount` field, auto-hide at threshold = 5). No manual review queue for V1 — rely on the 500-char limit and community reporting.

**Schema compatibility with IDEA-05:** Both `CityTip` and `CityReview` go on the city page. Keep them as separate sections — tips are practical advice, reviews are subjective opinions.

## Implementation Plan

### Database Changes
```prisma
model CityReview {
  id              String   @id @default(cuid())
  createdAt       DateTime @default(now())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  citySlug        String
  city            City     @relation(fields: [citySlug], references: [slug])
  overallRating   Int      // 1-5
  valueRating     Int      // 1-5
  internetRating  Int      // 1-5
  content         String?  @db.VarChar(500)
  isActive        Boolean  @default(true)
  reportCount     Int      @default(0)

  @@unique([userId, citySlug])
  @@index([citySlug, isActive])
}
```

### API Endpoints
**`apps/nomad/src/server/api/reviews/city/[slug].get.ts`** — GET, public
- Returns reviews + aggregate averages for a city
- Aggregate: `prisma.cityReview.aggregate({ where: { citySlug, isActive: true }, _avg: { overallRating, valueRating, internetRating }, _count: { _all: true } })`
- Returns recent 10 reviews with (anonymized) user info — `select { overallRating, valueRating, internetRating, content, createdAt, userId }` — no username for privacy
- Does not return content if `reportCount >= 5`

**`apps/nomad/src/server/api/reviews/index.post.ts`** — POST, protected
- Body: `{ citySlug, overallRating, valueRating, internetRating, content? }`
- Validates ratings are 1–5 integers
- Upsert (user can update their own review)

**`apps/nomad/src/server/api/reviews/[id]/report.post.ts`** — POST, protected
- Increments `reportCount`; sets `isActive: false` if count ≥ 5

### Frontend Components/Pages
**New file**: `apps/nomad/src/components/CityReviews.vue`
- Aggregate ratings display (stars + average per dimension)
- Review list (most recent first, hidden if reportCount ≥ 5)
- Review submission form (auth-gated)
- Report button per review

**Modify** `apps/nomad/src/pages/cities/[slug].vue` (or `[slug]/index.vue`)
- Add `<CityReviews :city-slug="slug" />` section

**New file**: `apps/nomad/src/composables/useCityReviews.ts`
- Wraps aggregate query + mutation

### i18n Changes
Add to all locale files:
```json
"reviews": {
  "title": "Community Reviews",
  "addReview": "Write a review",
  "overallRating": "Overall",
  "valueRating": "Value for money",
  "internetRating": "Internet reliability",
  "optional": "Optional comment",
  "signInToReview": "Sign in to write a review",
  "noReviews": "Be the first to review {city}",
  "totalReviews": "{count} review | {count} reviews",
  "report": "Report",
  "minRatings": "Shown after {min}+ reviews"
}
```

## Dependencies
- IDEA-17 (Public Profiles): reviews authored by a user appear on their profile.

## Notes
- Show aggregate ratings only when ≥ 3 reviews exist — prevents misleading 5.0 from one vote.
- Anonymize reviews — show "Nomad #1234" not usernames, for privacy.
- One review per user per city — enforced by `@@unique([userId, citySlug])`.
- V2: Add remaining dimensions (safety felt, vibe, ease of arrival) once review volume is established.
