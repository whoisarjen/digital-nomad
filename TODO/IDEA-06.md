# IDEA-06: FAQ JSON-LD on City Pages
**Status:** NOT_STARTED
**Priority:** 6/39
**Complexity:** S

## What's Already Implemented
The blog page (`apps/nomad/src/pages/blog/[slug].vue`) has a complete FAQPage JSON-LD implementation.

The compare page (`apps/nomad/src/pages/compare/[slugs].vue`) has a fully data-driven FAQPage JSON-LD implementation directly inside `useHead()` — generates 4 FAQ pairs from live city data (cost comparison, internet speed, safety, best month) without any DB-stored FAQ text. Lines 852–918 of `[slugs].vue` are the exact template to follow.

The city page (`apps/nomad/src/pages/cities/[slug].vue`) has **no `useHead()` at all** — this is where IDEA-05 and IDEA-06 both land.

## Revised Analysis
All 5–6 FAQ types can be generated from data **already returned by the existing city endpoint** — no schema changes, no new API fields needed:

- **Affordable?** → `costForNomadInUsd` ✅
- **Internet speed?** → `internetSpeedCity`, `internetSpeedCityRanking` ✅
- **Safe?** → `safety` (Level enum) ✅
- **Weather/best month?** → `monthSummary` (12-row array with `totalScore`, `apparentTemperatureMax`, `rainSum`) ✅
- **Air quality?** → `airQualityScore`, `airQualityNow` ✅

**Visible accordion on page**: NOT recommended. The city page already has 4 detailed metric sections, a weather calendar, and articles widget. FAQ accordion would clutter the page. JSON-LD only is the right call — what matters for featured snippets is the structured data, not visual rendering.

**Null guards**: Skip any FAQ entry where the underlying data is null. Match the compare page's null guard pattern exactly.

**i18n**: Use `t()` with locale keys so FAQ text adapts per locale — consistent with the app's i18n approach and the city page's existing `useCustomI18n()` import.

## Implementation Plan

### Database Changes
None.

### API Endpoints
None. All FAQ content derives from data already returned by `apps/nomad/src/server/api/cities/[slug].get.ts`.

### Frontend Components/Pages
**Modify**: `apps/nomad/src/pages/cities/[slug].vue`

Inside the `useHead()` block (added as part of IDEA-05), add FAQPage JSON-LD generation:

```ts
const faqItems: Record<string, unknown>[] = []

if (data.value.costForNomadInUsd) {
  faqItems.push({
    '@type': 'Question',
    'name': t('city.faq.affordableQuestion', { city: data.value.name }),
    'acceptedAnswer': { '@type': 'Answer', 'text': t('city.faq.affordableAnswer', { city: data.value.name, cost: data.value.costForNomadInUsd }) },
  })
}
// similar blocks for internet, safety, air quality, best month (derived from monthSummary.reduce())

if (faqItems.length > 0) {
  jsonLd.push({ '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': faqItems })
}
```

The `jsonLd` array is pushed into `script` in `useHead()` — same as blog and compare pages.

No new Vue component needed. No visible accordion on the city page.

### i18n Changes
Add to `en.json` and all locale files under `"city.faq"`:
```json
"faq": {
  "affordableQuestion": "Is {city} affordable for digital nomads?",
  "affordableAnswer": "{city} costs approximately ${cost}/month for a digital nomad lifestyle.",
  "internetQuestion": "What is the internet speed in {city}?",
  "internetAnswer": "{city} averages {speed} Mbps internet speed (ranked #{rank} globally), suitable for remote work.",
  "safetyQuestion": "Is {city} safe for digital nomads?",
  "safetyAnswer": "{city} has a {safety} safety rating based on Numbeo quality-of-life indices.",
  "weatherQuestion": "What is the weather like in {city}?",
  "weatherAnswer": "The best month to visit {city} is {month}, with temperatures around {temp}°C and {rain}mm of rain.",
  "airQualityQuestion": "What is the air quality in {city}?",
  "airQualityAnswer": "{city} has an air quality score of {score}/5 with a current AQI of {aqiNow}."
}
```

## Dependencies
- IDEA-05: Both require adding `useHead()` to the city page — implement in one pass. IDEA-06 FAQ logic slots directly into the `jsonLd` array built for IDEA-05's `useHead()`.
- IDEA-01: The "best month" FAQ uses `monthSummary` already returned by the city endpoint — no dependency on IDEA-01 being shipped first, but the month strip being present makes the FAQ feel consistent.

## Notes
- 5 FAQ entries is the right count (affordability, internet, safety, weather/best month, air quality).
- The compare page FAQ implementation (lines 852–918 in `[slugs].vue`) is the direct template to copy and adapt.
- Do NOT add a visible FAQ accordion to the city page — JSON-LD only is the right call here.
- The `safety` Level enum maps to human string via `formatLevel()` already on the city page — reuse it.
- The `airQualityNow` field is a raw AQI integer. Use both `airQualityScore` (1-5) and `airQualityNow` in the answer for richness.
