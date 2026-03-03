# IDEA-05: Shareable OG City Cards
**Status:** NOT_STARTED
**Priority:** 5/39
**Complexity:** M

## What's Already Implemented
Nothing. The city page (`apps/nomad/src/pages/cities/[slug].vue`) has **no `useHead()` call at all** — zero SEO meta tags, no `og:image`, no title, no description, no canonical. No `@vercel/og` or Satori is installed. `package.json` lists no image generation dependency.

The blog page and compare page are both fully SEO'd with `useHead()`, hreflang links, JSON-LD, and structured meta. City pages are the only major page type with no SEO at all, making IDEA-05 and IDEA-06 critically high leverage.

## Revised Analysis
`@vercel/og` (Satori) is the right tool — runs at Vercel Edge Runtime, returns PNG, purpose-built for this.

**Key insights:**
- The city endpoint already returns all needed data: `name`, `country`, `costForNomadInUsd`, `internetSpeedCity`, `safety`, `airQualityScore`, `monthSummary` (for weather icon)
- The OG route must be a standalone Nitro server handler — not a Vue page
- **Localization decision**: OG images are language-agnostic (numbers + city name are universal). One image URL works for all locale variants. Set `og:image` using the English slug only
- **Caching is critical**: Use `routeRules` in `nuxt.config.ts` with `Cache-Control: public, max-age=86400` on `/api/og/**`
- **Font loading**: Satori requires fonts as ArrayBuffer. Fetch Inter once at module scope — do not re-fetch per request (common footgun)
- **No composite score needed**: Use `costForNomadInUsd`, `internetSpeedCity`, and `safety` as three hero metrics on the card. No computed `nomadScore` field in schema yet
- **IDEA-05 and IDEA-06 are coupled**: Both require adding `useHead()` to the city page. Implement in one pass

**Safety display**: `safety` is a `Level` enum (HIGH/MIDDLE/LOW). Map to colored dot + label on the card.
**Air quality**: `airQualityScore` is 1-5 float. Format as `4.2/5`.

## Implementation Plan

### Database Changes
None.

### API Endpoints
**New file**: `apps/nomad/src/server/api/og/city/[slug].get.ts`
- Method: GET, returns PNG (`Content-Type: image/png`)
- Fetch city from Prisma using `select` (never `include`): `name`, `country`, `costForNomadInUsd`, `internetSpeedCity`, `safety`, `airQualityScore`
- Render 1200×630 Satori card: city name large, country subtitle, three metric badges (cost / internet / safety), dark gradient background matching app's `#060E1B` palette, "nomad.whoisarjen.com" watermark bottom-right
- Response headers: `Content-Type: image/png`, `Cache-Control: public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600`
- Return 404 gracefully (not throw) if city slug not found

**Modify**: `apps/nomad/nuxt.config.ts`
```ts
routeRules: {
  '/api/og/**': { headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400' } }
}
```

### Frontend Components/Pages
**Modify**: `apps/nomad/src/pages/cities/[slug].vue`

Add `useHead(() => { if (!data.value) return {} ... })` following the blog page pattern. Include:
- `title`: `t('city.metaTitle', { name: data.value.name, country: data.value.country })`
- `meta[name=description]`
- `og:title`, `og:description`, `og:type: 'website'`, `og:url`
- `og:image`: `https://nomad.whoisarjen.com/api/og/city/${citySlug}` (absolute, no locale prefix)
- `og:image:width: '1200'`, `og:image:height: '630'`
- `twitter:card: 'summary_large_image'`
- `link[rel=canonical]`
- `link[rel=alternate]` hreflang for all locales (use `LOCALES` constant — same pattern as blog page)
- `robots: 'noindex, nofollow'` guard when key data is null
- JSON-LD scripts (IDEA-01's best month summary + IDEA-06's FAQ JSON-LD go in the same `useHead()` block)

### New Dependencies
Install in `apps/nomad/`:
```
@vercel/og
```

### i18n Changes
Add to `en.json` and all locale files under `"city"` key:
```json
"metaTitle": "{name}, {country} — Digital Nomad Guide",
"metaDesc": "Digital nomad guide to {name}: ${cost}/mo living cost, {speed} Mbps internet, {safety} safety rating."
```

## Dependencies
- IDEA-01: Shares the `useHead()` addition to city page — implement together.
- IDEA-06: FAQ JSON-LD slots into the same `useHead()` block — implement all three in one pass.

## Notes
- The city page currently has ZERO SEO. Any Google traffic to `/cities/[slug]` gets no title, no description, no structured data. This is the highest-priority fix in the entire SEO backlog regardless of OG images.
- Satori renders JSX-style object trees, not Vue templates. The OG handler is pure Nitro server code.
- The 11 locales all share the same `/api/og/city/[slug]` image URL. This is correct — social platforms don't localize OG images.
- Do not add `nomadScore` to the OG card unless a pre-computed score column is added to the schema first.
