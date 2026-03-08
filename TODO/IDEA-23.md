# IDEA-23: Neighborhood Guides
**Status:** NOT_STARTED
**Priority:** 23/23
**Complexity:** XL

## What's Already Implemented
Nothing. No `Neighborhood` model, no neighborhood endpoints, no neighborhood pages.

## Revised Analysis
**Lowest priority for a reason.** Neighborhood data is:
- Entirely editorial (no automated data source)
- Rapidly stale (rents change, vibes shift)
- Requires local knowledge per city
- Needs manual maintenance indefinitely

**Minimal viable approach:** Do NOT attempt all 20 cities × 5 neighborhoods = 100 entries from the start. Instead:
- Start with **3 cities** (Lisbon, Chiang Mai, Medellin — the most-searched nomad cities)
- **3 neighborhoods each = 9 entries** as a pilot
- Validate traffic/engagement before expanding

**URL structure:** After [removed] restructures city pages to `[slug]/index.vue`, neighborhoods naturally fit at `[slug]/neighborhoods/[neighborhoodSlug].vue`. The index at `[slug]/neighborhoods/` lists all neighborhoods for that city.

**Data format:** Neighborhood descriptions should be written like blog posts, not just structured data. A 200-word editorial description with a clear "nomad recommendation" makes these pages more valuable than a data table.

**Vibe tags as enum vs free-text:** Use a fixed enum of vibe tags (QUIET, SOCIAL, ARTSY, AFFORDABLE, CENTRAL, EXPAT_FRIENDLY, LOCAL) rather than `String[]` — easier to filter and display consistently.

**User submissions for scaling:** Once the editorial approach is validated, open submissions similar to IDEA-19 (Coworking). Submissions need admin approval for quality control.

## Implementation Plan

### Database Changes
```prisma
enum NeighborhoodVibe {
  QUIET
  SOCIAL
  ARTSY
  AFFORDABLE
  CENTRAL
  EXPAT_FRIENDLY
  LOCAL
}

model Neighborhood {
  id           String              @id @default(cuid())
  citySlug     String
  city         City                @relation(fields: [citySlug], references: [slug])
  slug         String
  nameEn       String
  namePl       String?
  descriptionEn String?            @db.VarChar(1000)
  descriptionPl String?            @db.VarChar(1000)
  avgRentUsd   Decimal?            @db.Decimal(10, 2)
  vibes        NeighborhoodVibe[]
  walkability  Int?                // 1-10

  @@unique([citySlug, slug])
  @@index([citySlug])
}
```

### API Endpoints
**`apps/nomad/src/server/api/cities/[slug]/neighborhoods.get.ts`** — GET, public
- Returns all neighborhoods for a city
- Uses `getLocale()` + `getLocalizedSelect()` for bilingual description
- `select: { slug, nameEn/namePl as name, descriptionEn/namePl as description, avgRentUsd, vibes, walkability }`

**`apps/nomad/src/server/api/cities/[slug]/neighborhoods/[neighborhoodSlug].get.ts`** — GET, public
- Returns single neighborhood detail

### Frontend Components/Pages
**New file**: `apps/nomad/src/pages/cities/[slug]/neighborhoods/index.vue`
- List of neighborhoods with vibe tags, avg rent, walkability score
- `useHead` with SEO targeting "[city] neighborhoods for digital nomads"

**New file**: `apps/nomad/src/pages/cities/[slug]/neighborhoods/[neighborhoodSlug].vue`
- Full neighborhood guide: description, avg rent, walkability, vibe tags
- Full SEO with JSON-LD

**Modify** `apps/nomad/src/pages/cities/[slug]/index.vue`
- Add "Neighborhoods" section with 2-3 featured neighborhoods and link to full list

**New file**: `packages/db/prisma/seeds/neighborhoods.ts`
- Seed data for 3 pilot cities (Lisbon, Chiang Mai, Medellin)
- 3 neighborhoods each

### i18n Changes
Add to all locale files:
```json
"neighborhoods": {
  "title": "Neighborhoods in {city}",
  "heading": "Where to Stay in {city}",
  "avgRent": "Avg rent: ${price}/mo",
  "walkability": "Walkability: {score}/10",
  "vibes": {
    "QUIET": "Quiet",
    "SOCIAL": "Social",
    "ARTSY": "Artsy",
    "AFFORDABLE": "Affordable",
    "CENTRAL": "Central",
    "EXPAT_FRIENDLY": "Expat-friendly",
    "LOCAL": "Local vibe"
  },
  "seeAll": "All neighborhoods in {city}"
}
```

## Dependencies
- [removed]: City page restructure to `[slug]/index.vue` is a prerequisite for the nested URL structure.

## Notes
- Start with 3 cities, 3 neighborhoods each — validate before scaling.
- Neighborhood descriptions need to be editorial quality, not just structured data. Consider writing them as mini blog posts.
- `avgRentUsd` is highly volatile — label it "approximate" and show last-updated date.
- NomadList's neighborhood feature is "broken" (per the spec) — this is a real competitive opportunity if done well for top cities.
- Do NOT attempt to build this at scale before validating the editorial pilot. 9 well-written neighborhoods beat 100 skeletal entries.
