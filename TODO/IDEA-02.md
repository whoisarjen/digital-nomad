# IDEA-02: "Which City Matches Me" Quiz
**Status:** NOT_STARTED
**Priority:** 2/23
**Complexity:** M

## What's Already Implemented
Nothing. No `/pages/quiz/` directory exists. All required city fields are in the schema (`costForNomadInUsd`, `temperatureC`, `internetSpeedCity`, `safety`, `region`). Region constants and Level enum values are already shared.

## Revised Analysis
Pure client-side scoring — one new slim API endpoint returning all cities with scoring fields, then weighted scoring in a computed().

**Field mapping correction from original spec:**
- Climate → use `City.temperatureC` (annual average °C), NOT `City.climate` (which is a Numbeo composite quality index, not a temperature signal)
- All other fields match the spec directly

**Scoring algorithm (client-side, weighted points per city):**
- Budget: exact bracket match = 3pts, adjacent bracket = 1pt
- Climate: temp within ±5°C of preferred midpoint = 3pts, ±12°C = 1pt, "doesn't matter" = 3pts all
- Internet: meets threshold = 3pts, within 20% below = 1pt, "doesn't matter" = 3pts all
- Safety: exact match = 3pts, one level below preference = 1pt, "adventurous" = 3pts all
- Region: selected region(s) match = 3pts, "anywhere" = 3pts all

**Results page:** `noindex` (personalized/dynamic). Quiz index page: full SEO.

**URL params:** Use numeric indices for brevity: `?budget=2&climate=1&internet=1&safety=2&regions=0,2`

## Implementation Plan

### Database Changes
None.

### API Endpoints
**New file**: `apps/nomad/src/server/api/quiz/cities.get.ts`
- No query params, no auth required
- Returns all cities with scoring fields only:
  ```ts
  select: {
    slug: true, name: true, country: true, region: true,
    costForNomadInUsd: true, temperatureC: true,
    internetSpeedCity: true, safety: true,
    image: { select: { url: true, ownerName: true, ownerUsername: true } },
  }
  ```
- No pagination — ~500 records × 6 fields ≈ 50KB payload
- Add ISR cache rule in `nuxt.config.ts`: `'/api/quiz/cities': { isr: 3600 }`

### Frontend Components/Pages
**New file**: `apps/nomad/src/pages/quiz/index.vue`
- `defineI18nRoute({ paths: { en: '/quiz', pl: '/quiz' } })`
- Local `ref<number>` for `currentStep` (1–5)
- Refs for each answer, synced to URL query params on completion
- Progress bar UI
- On final step: `router.push` to quiz results with answers as query params
- Full SEO: `useHead` targeting "digital nomad quiz", "best city for me digital nomad"

**New file**: `apps/nomad/src/pages/quiz/results.vue`
- Reads answers from `route.query`
- Calls `useQuizCities()` composable
- Weighted scoring in `computed()` → top 5 cities
- Shows city cards with score breakdown reasoning
- Share button: `navigator.clipboard.writeText(window.location.href)`
- `noindex` meta

**New file**: `apps/nomad/src/composables/useQuizCities.ts`
- Wraps `useCustomQuery` for `/api/quiz/cities`
- No query ref needed — static endpoint, cached for session

### i18n Changes
Add to all locale files (abbreviated — see full list in impl):
```json
"quiz": {
  "title": "Which City Is Right for Me?",
  "subtitle": "Answer 5 quick questions to find your ideal digital nomad base",
  "step": "Step {current} of {total}",
  "next": "Next", "back": "Back", "seeResults": "See My Results",
  "retake": "Retake Quiz", "shareResults": "Share Results",
  "resultsTitle": "Your Top Cities",
  "matchScore": "{score}% match",
  "stepBudget": { "question": "What's your monthly budget?", ... },
  "stepClimate": { "question": "What climate do you prefer?", ... },
  "stepInternet": { "question": "How important is internet speed?", ... },
  "stepSafety": { "question": "What's your safety preference?", ... },
  "stepRegions": { "question": "Any region preference?", "anywhere": "Anywhere" }
}
```

## Dependencies
None. Fully independent.

## Notes
- Use `City.temperatureC` for climate scoring — NOT `City.climate` (Numbeo composite).
- Region enum has 7 values (Antarctica removed). Quiz shows all 7 with existing `regions` i18n keys.
- Add quiz CTA to homepage features grid and footer once built.
- No auth required for the quiz endpoint.
