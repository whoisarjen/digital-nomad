# IDEA-19: Coworking Space Directory

**Status:** NOT_STARTED
**Priority:** 19/23
**Complexity:** L

## What's Already Implemented

Nothing. The Prisma schema has no `CoworkingSpace` model. There are no coworking-related pages, API endpoints, or components anywhere in the codebase.

## Revised Analysis

The original idea is directionally correct — coworking data is high-value for digital nomads — but the **admin approval workflow is the critical risk**. There is currently no admin panel, no admin role on the `User` model, no admin middleware, and no admin routes anywhere in the app. Building a submission-to-approval pipeline from scratch is a significant hidden dependency.

**Admin workflow reality check.** The current auth system (`@sidebase/nuxt-auth` + `next-auth`) stores a simple `User` with no `role` or `isAdmin` field. To do even minimal manual approval you need: (1) an `isAdmin` flag on `User`, (2) a protected admin API endpoint to list unapproved spaces and flip `isApproved`, and (3) some admin UI or at minimum a direct DB workflow via Prisma Studio. Given the project is solo-operated, the lightest viable path is: skip the admin UI entirely and approve directly in the DB (Prisma Studio or a one-off SQL UPDATE). The API only ever exposes `isApproved: true` records to the frontend, so bad submissions are invisible without approval.

**Schema simplification.** The proposed schema stores `submittedBy` as a plain string. This is fine for a first version, but linking to `userId` (String, FK to User) is strictly better — it enables rate-limiting submissions per user and eventually showing users their pending submissions. The tradeoff is requiring auth to submit, which is acceptable given the existing auth system.

**WiFi speed** is notoriously self-reported and unreliable. Drop the `wifiSpeed` field from the initial schema; it adds noise without a verification mechanism. Bring it back if you add a Speedtest.net-style check-in flow later.

**Vibe tags** from the proposal are a `String[]` in Postgres (array column). This is supported by Prisma. Keep it — it's the main differentiator from existing coworking databases.

**Rating/votes.** The proposal says "sort by rating/votes" but the schema has no rating or vote fields — these would be a second-phase addition. For V1, sort by `createdAt desc` among approved spaces.

**i18n scope.** The `name`, `address`, and potentially any `notes` field are inherently user-generated English-only content. No bilingual field pattern needed here — it would be meaningless. Section headings and UI labels need i18n across the 11 locales.

**SEO note.** Individual coworking space pages are not worth building initially. The section on the city page is sufficient. If the dataset grows to 50+ spaces per city, a standalone `/cities/[slug]/coworking` page would make sense.

**Effort realism.** Despite "Medium" effort in the brief, this is a genuine L due to the form, submission flow, moderation-by-DB, approval-aware queries, and new city page section — all with zero existing scaffolding.

## Implementation Plan

### Database Changes

Add to `packages/db/prisma/schema.prisma`:

```prisma
model CoworkingSpace {
  id          String   @id @default(cuid())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @default(now()) @updatedAt

  citySlug    String
  city        City     @relation(fields: [citySlug], references: [slug], onDelete: Cascade)

  name        String
  address     String?
  dailyPrice  Decimal? @db.Decimal(8, 2)
  monthlyPrice Decimal? @db.Decimal(8, 2)
  vibeTags    String[]
  isApproved  Boolean  @default(false)

  submittedById String?
  submittedBy   User?   @relation(fields: [submittedById], references: [id], onDelete: SetNull)

  @@index([citySlug, isApproved])
}
```

Also add the reverse relation to `City`:
```prisma
coworkingSpaces CoworkingSpace[]
```

And to `User`:
```prisma
coworkingSpaces CoworkingSpace[]
```

User runs `prisma db push` as usual.

### API Endpoints

**List approved coworking spaces for a city:**
- `apps/nomad/src/server/api/coworking/[citySlug].get.ts`
- Public, no auth required
- Returns only `isApproved: true` records, ordered by `createdAt desc`
- `select`: `id`, `name`, `address`, `dailyPrice`, `monthlyPrice`, `vibeTags`, `createdAt`

**Submit a new coworking space:**
- `apps/nomad/src/server/api/coworking/submit.post.ts`
- Protected via `defineProtectedEventHandler` (requires auth — same pattern as `favorites/toggle.post.ts` and `features/vote.post.ts`)
- Validates body with zod schema
- Creates record with `isApproved: false`; submittedById from session

**Zod schema additions** in `apps/nomad/src/shared/global.schema.ts`:
```ts
export const getCoworkingByCitySchema = z.object({
  citySlug: z.string().min(1),
})

export const submitCoworkingSchema = z.object({
  citySlug: z.string().min(1),
  name: z.string().min(2).max(120),
  address: z.string().max(200).optional(),
  dailyPrice: z.number().positive().max(9999).optional(),
  monthlyPrice: z.number().positive().max(9999).optional(),
  vibeTags: z.array(z.string().max(30)).max(5).default([]),
})
```

### Frontend Components/Pages

**New composable:**
- `apps/nomad/src/composables/useCoworking.ts`
- Wraps `useCustomQuery` for `/api/coworking/[citySlug]`

**New component — coworking section:**
- `apps/nomad/src/components/CityCoworkingSection.vue`
- Shows list of approved spaces as cards: name, address, daily/monthly price badges, vibe tags
- Includes a "Submit a Space" button that opens a modal/drawer form
- The form is auth-gated (uses `AuthGate` component — already exists)
- Shows empty state if no approved spaces yet

**Modify city page:**
- `apps/nomad/src/pages/cities/[slug].vue`
- Add `<CityCoworkingSection :city-slug="citySlug" />` after the Related Articles widget

### i18n Changes

Add to all 11 locale files under `apps/nomad/src/locales/`:
```json
"coworking": {
  "title": "Coworking Spaces",
  "noSpaces": "No coworking spaces listed yet.",
  "submitSpace": "Submit a Space",
  "daily": "Daily",
  "monthly": "Monthly",
  "submitTitle": "Submit a Coworking Space",
  "nameLabel": "Space name",
  "addressLabel": "Address (optional)",
  "dailyPriceLabel": "Daily price (USD, optional)",
  "monthlyPriceLabel": "Monthly price (USD, optional)",
  "vibeTagsLabel": "Vibe tags (e.g. quiet, fast wifi, cafes)",
  "submitButton": "Submit for Review",
  "submitSuccess": "Thanks! Your submission is under review.",
  "pendingNote": "Listings are reviewed before appearing."
}
```

## Dependencies

No hard code dependencies on other IDEAs, but the admin approval mechanism is a soft dependency on building any admin tooling (which does not exist yet). Until an admin UI exists, approvals must be done manually via Prisma Studio or direct SQL:
```sql
UPDATE "CoworkingSpace" SET "isApproved" = true WHERE id = '...';
```

## Notes

- There is no email library in the project (`package.json` has no nodemailer, Resend, SendGrid, etc.). Email notifications for submission status are therefore impossible without adding an email dependency — skip for V1.
- The `isAdmin` check for an admin UI would require adding a `role` field to `User` or a simple `isAdmin Boolean @default(false)` field. Not worth doing just for this feature.
- Empty-state handling is critical: show "No spaces listed yet. Be the first to submit one." — an empty section with no CTA is worse than no section at all.
- Consider rate-limiting submissions per user (e.g. max 5 submissions across all cities) to prevent spam. Enforce this in the submit endpoint using `prisma.coworkingSpace.count({ where: { submittedById: userId } })` before creating.
- Do not build this until there is a clear plan for how approvals get processed. If no one is checking the queue, user submissions accumulate invisibly and the feature is dead on arrival.
