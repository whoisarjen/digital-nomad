# IDEA-06: Activate Referral System
**Status:** PARTIAL (schema only)
**Priority:** 6/23
**Complexity:** S

## What's Already Implemented
- `User.referralCode String @unique @default(cuid())` — exists, auto-populates ✅
- `User.referredBy String?` — exists ✅
- `registerSchema.referralCode` field in `global.schema.ts` — dead code from a never-built email/password flow

Everything else — sign-up capture, dashboard section, API endpoints — is **not built at all**. The "80% built" claim from the original spec is overstated.

## Revised Analysis
**Core challenge: auth flow.** The app uses Google OAuth only via `next-auth` + `PrismaAdapter`. When a user signs in via Google for the first time, `PrismaAdapter` auto-creates the `User` record with no hook to inject arbitrary data (like a referral code from a URL param).

**Solution: cookie-based referral capture.**
1. User visits `/join?ref=SOMECODE`
2. A Nuxt server middleware sets a short-lived cookie: `nomad_ref=CODE; Max-Age=600; SameSite=Lax`
3. Cookie survives the OAuth redirect round-trip
4. In the `jwt` callback (fires on first sign-in when `user` object is present), read the cookie and update `User.referredBy` if still null

**Referral counting:** `prisma.user.count({ where: { referredBy: session.user.referralCode } })` — no extra schema needed.

**Skip "gate feature behind 3 invites" for V1** — adds friction to an untested feature. Ship display + tracking first.

**`registerSchema.referralCode`** is dead code — do not build email/password auth just for referrals. Leave the schema field as-is.

## Implementation Plan

### Database Changes
None. Fields already exist.

### API Endpoints
**New file**: `apps/nomad/src/server/api/referrals/count.get.ts`
- Protected via `defineProtectedEventHandler`
- Returns `{ count: number }`:
  ```ts
  prisma.user.count({ where: { referredBy: session.user.referralCode } })
  ```
- Verify `session.user.referralCode` is in the session object (the session callback returns full user from DB — should include it)

**New file**: `apps/nomad/src/server/middleware/referral.ts`
- On any request to `/join` with `?ref=` query param
- Sets cookie: `nomad_ref=REFCODE; Path=/; Max-Age=600; SameSite=Lax; HttpOnly`

**Modify** `apps/nomad/src/server/api/auth/[...].ts`
- In the `jwt` callback, when `user` object is present (= first sign-in):
  ```ts
  const refCode = getCookie(event, 'nomad_ref')
  if (refCode && !existingUser.referredBy) {
    await prisma.user.update({
      where: { id: user.id },
      data: { referredBy: refCode },
      select: { id: true }, // select rule
    })
    deleteCookie(event, 'nomad_ref')
  }
  ```
- **Do NOT touch the existing `include` in the session callback** — pre-existing violation, don't fix it here (risks breaking session shape)

### Frontend Components/Pages
**New file**: `apps/nomad/src/components/dashboard/Referral.vue`
- Follow exact visual pattern of `NomadIdentity.vue` (white card, border, consistent typography)
- Shows: "Invite friends" heading, copyable referral link `https://nomad.whoisarjen.com/join?ref={referralCode}`, referral count from `useReferralCount()`
- Copy-to-clipboard button with "Copied!" feedback

**Modify** `apps/nomad/src/pages/dashboard.vue`
- Add `<DashboardReferral />` after `NomadIdentity` section

**Modify** `apps/nomad/src/pages/join.vue`
- Read `route.query.ref` on mount
- The server middleware handles the cookie — the join page just needs to ensure it doesn't strip the `?ref=` param before the OAuth redirect

**New file**: `apps/nomad/src/composables/useReferralCount.ts`
- Wraps `useCustomQuery` for `/api/referrals/count`
- `lazy: true` so it doesn't block dashboard render

### i18n Changes
Add to all locale files:
```json
"referral": {
  "title": "Invite Friends",
  "subtitle": "Share your link and grow the community",
  "yourLink": "Your referral link",
  "copy": "Copy",
  "copied": "Copied!",
  "referredCount": "{count} friends joined",
  "noReferrals": "No referrals yet — share your link!"
}
```

## Dependencies
None.

## Notes
- `referralCode` is already `cuid()` generated for every existing user — no backfill needed.
- Cookie max-age of 600s (10 minutes) prevents stale referral attribution.
- The `registerSchema.referralCode` field in `global.schema.ts` is dead code — consider removing in a separate cleanup PR.
- Verify `session.user.referralCode` is exposed before wiring the count endpoint.
