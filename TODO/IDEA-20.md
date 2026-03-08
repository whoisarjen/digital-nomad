# IDEA-20: "Pack for This City" Practical Info
**Status:** NOT_STARTED
**Priority:** 20/23
**Complexity:** S

## What's Already Implemented
Nothing. No `CountryInfo` model, no practical info endpoints, no practical info UI on city pages.

## Revised Analysis
**Data is largely static and country-level.** A one-time seed script is more reliable than user submissions for this type of data — plug type, voltage, and best SIM carrier don't change often.

**Data sources (all free):**
- Plug types and voltage: Wikipedia's "Mains electricity by country" (exhaustive, stable)
- Best SIM carrier: manual research — varies by traveler experience
- Taxi apps: Grab, Bolt, Uber coverage is publicly documented
- Tipping culture: widely documented in travel guides

**Coverage:** Data for 50 countries covers ~95% of nomad destinations. This is achievable with a focused manual effort.

**Display:** Small "Practical Info" card on city pages, not a prominent section. This is utility content, not a destination feature. Collapsed by default on mobile.

**Linking to country pages** (IDEA-04): country pages would show this info prominently. City pages just show it as a utility widget.

## Implementation Plan

### Database Changes
```prisma
model CountryInfo {
  id          String  @id @default(cuid())
  countryCode String  @unique
  plugType    String? // "Type C, Type F"
  voltage     Int?    // 220
  frequency   Int?    // 50
  simCards    String? // "AIS, DTAC, TrueMove H (Thailand)"
  taxiApp     String? // "Grab"
  tipping     String? @db.VarChar(300) // "Tipping not expected. Optional 10% in tourist restaurants."
}
```

### API Endpoints
**`apps/nomad/src/server/api/cities/[slug]/practical.get.ts`** — GET, public
- Joins `City.countryCode` to `CountryInfo`
- Returns practical info for the city's country
- Returns 404 gracefully (not all countries will have data)

### Frontend Components/Pages
**New file**: `apps/nomad/src/components/CityPracticalInfo.vue`
- Props: `countryCode: string`
- Small card showing: plug types (with icon), voltage, best SIM carriers, taxi apps, tipping note
- Collapsed by default on mobile
- Show only fields that have data (some countries won't have complete data)

**Modify** `apps/nomad/src/pages/cities/[slug].vue`
- Add `<CityPracticalInfo :country-code="data.countryCode" />` near the bottom

**New file**: `packages/db/prisma/seeds/country-info.ts`
- Seed script for 50 countries
- Data from a maintained JSON file: `packages/db/prisma/seeds/data/country-info.json`

### i18n Changes
Add to all locale files:
```json
"practical": {
  "title": "Practical Info",
  "plugType": "Plug type",
  "voltage": "Voltage",
  "simCards": "Best SIM cards",
  "taxiApp": "Taxi/ride app",
  "tipping": "Tipping culture",
  "noData": "Practical info not yet available for this country"
}
```

## Dependencies
- IDEA-04 (Country Pages): practical info displays prominently on country detail pages once those exist.

## Notes
- Plug type icons (A, B, C, D, E, F, G, H, I, J, K, L, M) — use simple letter badges or unicode symbols, not images.
- The seed JSON file should be the source of truth, checked into the repo. Manual updates to JSON → re-run seed script.
- `simCards` field is a free-text string ("AIS, DTAC, TrueMove H") — not normalized. Normalization is over-engineering for this use case.
- Tipping culture is highly subjective. Keep the `tipping` note factual and brief. Cite a source if possible.
