# IDEA-25: Monthly Nomad Report
**Status:** NOT_STARTED
**Priority:** 25/39
**Complexity:** M

## What's Already Implemented
Nothing. No `/reports/` pages, no report API endpoints.

## Revised Analysis
**Data availability concern:** The "biggest cost changes" section requires historical cost data (IDEA-36 — CostSnapshot model). Without it, this section cannot be generated. Build the report without the "changes" section initially, and add it once IDEA-36 has accumulated 2+ months of data.

**Auto-generation:** Reports are generated from live DB queries, not pre-rendered and stored. This means each visit to `/reports/2026-03` queries the DB. Use ISR caching (revalidate monthly) to avoid repeated expensive queries.

**Content per report:**
- Top 10 cheapest cities this month (from MonthSummary for that month)
- Top 10 fastest internet cities (from City.internetSpeedCity)
- Top 10 most favorited cities (from Favorite.count grouped by citySlug — all-time or current month if createdAt is tracked)
- Best weather cities for that specific month (MonthSummary.totalScore for that month)
- New blog articles that month (Article.publishedAt in that month range)
- (Future) Biggest cost changes — requires IDEA-36

**Report index at `/reports`:** List of all months since launch with links to each report.

**PDF download:** Skip for V1 — browser print-to-PDF is sufficient.

## Implementation Plan

### Database Changes
None (for V1 without cost change history).

### API Endpoints
**New file**: `apps/nomad/src/server/api/reports/[date].get.ts`
- Accepts `date` param as `YYYY-MM` string
- Validates format and rejects future months
- Returns: `{ month, year, cheapestCities, fastestCities, mostFavorited, bestWeatherCities, newArticles }`
- All queries use `select` only, following project rules
- Apply Nitro ISR: `{ isr: 86400 }` (revalidate daily — monthly data rarely changes mid-month)

**New file**: `apps/nomad/src/server/api/reports/index.get.ts`
- Returns list of all available months since a hardcoded launch date
- No DB query needed — generate month slugs from launch date to current month

### Frontend Components/Pages
**New file**: `apps/nomad/src/pages/reports/index.vue`
- `defineI18nRoute({ paths: { en: '/reports', pl: '/raporty' } })`
- Grid of month cards linking to individual reports
- Full SEO: `useHead`

**New file**: `apps/nomad/src/pages/reports/[date].vue`
- Validates `date` param format client-side
- Fetches report data via composable
- Sections: cheapest cities table, fastest internet table, most favorited list, best weather for the month
- Full SEO: `useHead` with title "Digital Nomad Cities Report: {Month} {Year}"
- BreadcrumbList JSON-LD

**New file**: `apps/nomad/src/composables/useReport.ts`
- Wraps `useCustomQuery` for `/api/reports/${date}`

**New file**: `apps/nomad/src/server/api/__sitemap__/reports.ts`
- Generates sitemap entries for all available months

### i18n Changes
Add to all locale files:
```json
"reports": {
  "title": "Monthly Digital Nomad Report",
  "reportTitle": "Nomad Cities Report: {month} {year}",
  "allReports": "All Reports",
  "cheapestCities": "Cheapest Cities This Month",
  "fastestInternet": "Fastest Internet",
  "mostFavorited": "Most Saved by Nomads",
  "bestWeather": "Best Weather",
  "newArticles": "New Guides",
  "noFutureReports": "Report not yet available"
}
```

## Dependencies
- IDEA-36 (Historical Cost Trends): enables "biggest cost changes" section. Build IDEA-36 first, add the section to reports once 2+ months of data exists.

## Notes
- Reports for past months are immutable content — excellent for backlinks and citations.
- ISR caching is critical: `{ isr: 86400 }` means the report page is rebuilt at most once per day, not on every visitor request.
- The report index page can be a static list of month links — no API call needed if launch date is hardcoded.
- Consider promoting monthly reports in the newsletter (IDEA-14) as the primary "New this month" content.
