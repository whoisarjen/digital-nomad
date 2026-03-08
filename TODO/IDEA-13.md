# IDEA-13: Digital Nomad Visa Directory
**Status:** NOT_STARTED
**Priority:** 13/23
**Complexity:** XL

## What's Already Implemented
Nothing. No `CountryVisa` model, no `/pages/visas/` directory, no visa-related fields on `City` or any other model. Confirmed by grepping the entire schema and source tree.

## Revised Analysis

### The original plan is right but the scope is too ambitious for a first pass

The proposed `CountryVisa` model is country-level data, but the existing data model is entirely city-level. This creates a structural mismatch that needs to be resolved upfront. The `City` model has `countryCode` and `countrySlug` fields, which provides the join key, but there is no `Country` model — countries are just denormalized strings on `City`. Before building visa pages, you need to decide whether to create a proper `Country` model or attach `CountryVisa` as a standalone model keyed by `countryCode`.

**Recommendation: standalone `CountryVisa` keyed by `countryCode`** — simpler, no migration of existing city data, and countryCode (ISO-2) is already on every `City` row. This avoids creating a `Country` model just for visas.

### Data is the real blocker, not the schema

The schema is the easy part (one afternoon). The hard part is sourcing accurate, legally defensible visa data for even 30 countries across three passport types (US/EU/UK). Visa-free day counts change with bilateral treaties. A stale "90 days visa-free" entry for a country that just changed its policy is actively harmful. Every row needs a source URL and an `updatedAt` to surface staleness. The original plan mentions "legal accuracy matters — add disclaimers" but does not solve the freshness problem.

**Recommendation: add a `sourceUrl` and `verifiedAt` field to each row, and show a visible "Last verified: [date]" on every entry in the UI.** This is table stakes for legal defensibility.

### The `/visas` index with passport selector is high-effort UI for low immediate SEO return

The higher-value SEO play is adding a compact "Visa Info" card directly on existing city pages (which already rank). This surfaces visa data on pages that already have traffic without needing to build and index an entirely new section. Build the city-page card first, defer the full `/visas` directory index until you have data for 30+ countries.

### Schengen vs nomad visa are two different user intents

`isSchengen` is a binary flag that answers "can I stay 90 days in Schengen with US/EU/UK passport?" — this is mostly static and easy. The nomad visa fields (`hasNomadVisa`, `nomadVisaCost`, etc.) answer a completely different question and the data is much harder to source and keep current. Split these into separate display sections in the UI with separate "last verified" timestamps.

### The passport selector (US/EU/UK) is important but requires careful i18n handling

The selector label and visa-free day copy must be translated in all 11 locales. The data itself (day counts, links) is not localized — it is factual. Only UI labels need locale keys.

## Implementation Plan

### Database Changes

Add to `packages/db/prisma/schema.prisma`:

```prisma
model CountryVisa {
  countryCode String @id  // ISO 3166-1 alpha-2, matches City.countryCode

  // Visa-free days (-1 = visa required, 0 = e-visa, positive = visa-free days)
  visaFreeUsaDays Int?
  visaFreeEuDays  Int?
  visaFreeUkDays  Int?

  // Schengen Area membership
  isSchengen Boolean @default(false)

  // Tax residency threshold
  taxThresholdDays Int?  // days before potential tax residency triggered

  // Digital nomad visa
  hasNomadVisa       Boolean  @default(false)
  nomadVisaCostUsd   Int?     // approximate annual cost in USD
  nomadVisaDurationMonths Int? // visa validity in months
  nomadVisaIncomeUsd Int?     // minimum monthly income requirement in USD
  nomadVisaLink      String?  // official government URL

  // Data provenance
  sourceUrl   String?
  verifiedAt  DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt
}
```

No relation from `City` to `CountryVisa` is needed — join happens at the API layer via `countryCode`.

### API Endpoints

- `apps/nomad/src/server/api/visa/[countryCode].get.ts`
  - Returns full `CountryVisa` row for a given ISO country code
  - Used by the city detail page to show the visa card
  - Returns `null` if no record exists (not all countries will have data initially)

- `apps/nomad/src/server/api/visa/index.get.ts`
  - Returns all `CountryVisa` rows ordered by `countryCode`
  - Used by the `/visas` directory index page
  - Query params: `passport` (us | eu | uk), `hasNomadVisa` (boolean), optional region filter

### Frontend Components/Pages

**Phase 1 — city page integration (build this first):**
- `apps/nomad/src/components/CityVisaCard.vue`
  - New section card on `/cities/[slug]` page, placed after "Quality of Life" card
  - Shows visa-free days for all three passports in a three-column layout
  - Shows nomad visa summary block (cost, duration, income, link) if `hasNomadVisa`
  - Shows Schengen badge and tax threshold note
  - Shows "Last verified: [date]" and source link
  - Shows disclaimer: "This is informational only. Always verify with official sources."
  - Renders nothing (hidden) if no `CountryVisa` record exists for that country

**Phase 2 — visa directory (build after 30+ countries are seeded):**
- `apps/nomad/src/pages/visas/index.vue`
  - Full directory with passport selector tabs (US / EU / UK)
  - Filterable table: visa-free days, has nomad visa, region
  - Link to country's city pages

### i18n Changes

Add to all 11 locale files (`en.json`, `pl.json`, etc.):

```json
"visa": {
  "title": "Visa Information",
  "passportUs": "US Passport",
  "passportEu": "EU Passport",
  "passportUk": "UK Passport",
  "visaFreeDays": "{days} days visa-free",
  "visaRequired": "Visa required",
  "eVisaAvailable": "e-Visa available",
  "isSchengen": "Schengen Area",
  "taxThreshold": "Tax residency after {days} days",
  "nomadVisa": "Nomad Visa Available",
  "nomadVisaCost": "~${cost}/year",
  "nomadVisaDuration": "{months} months",
  "nomadVisaIncome": "Min. income: ${income}/mo",
  "nomadVisaApply": "Apply / Official Info",
  "verifiedAt": "Last verified: {date}",
  "disclaimer": "Visa rules change. Always verify with official government sources before travel.",
  "noData": "Visa data not yet available for this country."
}
```

### Sitemap Changes

- `apps/nomad/src/server/api/__sitemap__/visas.ts` — enumerate all visa directory pages once Phase 2 is built
- Add `/api/__sitemap__/visas` to the `sources` array in `nuxt.config.ts`

## Dependencies
- No hard dependencies on other IDEAs
- Soft dependency: having `/cities/[slug]` pages already ranking well makes Phase 1 (city card) immediately valuable

## Notes

- **Start with Phase 1 only.** Seed data for 10-15 countries where the nomad visa program is well-known (Portugal, Thailand, Indonesia/Bali, Georgia, Croatia, Costa Rica, UAE, Estonia, Czech Republic, Hungary, Mexico) and ship the city-page card. This gives real SEO value on day one with minimal surface area.
- **Do not build `/visas/index.vue` until you have 30+ country rows.** A directory with 10 rows looks thin and does not rank.
- **Encoding convention for visa-free days:** use `-1` for "visa required, no e-visa", `0` for "e-visa available", and a positive integer for visa-free days. This keeps the column a single `Int?` instead of a string enum.
- **EU passport complexity:** "EU passport" is not a single thing — a French passport and a Romanian passport have different visa-free access in some countries. For simplicity, use the Schengen passport baseline (worst-case EU access). Note this limitation in the UI.
- **The `nomadVisaLink` must point to the official government URL**, not a third-party blog post, to maintain credibility.
- This feature is high-effort primarily due to data collection, not engineering. Budget 3-4 hours for the schema + API + city card, and much more time for ongoing data maintenance.
