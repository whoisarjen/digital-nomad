# IDEA-33: Public Data API

**Status:** NOT_STARTED
**Priority:** 33/39
**Complexity:** L

## What's Already Implemented

Nothing. There is no API key model, no rate limiting middleware, no public-facing `/api/public/` route directory, and no developer documentation page. The existing server endpoints all serve the internal Nuxt frontend or protected user-session flows. The auth system is session-cookie-based (`next-auth`), not token-based, which means API key authentication would require a net-new auth layer built alongside the session system.

Existing public endpoints that the Data API would expose are already structurally present:
- `GET /api/cities/index.get.ts` — city list with filters
- `GET /api/cities/[slug].get.ts` — city detail
- `GET /api/compare/[slugs].get.ts` — city comparison
- `GET /api/regions/[region].get.ts` — region rankings

These can be adapted (not duplicated) as public API endpoints, but they currently return internal-format responses and have no rate limiting.

## Revised Analysis

The original plan is directionally correct but underestimates complexity. Several concerns:

**Prerequisites are not met.** This is designated Phase 2, but the concrete prerequisite is traffic and user trust — not just code. Shipping an API before achieving meaningful organic traffic means building infrastructure for zero consumers. The recommendation is to not start this until the site has established SEO traction (blog content, 10k+ monthly visits).

**Rate limiting on Vercel serverless is non-trivial.** The standard approach is a Redis-backed counter (Upstash is the Vercel-native choice). There is no Redis/KV store in this stack today. Adding Upstash means a new dependency, new environment variable, and a new edge middleware pattern. The collector app's `vercel.json` has no cron entries yet, so there is no existing rate-limit infrastructure at all.

**API key model placement.** The `ApiKey` model belongs in `packages/db/prisma/schema.prisma` alongside User. The key needs to be hashed at rest (store a `keyHash`, return the raw key once at creation). The model as sketched in the idea stores the raw key — that is a security issue that needs addressing in the design.

**The free/paid tier pricing is a product decision, not a technical one.** $19/month is a reasonable starting point, but payment processing (Stripe) is not in the stack. That is another new dependency. The free tier (100 req/day) alone can be shipped without Stripe by using a hard limit enforced in middleware.

**A simpler first step:** Ship a free-only tier with an API key that is just a read-only credential (no payment). This generates developer interest, backlinks, and lets you validate demand before adding Stripe. Paid tier can be bolted on later once the free tier has users.

**Recommendation:** Do not start this until at least IDEA-36 and a few content/SEO ideas are shipped. When you do start, the correct order is: (1) schema + key management UI, (2) rate limit middleware using Upstash, (3) public endpoint wrappers, (4) docs page, (5) payment/paid tier.

## Implementation Plan

### Database Changes

Add to `packages/db/prisma/schema.prisma`:

```prisma
model ApiKey {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  keyHash      String   @unique  // bcrypt or SHA-256 hash — never store raw key
  name         String            // user-assigned label e.g. "My App"
  isActive     Boolean  @default(true)
  tier         String   @default("free")  // "free" | "paid"
  requestCount Int      @default(0)       // lifetime counter (coarse; real rate limit in Redis)
  lastUsedAt   DateTime?
  createdAt    DateTime @default(now())

  @@index([userId])
}
```

Also add the inverse relation to `User`:
```prisma
apiKeys ApiKey[]
```

### API Endpoints

All public endpoints live under `apps/nomad/src/server/api/v1/` to namespace them away from internal endpoints.

New rate-limit middleware:
- `apps/nomad/src/server/middleware/api-key-auth.ts` — validates `Authorization: Bearer <key>` header, enforces daily request quota via Upstash Redis, attaches tier to event context

Public endpoint wrappers (adapt internal endpoints, do not duplicate):
- `apps/nomad/src/server/api/v1/cities/index.get.ts` — city list (limited fields, no session-specific data)
- `apps/nomad/src/server/api/v1/cities/[slug].get.ts` — city detail
- `apps/nomad/src/server/api/v1/compare/[slugs].get.ts` — city comparison
- `apps/nomad/src/server/api/v1/rankings.get.ts` — top cities by total score for current month

Key management (dashboard-protected):
- `apps/nomad/src/server/api/dashboard/api-keys/index.get.ts` — list user's keys
- `apps/nomad/src/server/api/dashboard/api-keys/create.post.ts` — generate new key (returns raw key once)
- `apps/nomad/src/server/api/dashboard/api-keys/[id].delete.ts` — revoke key

### Frontend Components/Pages

- `apps/nomad/src/pages/developers.vue` — documentation page (static, no i18n needed for v1, EN only)
- `apps/nomad/src/components/dashboard/ApiKeyManager.vue` — list/create/revoke keys in dashboard
- Extend `apps/nomad/src/pages/dashboard.vue` to include the ApiKeyManager section

### i18n Changes

Minimal for v1 — the developer docs page can be EN-only. Dashboard additions:

`apps/nomad/src/locales/en.json` additions:
```json
"apiKeys": {
  "title": "API Keys",
  "create": "Generate Key",
  "revoke": "Revoke",
  "name": "Key name",
  "created": "Created",
  "lastUsed": "Last used",
  "never": "Never",
  "copyWarning": "Copy this key — it will not be shown again.",
  "freeLimit": "100 requests/day on free tier"
}
```

## Dependencies

- No IDEA dependencies (standalone)
- New infrastructure dependency: Upstash Redis for rate limiting (or alternative KV store)
- Future dependency: Stripe for paid tier billing
- Should be built only after the site has meaningful traffic — this is Phase 2

## Notes

- **Do not start this before the site has traffic.** Building API infrastructure for zero consumers is wasted effort at this stage (priority 33/39 is appropriate).
- The `keyHash` approach is critical — store `SHA-256(rawKey)`, return `rawKey` exactly once on creation. If a user loses it, they generate a new one.
- The rate limit window should be a rolling 24-hour window, not a calendar day, to be fair to users in all timezones.
- Upstash free tier covers ~10k requests/day which is sufficient to bootstrap this.
- The `/api/v1/` namespace keeps public API responses fully independent from internal endpoint response shape, so both can evolve without breaking each other.
- Do not expose favorites, user data, or any session-scoped endpoints through the public API.
