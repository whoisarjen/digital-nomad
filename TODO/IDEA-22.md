# IDEA-22: City Forum / Q&A
**Status:** NOT_STARTED — BLOCKED (traffic gate)
**Priority:** 22/23
**Complexity:** XL

## What's Already Implemented
Nothing. No `Thread` or `Reply` models, no forum endpoints, no forum UI.

## Revised Analysis
**Explicitly gated: only build at 500+ active users.** An empty forum is actively harmful — it signals a ghost town and hurts credibility. This idea should not be picked up until:
1. The site has 500+ active registered users
2. IDEA-05 (City Tips) has been live for at least 3 months to establish UGC culture
3. IDEA-01 (Check-ins) is live to provide a community signal

**High maintenance overhead:** Forums require moderation, spam prevention, email notifications, and ongoing community management. These are real ongoing costs beyond the initial implementation.

**Consider IDEA-05 as the substitute:** City Tips (short, categorized, upvoteable) covers 80% of the Q&A use case with significantly lower moderation burden. Build IDEA-05 first and assess whether a full forum is still needed.

**If building:**
- The 6-month auto-expire on threads is a good design — prevents stale questions from cluttering the page
- Email notifications on replies are table stakes — requires IDEA-04 (Newsletter/Resend) infrastructure first
- Spam prevention: rate limiting (1 thread per user per city per 24 hours), email verification requirement before posting

## Implementation Plan (when unblocked)

### Database Changes
```prisma
model Thread {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  citySlug  String
  city      City     @relation(fields: [citySlug], references: [slug])
  title     String   @db.VarChar(200)
  content   String   @db.VarChar(1000)
  isActive  Boolean  @default(true)
  expiresAt DateTime // createdAt + 6 months

  replies   Reply[]

  @@index([citySlug, isActive, createdAt])
}

model Reply {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  threadId  String
  thread    Thread   @relation(fields: [threadId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  content   String   @db.VarChar(1000)
  upvotes   Int      @default(0)
}
```

### API Endpoints
- `GET /api/forum/city/[slug]` — paginated thread list
- `POST /api/forum/threads` — create thread (protected, rate-limited)
- `GET /api/forum/threads/[id]` — thread with replies
- `POST /api/forum/threads/[id]/replies` — add reply (protected)
- `POST /api/forum/replies/[id]/vote` — upvote reply (protected)
- `POST /api/forum/threads/[id]/report` — report thread (protected)
- Cron: expire threads older than 6 months (set `isActive: false`)

### Frontend Components/Pages
- `apps/nomad/src/components/CityForum.vue` — thread list + new thread form on city page
- `apps/nomad/src/pages/forum/[citySlug]/[threadId].vue` — thread detail page
- Email notification on reply (via Resend, requires IDEA-04)

## Dependencies
- **BLOCKED until 500+ active users**
- IDEA-05 (City Tips) — build and validate first; may obviate forum need
- IDEA-04 (Newsletter/Resend) — required for email notifications
- IDEA-01 (Check-ins) — provides community signal prerequisite

## Notes
- Do not start implementation until the traffic/user gate is met.
- Consider IDEA-05 as a permanent substitute rather than a stepping stone.
- If building: implement strict rate limiting and spam prevention before launch. Empty posts, spam, and low-quality questions are worse than no forum.
- The 6-month auto-expire is a strong design decision — keep it. Stale questions are confusing and reduce trust.
