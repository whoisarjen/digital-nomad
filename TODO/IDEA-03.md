# IDEA-03: Region Hub Pages
**Status:** PARTIAL
**Priority:** 3/39
**Complexity:** S (gaps are small)

## What's Already Implemented
Almost everything — but under `/regions/` not `/best-cities/[region]` as the original plan proposed. Current state:

- `apps/nomad/src/pages/regions/index.vue` — bento card grid of all 7 regions with city counts and top city images ✅
- `apps/nomad/src/pages/regions/[region].vue` — full detail page: dark hero, stats chips (cityCount, costMin/costMax, avgSpeed, safetyHighCount), filterable + paginated city grid, floating filter pill, FiltersDrawer ✅
- `apps/nomad/src/server/api/regions/index.get.ts` and `[region].get.ts` — both endpoints complete with `select` (no `include`) ✅
- `apps/nomad/src/server/api/__sitemap__/regions.ts` — multi-language sitemap handler ✅
- `apps/nomad/src/composables/useRegion.ts` — TanStack Vue Query composable ✅
- `REGION_SLUG_MAP` in shared utils, 7 regions, Antarctica excluded ✅
- `en.json` has full `regionPage.*` i18n section ✅
- `defineI18nRoute`: EN `/regions/[region]`, PL `/regiony/[region]` ✅
- ItemList + BreadcrumbList JSON-LD on `[region].vue` ✅
- `noindex` when query params present ✅
- Sitemap source registered in `nuxt.config.ts` ✅

## Revised Analysis
The original plan assumed this was NOT_STARTED. It is essentially done under a different URL (`/regions/` instead of `/best-cities/`). The URL choice `/regions/` is actually better for SEO than `/best-cities/[region]` (cleaner hierarchy, avoids conflating "best cities" ranking intent with "region hub" navigational intent).

**Remaining gaps (all small):**

1. **`pl.json` missing `regionPage` section entirely** — Polish users see fallback EN strings. Fix: copy and translate the `regionPage.*` keys from `en.json` to `pl.json` and all other locale files.

2. **No hreflang `<link>` tags on region pages** — blog pages implement this correctly via `LOCALES.map(...)` loop; region pages don't. This is a real on-page SEO gap.

3. **`regions/index.vue` has no BreadcrumbList JSON-LD** — the detail page has it, the index does not.

4. **No `<link rel="canonical">` tag** on either region page.

5. **No `og:image`** on `[region].vue` despite the top city image being available.

## Implementation Plan

### Database Changes
None.

### API Endpoints
None.

### Frontend Components/Pages
**Modify**: `apps/nomad/src/pages/regions/[region].vue`
- Add hreflang `<link>` tags to `useHead()`: follow the blog page pattern with `LOCALES.map(locale => ({ rel: 'alternate', hreflang: locale.code, href: `${BASE_URL}/${locale.pathPrefix}regions/${regionSlug}` }))`
- Add `<link rel="canonical">` to `useHead()`
- Add `og:image` using `regionData.value.cities[0]?.featuredImageUrl` (already fetched)

**Modify**: `apps/nomad/src/pages/regions/index.vue`
- Add BreadcrumbList JSON-LD (Home > Regions)
- Add canonical + hreflang

### i18n Changes
Add missing `regionPage.*` translations to `pl.json` and all other non-EN locale files. Keys already exist in `en.json` — translate them.

Also add `nav.regions` key to all locale files.

## Dependencies
None.

## Notes
- The URL `/regions/` is preferable to `/best-cities/[region]`. Do not move or redirect — just document the actual URL structure.
- These are all small fixes on an otherwise complete feature.
- The `og:image` addition is a one-liner using the first city's image URL.
