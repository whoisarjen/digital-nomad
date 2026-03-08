# IDEA-28: Weekly Email Newsletter
**Status:** NOT_STARTED
**Priority:** 28/28
**Complexity:** M

## What's Already Implemented
Nothing. No `NewsletterSubscriber` model, no email library, no newsletter endpoints. Cron infrastructure exists in `apps/collector/` — but newsletter cron belongs in `apps/nomad/` (user data + content are there).

## Revised Analysis
**Schema IS required** — the original idea undersells this. A `NewsletterSubscriber` model with status enum is needed.

**Double opt-in is legally required** for EU users (the site has PL locale, so EU audience is certain). This adds a `confirmationToken` field and a `/api/newsletter/confirm.get.ts` endpoint.

**Resend SDK** is the right choice — clean TypeScript SDK, generous free tier (3K/month), standard in Nuxt/Vercel ecosystem. Not yet installed.

**Cron location:** Add to `apps/nomad/` — create/extend `vercel.json` with cron config. The newsletter is user-facing, not a data pipeline task.

**Weekly content queries** are trivial with existing Prisma patterns:
- Top 3 cities: `prisma.monthSummary.findMany({ orderBy: { totalScore: 'desc' }, take: 3, ... })`
- Cheapest with fast internet: `prisma.city.findFirst({ where: { internetSpeedCity: { gte: 20 } }, orderBy: { costForNomadInUsd: 'asc' } })`
- New blog posts: `prisma.article.findMany({ where: { publishedAt: { gte: sevenDaysAgo } }, take: 3 })`

**Unsubscribe token:** Separate stable `unsubscribeToken` field (different from `confirmationToken` which expires) — avoids token expiry issues for unsubscribes.

## Implementation Plan

### Database Changes
```prisma
enum SubscriberStatus {
  PENDING
  ACTIVE
  UNSUBSCRIBED
}

model NewsletterSubscriber {
  id                String           @id @default(cuid())
  email             String           @unique
  status            SubscriberStatus @default(PENDING)
  confirmationToken String?          @unique
  unsubscribeToken  String           @unique @default(cuid())
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @default(now()) @updatedAt

  @@index([status])
}
```

### API Endpoints
**`apps/nomad/src/server/api/newsletter/subscribe.post.ts`**
- Accepts `{ email: string }` body, Zod validated
- Creates subscriber with `status: PENDING`, sends confirmation email via Resend
- Returns `{ success: true }` always (no email enumeration)

**`apps/nomad/src/server/api/newsletter/confirm.get.ts`**
- Reads `?token=` from query
- Sets `status: ACTIVE`, clears `confirmationToken`
- Redirects to `/?subscribed=1`

**`apps/nomad/src/server/api/newsletter/unsubscribe.get.ts`**
- Reads `?token=` from query
- Sets `status: UNSUBSCRIBED`
- Redirects to `/?unsubscribed=1`

**`apps/nomad/src/server/api/cron/newsletter.post.ts`**
- Secured via `CRON_SECRET` header check
- Queries active subscribers (`select { email, unsubscribeToken }` only — never log emails)
- Builds content: top 3 cities, cheapest fast-internet city, new blog posts
- Sends batch via `resend.batch.send()`
- Returns `{ sent: N, errors: M }`

### Frontend Components/Pages
**New file**: `apps/nomad/src/components/NewsletterSignup.vue`
- Single email input + submit button
- Calls `/api/newsletter/subscribe` via `$fetch`
- Success state: "Check your email to confirm"
- Inline error for invalid email

**Integrate into:**
- `apps/nomad/src/pages/index.vue` — section between features grid and explore
- `apps/nomad/src/pages/cities/[slug].vue` — bottom of city detail pages

### Infrastructure
Add to `apps/nomad/vercel.json` (create if missing):
```json
{
  "crons": [{ "path": "/api/cron/newsletter", "schedule": "0 9 * * 1" }]
}
```
Add env vars to Vercel: `RESEND_API_KEY`, `CRON_SECRET`

Install: `npm install resend` in `apps/nomad/`

### i18n Changes
Add to all locale files:
```json
"newsletter": {
  "title": "Stay in the loop",
  "subtitle": "Weekly picks: best cities, cheapest gems, and new guides.",
  "placeholder": "your@email.com",
  "subscribe": "Subscribe",
  "successTitle": "Check your inbox",
  "successSubtitle": "Confirmation link sent to {email}",
  "gdprNote": "No spam. Unsubscribe anytime."
}
```

## Dependencies
None blocking. Benefits from IDEA-13 (referral) for cross-promotion.

## Notes
- Resend free tier: 3K/month. Plan for paid at ~600 active subscribers.
- `confirmationToken` should expire after 24h — enforce in application logic, not DB schema.
- Never log subscriber email addresses in cron output.
- Unsubscribe link is legally required in every email (CAN-SPAM + GDPR). Include in HTML footer.
