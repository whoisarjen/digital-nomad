# IDEA-19: Public Nomad Profiles
**Status:** NOT_STARTED
**Priority:** 19/23
**Complexity:** M

## What's Already Implemented
- `User.number` field exists — already used for user identity in the system
- `Favorite` model exists ([removed] adds status)
- Dashboard exists at `/pages/dashboard.vue`
- No public profile pages exist

## Revised Analysis
**Depends heavily on other IDEAs.** A profile page is only interesting if there's content to show. Priority order of content:
1. Favorite cities (already exists — VISITED/PLANNING from [removed]) — minimum viable content
2. Tips submitted (IDEA-16)
3. Reviews submitted (IDEA-18)
4. Check-in history (IDEA-14)

V1 should ship with just favorite cities (VISITED) and member since date — enough to be useful. Other content adds incrementally as those IDEAs land.

**`User.number` for URLs** (`/nomads/1234`) is clean and doesn't expose email or internal ID. This field already exists.

**Privacy controls are essential.** Users must control what's public:
- Cities visited: show/hide
- Cities planning: always hidden from public view
- Tips: show/hide
- Member since: always public

**Minimal schema change:** Add a `publicProfile` boolean flag to `User` (default: false for existing users, true for new). Plus `showVisited` boolean. No `profileVisible` toggle per-content-type for V1 — just a single "make profile public" toggle.

## Implementation Plan

### Database Changes
```prisma
// Add to User model:
publicProfile Boolean @default(false)
showVisited   Boolean @default(true)
```

### API Endpoints
**`apps/nomad/src/server/api/users/[number].get.ts`** — GET, public
- Finds user by `number` field
- Returns 404 if not found OR `publicProfile = false`
- If `showVisited = true`: returns VISITED favorites with city data (`select` only)
- Returns: `{ number, memberSince: createdAt, visitedCities: [...], tipCount: 0, reviewCount: 0 }` (tip/review counts added as those IDEAs land)

### Frontend Components/Pages
**New file**: `apps/nomad/src/pages/nomads/[number].vue`
- `defineI18nRoute({ paths: { en: '/nomads/[number]', pl: '/nomadzi/[number]' } })`
- Fetches user profile from new endpoint
- Shows: "Nomad #[number]", member since date, visited cities grid (if public)
- 404-style page if profile not found or not public
- Minimal SEO: `useHead` with title "Nomad #[number] Profile" — `noindex` for private profiles, light `index` for public ones

**New file**: `apps/nomad/src/components/dashboard/ProfileSettings.vue`
- Toggle: "Make my profile public"
- Toggle: "Show cities I've visited"
- Link to own public profile when enabled

**Modify** `apps/nomad/src/pages/dashboard.vue`
- Add `<DashboardProfileSettings />` section

**New file**: `apps/nomad/src/server/api/users/profile.patch.ts`
- Protected endpoint: updates `publicProfile` and `showVisited` for current user

### i18n Changes
Add to all locale files:
```json
"profile": {
  "title": "Nomad #{number}",
  "memberSince": "Member since {date}",
  "visitedCities": "Cities visited",
  "noVisited": "No visited cities shared",
  "makePublic": "Make my profile public",
  "showVisited": "Show cities I've visited",
  "profilePrivate": "This profile is private",
  "yourProfile": "Your profile",
  "viewProfile": "View public profile"
}
```

## Dependencies
- [removed] (Favorites Split): VISITED cities are the primary public content. Required.
- IDEA-16 (Tips): tip count/list on profile — optional, add later.
- IDEA-18 (Reviews): review count on profile — optional, add later.

## Notes
- Default `publicProfile: false` for all existing users — opt-in, not opt-out.
- The `User.number` field is already a clean integer — confirm it auto-increments or is set correctly for all users.
- "Cities planning" should NEVER be public — it reveals future plans which is private information.
- Link to profile from tip and review author bylines once IDEA-16 and IDEA-18 are built.
