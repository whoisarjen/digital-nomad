# IDEA-01: Best Month Picker + Monthly Score on City Pages
**Status:** PARTIAL
**Priority:** 1/39
**Complexity:** S

## What's Already Implemented
The 12-month visual strip is **fully implemented** in `apps/nomad/src/pages/cities/[slug].vue` (lines 293–337). It shows month name, weather icon, apparent temp max, rain sum, sunshine hours, and a color-coded total score. The API at `[slug].get.ts` already fetches all 12 `monthSummary` records with the right fields.

## Revised Analysis
Three things are missing:

1. **Prose "Best months" summary text** — "Best months: Nov, Dec, Jan. Avoid: Mar, Apr, May" — not rendered anywhere. Derive from `monthSummary` sorted by `totalScore`.
2. **"Best" / "Avoid" label chips** on individual month cells — color coding exists but no text labels.
3. **The city detail page has ZERO SEO** — no `useHead`, no title tag, no meta description, no JSON-LD at all. This is the biggest real gap on the whole site. Fixing SEO is the highest-leverage action here (also blocks IDEA-05 and IDEA-06).

No API or schema changes needed — all data is already returned by the existing endpoint.

## Implementation Plan

### Database Changes
None.

### API Endpoints
None. All data is already returned by `apps/nomad/src/server/api/cities/[slug].get.ts`.

### Frontend Components/Pages
**Modify**: `apps/nomad/src/pages/cities/[slug].vue`

1. Add `BestMonthsSummary` computed value derived from `monthSummary`:
   - Sort by `totalScore` desc, top 3 = "Best months", bottom 3 = "Avoid"
   - Render as prose sentence above or below the month strip

2. Add "Best" / "Avoid" label chips to the month strip cells (the top 3 and bottom 3 cells):
   - Reuse existing color coding; add a small `<span>` chip with "Best" or "Avoid" text

3. Add full `useHead()` block following the blog page pattern (`apps/nomad/src/pages/blog/[slug].vue`):
   - `title`, `og:title`, `og:description`, canonical, hreflang for all locales, `noindex` guard
   - This unblocks IDEA-05 (OG image) and IDEA-06 (FAQ JSON-LD) — implement all three together

### i18n Changes
Add under `"city"` key in `en.json` and all locale files:
```json
"bestMonths": "Best months: {months}",
"avoidMonths": "Avoid: {months}",
"bestLabel": "Best",
"avoidLabel": "Avoid"
```

## Dependencies
- IDEA-05 (OG image) and IDEA-06 (FAQ JSON-LD) both require the same `useHead()` addition — implement in one pass.

## Notes
- The month strip itself is complete — this task is purely additive UI polish + critical SEO fix.
- Sorting by `totalScore` is sufficient for "Best/Avoid" labeling; no new scoring formula needed.
- The prose summary can be a computed property, not a component — keeps it lightweight.
