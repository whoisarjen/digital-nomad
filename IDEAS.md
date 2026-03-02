# Feature Ideas Roadmap

Each idea is a self-contained task. Pick them up one by one in order of priority.

---

## IDEA-01: Best Month Picker + Monthly Score on City Pages

**Priority:** 1 / 39
**Impact:** Very High | **Effort:** Low | **Schema Change:** No

### Problem
City pages show weather data but don't surface a clear "best months to visit" verdict. "Best time to visit [city] as a digital nomad" is one of the highest-volume long-tail query patterns. No free competitor answers this with data.

### What to Build
1. On every city detail page (`/cities/[slug]`), add a 12-month visual strip below the hero section
2. Each month cell shows: month name, weather icon, average temperature, and a color-coded "nomad score" (green = great, yellow = okay, red = avoid)
3. The score is derived from existing `MonthSummary` fields: `totalScore`, `weatherIcon`, `temperature2mMean`, `rainSum`, `sunshineDuration`
4. Highlight the top 3 months with a "Best months" label and the bottom 3 with "Avoid"
5. Add a text summary: "Best months: November, December, January. Avoid: March, April, May (high humidity, poor air quality)"

### Data Source
- `MonthSummary` model already has all 12 months per city with `totalScore`, `weatherIcon`, `apparentTemperatureMax`, `apparentTemperatureMin`, `rainSum`, `sunshineDuration`
- No new data collection needed

### API Changes
- Extend `GET /api/cities/[slug]` to include MonthSummary data (12 rows) with `totalScore`, `weatherIcon`, `temperature2mMean`, `rainSum`, `sunshineDuration` per month
- Or create a dedicated `GET /api/cities/[slug]/months` endpoint

### Frontend Changes
- New `MonthScoreStrip.vue` component: horizontal 12-cell strip with color coding
- New `BestMonthsSummary.vue` component: text verdict derived from the scores
- Integrate both into the city detail page

### SEO Benefit
- "Best time to visit Bangkok for digital nomads" featured snippet opportunity
- FAQ JSON-LD pair: "What is the best month to visit [city] as a digital nomad?" with a data-driven answer
- Scalable to all 500+ city pages automatically

### Acceptance Criteria
- [ ] Every city page shows a 12-month score strip with color coding
- [ ] Top 3 and bottom 3 months are labeled
- [ ] Text summary is generated from data (not hardcoded)
- [ ] Works in both EN and PL
- [ ] Mobile responsive (horizontally scrollable or 2-row grid)

---

## IDEA-02: Month-Aware City Filter ("Climate Finder")

**Priority:** 2 / 39
**Impact:** Very High | **Effort:** Medium | **Schema Change:** No

### Problem
Current filters (region, cost, internet, etc.) are not time-aware. Users can't say "show me warm, dry cities under $2000/month in March." NomadList's Climate Finder does this but is paywalled. No free alternative exists.

### What to Build
1. Add a "Month" selector to the filter drawer (bottom sheet)
2. When a month is selected, city scores and weather data reflect that specific month instead of annual averages
3. Add month-specific filter options:
   - Temperature range for selected month (min-max slider)
   - Max rainfall for selected month
   - Weather type for selected month (sun, cloudy, rain, etc.)
   - Minimum sunshine hours for selected month
4. Sort cities by their `MonthSummary.totalScore` for the selected month

### Data Source
- `MonthSummary` model: join cities with their month-specific data
- All fields already exist: `totalScore`, `temperature2mMean`, `rainSum`, `sunshineDuration`, `weatherIcon`

### API Changes
- Extend `GET /api/cities` to accept a `month` query parameter (1-12)
- When `month` is provided, join with `MonthSummary` and:
  - Filter by month-specific temperature, rain, sunshine, weather type
  - Sort by month-specific `totalScore` instead of annual
  - Return month-specific weather data in the city card response
- Extend `GET /api/cities/filters` to return month-specific min/max ranges when `month` param is provided

### Frontend Changes
- Add `MonthSelector.vue` component to the filter drawer
- When month is selected, swap annual weather display on city cards with month-specific data
- Update filter sliders to reflect month-specific ranges
- Add a prominent "Showing results for [Month]" indicator above the city grid
- Clear month filter with other filters

### SEO Benefit
- "Best cities for digital nomads in January" pages (see IDEA-10)
- Directly competes with NomadList's paid Climate Finder

### Acceptance Criteria
- [ ] Month selector appears in the filter drawer
- [ ] Selecting a month re-fetches cities with month-specific scores
- [ ] City cards display month-specific weather when a month is selected
- [ ] Temperature and rain filters adjust to month-specific ranges
- [ ] Sort by month score works correctly
- [ ] Clearing month reverts to annual data
- [ ] Works in both EN and PL

---

## IDEA-03: Region Hub Pages

**Priority:** 3 / 39
**Impact:** Very High | **Effort:** Low | **Schema Change:** No

### Problem
No aggregation pages exist for regions. "Best digital nomad cities in Europe" is a high-volume navigational query. The `Region` enum (7 values) is already in the schema but never surfaces as a route.

### What to Build
1. New page at `/best-cities/[region]` (e.g., `/best-cities/europe`, `/best-cities/southeast-asia`)
2. Each page shows:
   - Region name and description
   - Top 20 cities in that region sorted by `totalScore`
   - Aggregate stats: average cost, average internet speed, number of cities
   - City cards (reuse existing `CityCard.vue`)
3. 7 pages total from the `Region` enum: `Europe`, `Asia`, `LatinAmerica`, `MiddleEast`, `Africa`, `NorthAmerica`, `Oceania`

### Data Source
- `City.region` field (Region enum) already exists
- `MonthSummary.totalScore` for ranking
- All existing city fields for cards

### API Changes
- New `GET /api/regions/[region]` endpoint:
  - Fetch top 20 cities where `region` matches, ordered by average `totalScore`
  - Return aggregate stats (avg cost, avg internet, city count)
  - Use `select` pattern per CLAUDE.md rules

### Frontend Changes
- New page `src/pages/best-cities/[region].vue`
- Region hero section with name + description + aggregate stats
- Reuse `CityCard.vue` for the city grid
- Add links to region pages from the main explore page sidebar/header
- Map enum values to URL slugs: `LatinAmerica` -> `latin-america`, `SoutheastAsia` -> `southeast-asia`, etc.

### SEO
- BreadcrumbList JSON-LD: Home > Best Cities > [Region]
- ItemList JSON-LD for the ranked city list
- Meta title: "Best Digital Nomad Cities in [Region] | 2026 Rankings"
- Hreflang alternates for EN/PL
- Internal links from every city page back to its region page

### i18n
- Region names need EN/PL translations in locale files
- URL slugs stay in English for both locales (prefix routing handles `/pl/best-cities/europe`)

### Acceptance Criteria
- [ ] 7 region pages accessible at `/best-cities/[region]`
- [ ] Each shows top 20 cities sorted by score with aggregate stats
- [ ] BreadcrumbList + ItemList JSON-LD on each page
- [ ] Hreflang alternates for EN/PL
- [ ] Internal links from city pages to their region page
- [ ] Mobile responsive
- [ ] Region pages linked from the main navigation or explore page

---

## IDEA-04: Country Landing Pages

**Priority:** 4 / 39
**Impact:** Very High | **Effort:** Low-Medium | **Schema Change:** No

### Problem
`countrySlug` and `countryCode` exist on every city but no country pages exist. "Digital nomad cities in Thailand" is a mid-funnel query with high volume. ~150 country pages would create massive long-tail SEO surface.

### What to Build
1. New page at `/countries/[countrySlug]` (e.g., `/countries/thailand`, `/countries/portugal`)
2. Each page shows:
   - Country name and flag (derive from `countryCode`)
   - All cities in that country ranked by score
   - Aggregate stats: number of cities, average nomad cost, average internet speed, safety overview
   - City cards grid
3. A country index page at `/countries` listing all countries with city counts

### Data Source
- `City.countrySlug`, `City.country`, `City.countryCode` already exist
- Group cities by `countrySlug`

### API Changes
- New `GET /api/countries` endpoint: list all distinct countries with city count, sorted by city count desc
- New `GET /api/countries/[countrySlug]` endpoint: all cities in country, ordered by score, with aggregate stats
- Follow `select` + `getLocalizedSelect` pattern

### Frontend Changes
- New page `src/pages/countries/index.vue` — country grid with flags and city counts
- New page `src/pages/countries/[countrySlug].vue` — country detail with city list
- Reuse `CityCard.vue`
- Country flag component (use `countryCode` with a flag emoji or flag CDN)

### SEO
- BreadcrumbList: Home > Countries > [Country]
- ItemList JSON-LD for cities within country
- Meta title: "Best Digital Nomad Cities in [Country] | Cost, Internet, Safety"
- Hreflang for EN/PL
- Internal links: city page -> country page, country page -> region page

### Acceptance Criteria
- [ ] Country index page at `/countries` with all countries
- [ ] Country detail pages at `/countries/[countrySlug]`
- [ ] Cities sorted by score within each country
- [ ] Aggregate stats shown (avg cost, avg internet, safety breakdown)
- [ ] BreadcrumbList + ItemList JSON-LD
- [ ] Hreflang for EN/PL
- [ ] Links from city pages to their country page
- [ ] Sitemap includes all country pages

---

## IDEA-05: Shareable OG City Cards

**Priority:** 5 / 39
**Impact:** High | **Effort:** Low | **Schema Change:** No

### Problem
When someone shares a city page URL on Twitter/Reddit/WhatsApp, the preview is generic. NomadList users screenshot city stats constantly. A branded, auto-generated preview image turns every share into a free ad.

### What to Build
1. Dynamic OG image generation for every city page
2. The image shows: city name, country, nomad score (0-100), monthly cost, internet speed, safety level, weather icon, and a "nomad.whoisarjen.com" watermark
3. Use `@vercel/og` (Satori) or a similar edge-based image generation
4. Set as `og:image` meta tag on city pages

### Data Source
- All data already returned by `GET /api/cities/[slug]`

### API Changes
- New `GET /api/og/city/[slug]` endpoint that returns a PNG image
- Use Satori/`@vercel/og` to render an HTML template to an image
- Cache aggressively (images rarely change)

### Frontend Changes
- Update `useHead()` on city detail page to include the dynamic OG image URL
- Also add `twitter:card: summary_large_image` meta tag

### Design
- Clean card layout: city image as background (blurred/darkened), stats overlaid
- Consistent branding: logo, site URL, consistent font
- Size: 1200x630px (standard OG image)

### Acceptance Criteria
- [ ] Every city page has a unique OG image
- [ ] Image shows: city name, country, cost, internet, safety, score
- [ ] Site branding/watermark included
- [ ] `og:image` and `twitter:card` meta tags set correctly
- [ ] Images are cached (not regenerated on every request)
- [ ] Preview looks good on Twitter, Facebook, WhatsApp, Slack

---

## IDEA-06: FAQ JSON-LD on City Pages

**Priority:** 6 / 39
**Impact:** High | **Effort:** Low | **Schema Change:** No

### Problem
City pages have rich data but no structured FAQ markup. Google's "People Also Ask" boxes and featured snippets heavily favor pages with FAQ JSON-LD. Blog articles already have FAQ JSON-LD but city pages don't.

### What to Build
1. Generate 5-8 FAQ pairs per city page from existing data:
   - "Is [City] affordable for digital nomads?" -> "The monthly cost for a nomad in [City] is $[cost]. This is [X]% [cheaper/more expensive] than the global average."
   - "What is the internet speed in [City]?" -> "[City] has an average internet speed of [X] Mbps, ranking #[Y] globally."
   - "Is [City] safe for digital nomads?" -> "[City] has a [HIGH/MIDDLE/LOW] safety rating with a safety index of [X]."
   - "What is the weather like in [City]?" -> "[City] has an average temperature of [X]°C with [description based on climate level]."
   - "What is the air quality in [City]?" -> "[City]'s current air quality score is [X] with [LOW/MIDDLE/HIGH] pollution levels."
   - "What is the best month to visit [City]?" -> "Based on weather and nomad scores, the best months to visit [City] are [top 3 months]." (requires IDEA-01 data)
2. Inject FAQ JSON-LD into the page `<head>`
3. Optionally render the FAQ visually as an accordion on the page

### Data Source
- All data from existing city endpoint + MonthSummary

### Frontend Changes
- New `CityFaqSchema.vue` component that generates JSON-LD from city data
- Optionally: `CityFaqAccordion.vue` for visible FAQ section on page
- Add to city detail page layout

### SEO Benefit
- Targets "People Also Ask" boxes for "[city] for digital nomads" queries
- Featured snippet eligibility for each FAQ pair
- Touches 500+ pages with one component

### i18n
- FAQ questions and answer templates need EN/PL translations in locale files

### Acceptance Criteria
- [ ] Every city page includes FAQ JSON-LD in `<head>`
- [ ] At least 5 FAQ pairs per city, generated from real data
- [ ] FAQ content is localized (EN/PL)
- [ ] Google Rich Results Test validates the JSON-LD
- [ ] Optional: visible FAQ accordion on the page

---

## IDEA-07: Geoarbitrage Calculator

**Priority:** 7 / 39
**Impact:** High | **Effort:** Low | **Schema Change:** No

### Problem
"How much do I need to live in [city]" and "where can I afford on $3000/month" are the most common nomad financial questions. No free platform integrates a salary-stretch calculator into city pages. NomadList's FIRE calculator is paywalled.

### What to Build

#### Part A: City Page Calculator
1. On each city detail page, add a "Can I afford this?" widget
2. User inputs their monthly income via a slider ($500 - $10,000)
3. Widget shows: monthly surplus/deficit for nomad/expat/local lifestyle, months of runway if they have savings
4. Visual bar: green if affordable, yellow if tight, red if over budget

#### Part B: Explore Page Filter
1. Add a "My budget" filter to the explore page
2. User sets their monthly budget
3. Cities are filtered to show only those where `costForNomadInUsd <= budget`
4. City cards show "You'd save $X/month here" or "$X over budget"

### Data Source
- `City.costForNomadInUsd`, `costForExpatInUsd`, `costForLocalInUsd`, `costForFamilyInUsd`
- Pure client-side computation, no API changes needed

### Frontend Changes
- New `AffordabilityCalculator.vue` component for city pages
- New `BudgetFilter.vue` component for the filter drawer
- Update city card to show relative cost when budget is set

### Acceptance Criteria
- [ ] City page has a budget input widget
- [ ] Shows surplus/deficit for each lifestyle tier
- [ ] Explore page has a "My budget" filter
- [ ] Cities filtered by affordability when budget is set
- [ ] All computation is client-side (no API calls)
- [ ] Works in both EN and PL

---

## IDEA-08: Comparison SEO Enhancement

**Priority:** 8 / 39
**Impact:** High | **Effort:** Low | **Schema Change:** No

### Problem
The compare feature exists at `/compare/[slugs]` but lacks SEO optimization. "Bangkok vs Bali for digital nomads" gets thousands of searches monthly. The pages need proper meta tags, structured data, and a narrative summary to rank.

### What to Build
1. Dynamic meta tags: `<title>Bangkok vs Bali: Cost, Internet, Safety Compared for Digital Nomads</title>`
2. Winner-declared summary paragraph: "Bangkok is 23% cheaper for nomads, with faster internet but lower safety ratings than Bali."
3. JSON-LD with two `Place` entities and comparison properties
4. Percentage differences on all metrics (not just raw numbers)
5. "Related comparisons" section linking to 4-6 similar city pairs
6. Pre-generate and index the top 190 comparison pages (top 20 cities x top 20 cities)

### Data Source
- Existing `GET /api/compare/[slugs]` endpoint data
- Percentage calculations are client-side

### API Changes
- Extend compare endpoint to include a `percentageDifferences` object for key metrics
- Add a `relatedComparisons` field returning 4-6 city pairs that share one of the two compared cities

### Frontend Changes
- Add `ComparisonSummary.vue`: auto-generated narrative paragraph with winner declarations
- Add percentage badges next to each metric in the comparison table
- Add `RelatedComparisons.vue` section at the bottom
- Update `useHead()` with dynamic meta title and description
- Add JSON-LD structured data

### SEO
- Meta title: "[City A] vs [City B]: Cost, Internet, Safety for Digital Nomads"
- Meta description: auto-generated from the top 3 differences
- Canonical URL with alphabetical ordering (already implemented)
- Add comparison pages to sitemap (top 190 pairs)
- Internal links from city pages: "Compare [city] with [popular city]"

### Acceptance Criteria
- [ ] Dynamic meta title and description on comparison pages
- [ ] Narrative summary paragraph with percentage differences
- [ ] Percentage badges on all compared metrics
- [ ] Related comparisons section with 4-6 links
- [ ] JSON-LD structured data
- [ ] Top 190 comparison pages added to sitemap
- [ ] City pages link to relevant comparisons

---

## IDEA-09: Prominent Nomad Score

**Priority:** 9 / 39
**Impact:** High | **Effort:** Low | **Schema Change:** No

### Problem
`totalScore` exists in the database but is not prominently displayed as a single, shareable number. Competitors all have a composite score. "Bangkok: 87/100" is what gets screenshotted, shared, and ranked.

### What to Build
1. Display a prominent "Nomad Score" (0-100) on every city card and city detail page
2. Visual representation: large circular score badge with color coding (green 70+, yellow 40-69, red <40)
3. Breakdown tooltip showing the sub-scores: cost, internet, safety, climate, air quality
4. New page: `/best-cities` — top 50 cities ranked by Nomad Score, updated monthly

### Data Source
- `MonthSummary.totalScore` — average across all 12 months for the annual score
- Or compute a weighted composite from `QualityIndex` fields

### API Changes
- Ensure `GET /api/cities` returns the computed nomad score
- New `GET /api/rankings` endpoint: top 50 cities by score with rank numbers

### Frontend Changes
- New `NomadScoreBadge.vue` component (circular, color-coded, with breakdown tooltip)
- Add to `CityCard.vue` and city detail page hero
- New page `src/pages/best-cities/index.vue` — ranked list of top 50 cities

### SEO
- Rankings page targets: "best cities for digital nomads 2026"
- ItemList JSON-LD on rankings page
- Rankings change monthly = fresh content signal to Google

### Acceptance Criteria
- [ ] Nomad Score badge visible on every city card
- [ ] City detail page shows large score with sub-score breakdown
- [ ] Rankings page at `/best-cities` with top 50 cities
- [ ] Score is derived from real data, not hardcoded
- [ ] Color coding: green/yellow/red
- [ ] Works in both EN and PL

---

## IDEA-10: Best Cities by Month Pages

**Priority:** 10 / 39
**Impact:** High | **Effort:** Low | **Schema Change:** No

### Problem
No competitor has month-specific ranked pages built on actual weather + cost data. "Best cities for digital nomads in January" is searched constantly by people planning 1-3 months ahead.

### What to Build
1. 12 new pages at `/best-cities/[month]` (e.g., `/best-cities/january`, `/best-cities/march`)
2. Each page shows top 20 cities ranked by their `MonthSummary.totalScore` for that month
3. City cards show month-specific data: temperature, rain, sunshine, weather icon
4. Aggregate stats: "In January, the best weather is in Southeast Asia with average temps of 28C"

### Data Source
- `MonthSummary` table: filter by month number, sort by `totalScore` desc, limit 20

### API Changes
- New `GET /api/cities/best-for-month/[month]` endpoint
- Returns top 20 cities for the given month with month-specific weather data

### Frontend Changes
- New page `src/pages/best-cities/[month].vue`
- Month selector navigation at the top (Jan - Dec tabs)
- City cards with month-specific weather data
- Can share template structure with region pages (IDEA-03)

### SEO
- Meta title: "Best Digital Nomad Cities in [Month] | Weather, Cost, Rankings"
- FAQ JSON-LD: "What is the best nomad city in [month]?" -> "[City] with a score of [X], avg temp [Y]C, cost $[Z]/mo"
- ItemList JSON-LD for the ranked list
- Internal links from month score strip on city pages (IDEA-01)

### i18n
- Month names need EN/PL translations
- URL slugs stay in English

### Acceptance Criteria
- [ ] 12 month pages accessible at `/best-cities/[month]`
- [ ] Each shows top 20 cities ranked by month-specific score
- [ ] City cards display month-specific weather
- [ ] Month navigation tabs for switching between months
- [ ] JSON-LD structured data (FAQ + ItemList)
- [ ] Hreflang for EN/PL
- [ ] Added to sitemap

---

## IDEA-11: City Check-Ins ("I'm Here Now")

**Priority:** 11 / 39
**Impact:** High | **Effort:** Medium | **Schema Change:** Yes

### Problem
No social presence layer exists. NomadList's core network effect is showing "14 nomads here right now." Their version is paywalled. A free version would get more participation.

### What to Build
1. Logged-in users can mark themselves as "currently in [city]"
2. City page shows a live count: "14 nomads here this month"
3. Optional: arrival/departure dates
4. Dashboard shows user's current city and check-in history
5. Only one active check-in per user at a time

### Schema Change
```prisma
model CheckIn {
  id         String    @id @default(cuid())
  userId     String
  citySlug   String
  arrivingAt DateTime?
  leavingAt  DateTime?
  isActive   Boolean   @default(true)
  createdAt  DateTime  @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  city City @relation(fields: [citySlug], references: [slug])

  @@unique([userId, isActive]) // only one active check-in
  @@index([citySlug, isActive])
}
```

### API Changes
- New `POST /api/checkins/toggle` — check in/out of a city (auth required)
- New `GET /api/checkins/city/[slug]` — count of active check-ins for a city
- New `GET /api/checkins/me` — user's current and past check-ins (auth required)
- Extend `GET /api/cities/[slug]` to include active check-in count

### Frontend Changes
- New `CheckInButton.vue` component on city page (auth-gated)
- Check-in count badge on city cards and city detail page
- Dashboard section showing current city and check-in history
- Auto-expire check-ins older than 90 days via cron

### Acceptance Criteria
- [ ] Users can check in to one city at a time
- [ ] City pages show active check-in count
- [ ] Dashboard shows current city and history
- [ ] Check-ins auto-expire after 90 days
- [ ] Auth required for check-in
- [ ] Works in both EN and PL

---

## IDEA-12: "Which City Matches Me" Quiz

**Priority:** 12 / 39
**Impact:** High | **Effort:** Low-Medium | **Schema Change:** No

### Problem
New nomads don't know what filters to set. They want to describe themselves and get recommendations. Quizzes are highly shareable content that go viral on Reddit and social media.

### What to Build
1. Multi-step quiz at `/quiz` (or `/find-your-city`):
   - Step 1: Budget range ($500-$1000, $1000-$1500, $1500-$2500, $2500+)
   - Step 2: Climate preference (hot, warm, mild, cold, doesn't matter)
   - Step 3: Internet importance (essential - 50+ Mbps, important - 20+, doesn't matter)
   - Step 4: Safety preference (only safest, moderate is fine, adventurous)
   - Step 5: Region preference (multi-select or "anywhere")
2. Results page: top 5 matching cities with scores and reasoning
3. Shareable results link with query params: `/quiz/results?budget=2&climate=1&internet=1&safety=2`
4. CTA: "Explore these cities" linking to each city page

### Data Source
- Pure client-side weighted scoring against existing city fields
- `costForNomadInUsd`, `temperature2mMean` (annual average), `internetSpeedCity`, `safety` (Level enum), `region`

### Frontend Changes
- New page `src/pages/quiz/index.vue` — multi-step form with progress bar
- New page `src/pages/quiz/results.vue` — results display with city cards
- Shareable URL with query params encoding answers
- Optional: email gate ("enter email to see full results") for lead capture

### SEO
- Meta title: "Which Digital Nomad City Is Right for You? | Free Quiz"
- Targets: "digital nomad quiz", "best city for me digital nomad"

### Acceptance Criteria
- [ ] 5-step quiz flow with clear progress indication
- [ ] Results show top 5 matching cities with reasoning
- [ ] Shareable results URL
- [ ] No account required to take the quiz
- [ ] Links to city pages from results
- [ ] Works in both EN and PL

---

## IDEA-13: Trip Planner (Extend Favorites)

**Priority:** 13 / 39
**Impact:** High | **Effort:** Medium | **Schema Change:** Yes (2 fields)

### Problem
The Favorite system is a flat, unordered list. Nomads plan sequential routes: Bangkok (March) -> Chiang Mai (April) -> Bali (May). NomadList paywalls trip planning. A shareable route becomes a viral loop.

### What to Build
1. Extend favorites with ordering and planned month
2. Dashboard "My Route" view showing cities in order with:
   - Drag-to-reorder
   - Month selector per city
   - Running total monthly cost for the whole route
   - Month-specific weather for each city at the planned time
3. Shareable read-only link: `/trips/[userId-or-hash]`
4. Route summary: total cost for X months, weather overview

### Schema Change
Add two fields to existing `Favorite` model:
```prisma
model Favorite {
  // existing fields...
  order        Int?      // position in the route (null = unordered/just favorited)
  plannedMonth Int?      // 1-12, which month they plan to be there
}
```

### API Changes
- New `PATCH /api/favorites/reorder` — update order of favorites (auth required)
- New `PATCH /api/favorites/plan` — set plannedMonth for a favorite (auth required)
- New `GET /api/trips/[userId]` — public read-only view of a user's ordered route with month-specific data
- Extend `GET /api/favorites` to include `order` and `plannedMonth` and return month-specific weather when `plannedMonth` is set

### Frontend Changes
- New `TripPlanner.vue` component on dashboard — drag-to-reorder list with month pickers
- Running total cost and weather summary
- Share button generating the public trip URL
- Public trip view page at `src/pages/trips/[id].vue`

### Acceptance Criteria
- [ ] Users can reorder their favorites into a route
- [ ] Users can assign a planned month to each city
- [ ] Dashboard shows running cost total and weather per city
- [ ] Shareable read-only trip link
- [ ] Works in both EN and PL

---

## IDEA-14: Weekly Email Newsletter

**Priority:** 14 / 39
**Impact:** Medium-High | **Effort:** Low | **Schema Change:** No (or minimal)

### Problem
No owned audience channel exists. Email survives algorithm changes. A weekly data-driven digest creates a habit loop and drives repeat visits.

### What to Build
1. Email opt-in form on homepage and city pages (just an email input)
2. Weekly automated email:
   - "3 best cities this week" (rotated by month score)
   - "Cheapest city with fast internet right now"
   - "New on the blog" (if any new articles)
   - 3 city cards with CTA links back to the site
3. Use Resend (free tier: 3K emails/month) or Buttondown

### Implementation
- Email collection: simple `NewsletterSubscriber` table or use Resend's contact list API
- Template: HTML email template with city data pulled from DB
- Cron job: `src/server/api/cron/newsletter.post.ts` — runs weekly, queries top cities for current month, builds email, sends via Resend API
- Unsubscribe link in every email (required by law)

### Schema Change (optional)
```prisma
model NewsletterSubscriber {
  id        String   @id @default(cuid())
  email     String   @unique
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
}
```
Or skip this model entirely and use Resend's built-in contact management.

### Acceptance Criteria
- [ ] Email opt-in form on homepage
- [ ] Weekly email sent automatically
- [ ] Email content is data-driven (not manually written each week)
- [ ] Unsubscribe link works
- [ ] GDPR compliant (double opt-in if targeting EU)

---

## IDEA-15: City Tips (User-Generated Content)

**Priority:** 15 / 39
**Impact:** Medium-High | **Effort:** Medium | **Schema Change:** Yes

### Problem
City pages are purely data-driven with no human voice. "Best SIM card in Lisbon?" and "Which neighborhood in Medellin?" are questions data can't answer. Reddit answers go stale. Permanently displayed, upvoteable tips are better.

### What to Build
1. Each city page gets a "Tips" tab/section
2. Logged-in users submit short tips (150 chars max) tagged by category:
   - SIM card / Internet
   - Coworking
   - Neighborhood
   - Food & Restaurants
   - Visa & Admin
   - Safety
   - Transport
3. Tips are upvoted by other users. Best tips float to the top
4. Rate limiting: 1 tip per category per city per user
5. Report/flag mechanism for bad content

### Schema Change
```prisma
model CityTip {
  id        String   @id @default(cuid())
  userId    String
  citySlug  String
  category  TipCategory
  content   String   @db.VarChar(150)
  upvotes   Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  city City @relation(fields: [citySlug], references: [slug])

  @@unique([userId, citySlug, category])
  @@index([citySlug, category, upvotes])
}

model TipVote {
  id       String @id @default(cuid())
  userId   String
  tipId    String

  user User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  tip  CityTip @relation(fields: [tipId], references: [id], onDelete: Cascade)

  @@unique([userId, tipId])
}

enum TipCategory {
  SIM_CARD
  COWORKING
  NEIGHBORHOOD
  FOOD
  VISA
  SAFETY
  TRANSPORT
}
```

### API Changes
- New `GET /api/tips/city/[slug]` — tips for a city, sorted by upvotes, grouped by category
- New `POST /api/tips` — submit a tip (auth required)
- New `POST /api/tips/vote` — upvote a tip (auth required)
- New `POST /api/tips/report` — flag a tip (auth required)

### Frontend Changes
- New `CityTips.vue` section on city detail page
- Tip submission form with category selector and character counter
- Upvote button with count
- Category filter tabs
- Auth gate for submission and voting

### Acceptance Criteria
- [ ] Users can submit tips (150 chars, categorized)
- [ ] Tips are upvoteable
- [ ] Tips sorted by upvotes within each category
- [ ] Rate limited: 1 tip per category per city per user
- [ ] Report/flag mechanism
- [ ] Auth required for submit/vote
- [ ] Works in both EN and PL

---

## IDEA-16: Cheapest Cities by Region Pages

**Priority:** 16 / 39
**Impact:** Medium-High | **Effort:** Low | **Schema Change:** No

### Problem
"Cheapest digital nomad cities in Europe" is a different intent than "best cities in Europe." Cost-focused pages attract early-funnel researchers. "Cheapest X" listicle queries dominate nomad search.

### What to Build
1. Pages at `/cheapest-cities/[region]` (e.g., `/cheapest-cities/europe`)
2. Same structure as region pages (IDEA-03) but sorted by `costForNomadInUsd` ascending
3. Show cost prominently with relative indicators: "43% cheaper than European average"
4. 7 pages + 1 global: `/cheapest-cities` for worldwide

### Data Source
- Same as IDEA-03 but `ORDER BY costForNomadInUsd ASC`

### API Changes
- Reuse region endpoint with a `sort=cost` query param, or create dedicated `GET /api/cities/cheapest/[region]`

### Frontend Changes
- New page `src/pages/cheapest-cities/[region].vue` (can share template with IDEA-03)
- Cost-focused city card variant showing cost prominently with % below/above average

### SEO
- Meta title: "Cheapest Digital Nomad Cities in [Region] | Monthly Costs & Rankings"
- Different from IDEA-03 — targets cost-intent keywords

### Acceptance Criteria
- [ ] 8 pages (7 regions + 1 global)
- [ ] Cities sorted by cost ascending
- [ ] Relative cost indicators (% below/above average)
- [ ] JSON-LD + hreflang
- [ ] Added to sitemap

---

## IDEA-17: Internet Speed Rankings Page

**Priority:** 17 / 39
**Impact:** Medium | **Effort:** Low | **Schema Change:** No

### Problem
Nobody owns city-level internet rankings for nomads. Cable.co.uk does country-level. A ranked table of cities by internet speed is useful and ranks well.

### What to Build
1. Page at `/fastest-internet` — ranked table of all 500+ cities by `internetSpeedCity`
2. Optionally filterable by region
3. Show: rank, city, country, internet speed (Mbps), global ranking
4. Variant pages: `/fastest-internet/[region]`

### Data Source
- `City.internetSpeedCity`, `City.internetSpeedCityRanking`

### API Changes
- New `GET /api/rankings/internet` — all cities sorted by `internetSpeedCity` desc, with pagination

### Frontend Changes
- New page `src/pages/fastest-internet/index.vue`
- Ranked table component with region filter tabs
- Speed visualization (progress bars or color coding)

### SEO
- Meta title: "Cities with Fastest Internet for Remote Work | 2026 Rankings"
- Table JSON-LD
- FAQ: "Which city has the fastest internet for digital nomads?"

### Acceptance Criteria
- [ ] Rankings page with all cities sorted by internet speed
- [ ] Region filter tabs
- [ ] Rank numbers displayed
- [ ] JSON-LD structured data
- [ ] Added to sitemap

---

## IDEA-18: Activate Referral System

**Priority:** 18 / 39
**Impact:** Medium | **Effort:** Low | **Schema Change:** No

### Problem
`User.referralCode` and `User.referredBy` already exist in the schema but aren't activated. The referral infrastructure is 80% built.

### What to Build
1. Show user's referral link on dashboard: `nomad.whoisarjen.com/join?ref=[code]`
2. Track referrals: when a new user signs up with `?ref=`, set their `referredBy`
3. Show referral count on dashboard
4. Optional: gate one feature behind "invite 3 friends to unlock" (e.g., trip planner export, city alerts)

### Frontend Changes
- Dashboard section: "Invite friends" with copyable referral link
- Referral count display
- Join page: capture `ref` query param and pass to auth flow
- Optional: gated feature unlock UI

### API Changes
- Extend auth registration to set `referredBy` from `ref` query param
- New `GET /api/referrals/count` — count of users referred by current user

### Acceptance Criteria
- [ ] Referral link visible on dashboard
- [ ] Copy-to-clipboard functionality
- [ ] New users signed up via referral link have `referredBy` set
- [ ] Referral count shown on dashboard
- [ ] Works in both EN and PL

---

## IDEA-19: English Proficiency Score

**Priority:** 19 / 39
**Impact:** Medium | **Effort:** Low | **Schema Change:** Yes (1 field)

### Problem
"Do people speak English in [city]?" is a top-5 nomad question. No field for this exists in the schema. EF English Proficiency Index provides free country-level data.

### What to Build
1. Add `englishProficiency Decimal?` field to `City` model (0-100 scale)
2. Populate from EF EPI country-level data (free, covers 100+ countries)
3. Display on city page and city cards as a badge: "English: High / Medium / Low"
4. Add as a filter option on the explore page

### Schema Change
```prisma
model City {
  // existing fields...
  englishProficiency Decimal? @db.Decimal(5, 2) // 0-100 EF EPI score
}
```

### Data Source
- EF English Proficiency Index (free, published annually)
- Country-level scores applied to all cities in that country
- Manual data entry or a one-time seed script

### API Changes
- Include in city card and city detail responses
- Add to filter options

### Frontend Changes
- Badge on city card and city page
- Filter slider or level selector in filter drawer

### Acceptance Criteria
- [ ] English proficiency displayed on city pages
- [ ] Filterable on explore page
- [ ] Data populated for at least 100 countries
- [ ] Works in both EN and PL

---

## IDEA-20: Favorites Split — Visited vs Planning

**Priority:** 20 / 39
**Impact:** Medium | **Effort:** Low | **Schema Change:** Yes (1 field)

### Problem
Favorites are a flat list. Splitting into "visited" and "planning to visit" creates intent signals and makes city pages feel alive ("82 visited, 34 planning").

### What to Build
1. Add `status` enum to `Favorite` model: `VISITED` | `PLANNING`
2. Update toggle UI: two buttons instead of one heart (or a dropdown on the heart)
3. City page shows aggregate counts: "82 nomads have been here, 34 are planning to visit"
4. Dashboard splits favorites into two tabs

### Schema Change
```prisma
enum FavoriteStatus {
  VISITED
  PLANNING
}

model Favorite {
  // existing fields...
  status FavoriteStatus @default(PLANNING)
}
```

### API Changes
- Extend `POST /api/favorites/toggle` to accept `status` param
- Extend city detail endpoint to return visited/planning counts
- Extend `GET /api/favorites` to include status field

### Frontend Changes
- Update favorite button UI to allow choosing status
- City page shows two counts
- Dashboard: two tabs for visited/planning

### Acceptance Criteria
- [ ] Users can mark cities as VISITED or PLANNING
- [ ] City pages show both counts
- [ ] Dashboard has two tabs
- [ ] Existing favorites default to PLANNING
- [ ] Works in both EN and PL

---

## IDEA-21: Schengen 90/180 Day Calculator

**Priority:** 21 / 39
**Impact:** Medium | **Effort:** Low | **Schema Change:** No

### Problem
50,000+ people use standalone Schengen calculators monthly. None are integrated with city data. An embedded calculator that recommends non-Schengen alternatives when days are low would capture that audience.

### What to Build
1. Page at `/tools/schengen-calculator`
2. User inputs past Schengen entries/exits (date pairs)
3. Calculator shows: days used, days remaining in current 180-day window, next reset date
4. When days are running low: "Running low? Consider these non-Schengen nomad cities:" with city recommendations
5. Optional: save entries to account for returning users

### Data Source
- Pure date arithmetic (client-side)
- Non-Schengen city recommendations from existing city data (filter by country codes outside Schengen zone)

### Frontend Changes
- New page `src/pages/tools/schengen-calculator.vue`
- Date entry form with add/remove rows
- Visual progress bar: days used / 90
- City recommendation section when days < 20

### SEO
- Meta title: "Schengen Calculator for Digital Nomads | 90/180 Day Tracker"
- Targets: "schengen calculator", "schengen days calculator", "90/180 rule calculator"

### Acceptance Criteria
- [ ] Date entry for Schengen entries/exits
- [ ] Correct 90/180 rolling window calculation
- [ ] Days remaining display with visual progress
- [ ] City recommendations when days are low
- [ ] Works in both EN and PL

---

## IDEA-22: Cost / Runway Calculator

**Priority:** 22 / 39
**Impact:** Medium | **Effort:** Low | **Schema Change:** No

### Problem
"I have $20K saved — how long can I live in each city?" is a powerful, personal, tweetable question. Pure client-side math against existing cost fields.

### What to Build
1. Widget on city page: "I have $[input] saved" -> "You can live here for [X] months"
2. Standalone page at `/tools/runway-calculator`:
   - Input: total savings + monthly income (optional)
   - Output: ranked list of cities with months of runway
   - Toggle between nomad/expat/local lifestyle tiers
3. Shareable result: "I can live 14 months in Tbilisi on my savings"

### Data Source
- `City.costForNomadInUsd` / `costForExpatInUsd` / `costForLocalInUsd`
- Client-side: `runway = savings / monthlyCost` (or `savings / (monthlyCost - monthlyIncome)` if income provided)

### Frontend Changes
- City page widget: savings input -> months display
- New page `src/pages/tools/runway-calculator.vue`
- Lifestyle tier toggle (nomad/expat/local)
- Ranked city list sorted by runway months

### Acceptance Criteria
- [ ] City page shows runway calculation
- [ ] Standalone page with full city comparison
- [ ] Lifestyle tier toggle
- [ ] Shareable result URL with query params
- [ ] Works in both EN and PL

---

## IDEA-23: City Alerts / Watchlist

**Priority:** 23 / 39
**Impact:** Medium | **Effort:** Medium | **Schema Change:** Yes

### Problem
No mechanism to bring users back when data changes. "Notify me when Bali cost drops below $1,500" is the best reason to create an account. NomadList paywalls this.

### What to Build
1. Users can set alerts on favorited cities:
   - Cost threshold: "notify when nomad cost drops below $X"
   - Internet threshold: "notify when speed exceeds X Mbps"
   - Safety change: "notify when safety level changes"
2. Weekly digest email: "Updates for your watched cities"
3. Dashboard section showing active alerts

### Schema Change
```prisma
model CityAlert {
  id          String      @id @default(cuid())
  userId      String
  citySlug    String
  metric      AlertMetric
  threshold   Decimal     @db.Decimal(10, 2)
  direction   AlertDirection // BELOW or ABOVE
  isActive    Boolean     @default(true)
  lastTriggered DateTime?
  createdAt   DateTime    @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  city City @relation(fields: [citySlug], references: [slug])

  @@index([userId, isActive])
}

enum AlertMetric {
  COST_NOMAD
  COST_EXPAT
  INTERNET_SPEED
  SAFETY
}

enum AlertDirection {
  BELOW
  ABOVE
}
```

### API Changes
- New `POST /api/alerts` — create alert (auth required)
- New `GET /api/alerts` — list user's alerts (auth required)
- New `DELETE /api/alerts/[id]` — remove alert (auth required)
- New cron endpoint to check thresholds and send emails

### Acceptance Criteria
- [ ] Users can create threshold alerts on cities
- [ ] Weekly digest email when thresholds are met
- [ ] Dashboard shows active alerts
- [ ] Max 10 alerts per user (to prevent abuse)
- [ ] Works in both EN and PL

---

## IDEA-24: Data Freshness Transparency

**Priority:** 24 / 39
**Impact:** Medium | **Effort:** Low | **Schema Change:** No

### Problem
NomadList's biggest credibility issue is inaccurate, user-submitted data. Your data comes from verified APIs (Open-Meteo, Numbeo, Speedtest). Making that visible builds trust and differentiation.

### What to Build
1. On each city page, show data source and last-updated date for each metric
2. Freshness indicator: green (< 30 days), yellow (30-90 days), red (> 90 days)
3. Methodology page at `/methodology` explaining all data sources, update frequency, and scoring formula

### Data Source
- `City.updatedAt` or dedicated timestamp fields per data source
- Cron job run history

### Frontend Changes
- Small "Source: Open-Meteo | Updated 3 days ago" labels under each data section
- Color-coded freshness dots
- New page `src/pages/methodology.vue`

### SEO
- E-E-A-T signal: Google rewards transparent methodology
- Targets: "how are digital nomad cities ranked"

### Acceptance Criteria
- [ ] Data source labels visible on city pages
- [ ] Freshness indicators (green/yellow/red)
- [ ] Methodology page explaining all data sources
- [ ] Works in both EN and PL

---

## IDEA-25: Monthly Nomad Report

**Priority:** 25 / 39
**Impact:** Medium | **Effort:** Low-Medium | **Schema Change:** No

### Problem
Data-driven reports get cited by journalists and bloggers = free backlinks. No recurring content asset exists that showcases the data.

### What to Build
1. Monthly auto-generated report page at `/reports/[year]-[month]` (e.g., `/reports/2026-03`)
2. Content: top 10 cheapest cities, fastest internet, biggest cost changes (if historical data exists), most favorited cities, best weather this month
3. Report index at `/reports`
4. Optional: PDF download

### Data Source
- Aggregate queries against existing data
- Favorites count per city
- MonthSummary for current month

### API Changes
- New `GET /api/reports/[year]-[month]` — aggregated monthly data

### Frontend Changes
- New page `src/pages/reports/[date].vue`
- Report index page
- Data visualizations (ranked tables, simple charts)

### Acceptance Criteria
- [ ] Monthly report pages generated from real data
- [ ] Report index listing all months
- [ ] Shareable and linkable
- [ ] Works in both EN and PL

---

## IDEA-26: Nomad Season Community Ratings

**Priority:** 26 / 39
**Impact:** Medium | **Effort:** Low-Medium | **Schema Change:** Yes

### Problem
Weather data shows temperature and rain but not "avoid August because of tourists and price spikes." Community-sourced seasonal ratings add the human layer.

### What to Build
1. On city pages, logged-in users rate: "Would you go back in [month]?" — thumbs up/down for each of 12 months
2. Aggregated display: "Community says: Best months are Nov-Feb. Avoid July-August."
3. Only users who have checked in or favorited the city can rate (prevents spam)

### Schema Change
```prisma
model SeasonRating {
  id        String  @id @default(cuid())
  userId    String
  citySlug  String
  month     Int     // 1-12
  isPositive Boolean

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  city City @relation(fields: [citySlug], references: [slug])

  @@unique([userId, citySlug, month])
  @@index([citySlug, month])
}
```

### Acceptance Criteria
- [ ] Users can rate months (thumbs up/down) for cities they've visited
- [ ] Aggregated results shown on city page
- [ ] No free text = no moderation needed
- [ ] Works in both EN and PL

---

## IDEA-27: Digital Nomad Visa Directory

**Priority:** 27 / 39
**Impact:** High | **Effort:** High | **Schema Change:** Yes (new model)

### Problem
Visa questions are the #2 most asked topic in r/digitalnomad. No single free tool has structured, filterable visa data. Nomadlist's coverage is paywalled and shallow.

### What to Build
1. New `Visa` model with structured fields per country:
   - Visa-free duration by passport type (US, EU, UK)
   - Digital nomad visa: availability, cost, income requirement, duration, link to apply
   - Schengen/non-Schengen status
   - Tax residency threshold (183 days, etc.)
2. Country pages (IDEA-04) get a "Visa Info" section
3. Filterable index: "Show me countries where US passport holders can stay 90+ days"
4. Standalone page at `/visas` with filterable directory

### Schema Change
```prisma
model CountryVisa {
  id               String  @id @default(cuid())
  countryCode      String  @unique
  countryName      String
  visaFreeUS       Int?    // days for US passport
  visaFreeEU       Int?    // days for EU passport
  visaFreeUK       Int?    // days for UK passport
  hasNomadVisa     Boolean @default(false)
  nomadVisaCost    Decimal? @db.Decimal(10, 2)
  nomadVisaDuration Int?   // months
  nomadVisaIncome  Decimal? @db.Decimal(10, 2) // monthly income requirement
  nomadVisaLink    String?
  isSchengen       Boolean @default(false)
  taxThresholdDays Int?    // days before tax residency
  updatedAt        DateTime @updatedAt
}
```

### Notes
- High effort due to data collection and maintenance
- Legal accuracy matters — add disclaimers
- Start with top 30 nomad countries, expand over time
- Data sources: government websites, Citizen Remote, existing databases

### Acceptance Criteria
- [ ] Visa info section on country pages
- [ ] Filterable visa directory at `/visas`
- [ ] Passport selector (US/EU/UK at minimum)
- [ ] Digital nomad visa details where available
- [ ] Clear "last updated" dates and disclaimers
- [ ] Works in both EN and PL

---

## IDEA-28: Affiliate Integration

**Priority:** 28 / 39
**Impact:** Medium-High | **Effort:** Low | **Schema Change:** No

### Problem
No monetization path exists. Contextual affiliate links on city pages are non-intrusive and useful.

### What to Build
1. On city pages, add contextual affiliate links:
   - "Book accommodation in [city]" -> Booking.com (4-8% commission)
   - "Get travel insurance" -> SafetyWing ($50/referral)
   - "Open a bank account for travel" -> Wise (per-card commission)
2. Non-intrusive placement: small section below city data, not banners
3. Clearly labeled as affiliate links (transparency builds trust)

### Implementation
- Apply for affiliate programs: Booking.com, SafetyWing, Wise
- Add affiliate links with city-specific parameters where possible
- Small component at bottom of city page

### Important
- Only implement after traffic is established (1,000+ daily visitors)
- SafetyWing alone: 10 signups/month = $500/month
- Keep it subtle — no popups, no banners, no interstitials

### Acceptance Criteria
- [ ] Affiliate links on city pages (non-intrusive)
- [ ] Clearly labeled as affiliate/partner links
- [ ] City-specific where possible (e.g., Booking.com link for that city)
- [ ] Works in both EN and PL

---

## IDEA-29: City x Month Deep Pages

**Priority:** 29 / 39
**Impact:** Medium-High | **Effort:** Medium | **Schema Change:** No

### Problem
Someone searching "Bangkok in January digital nomad" is about to book flights. `MonthSummary` has the data for 500 cities x 12 months = 6,000 possible pages. Each is a high-intent long-tail keyword.

### What to Build
1. Pages at `/cities/[slug]/[month]` (e.g., `/cities/bangkok/january`)
2. Content: month-specific weather (temp, rain, sunshine), cost for that month (if seasonal data available, otherwise annual), community season rating (IDEA-26), what to expect
3. Links to the full city page and to "best cities for [month]" (IDEA-10)

### Crawl Budget Strategy
- Start with top 100 cities only (1,200 pages)
- Only index cities where `totalScore` variance across months is high (seasonality matters)
- Use `noindex` on low-value pages
- Expand gradually

### Data Source
- `MonthSummary` for the specific city + month

### API Changes
- New `GET /api/cities/[slug]/month/[month]` — month-specific data for a city

### Acceptance Criteria
- [ ] Pages generated for top 100 cities x 12 months
- [ ] Month-specific weather data displayed
- [ ] Links to full city page and month rankings
- [ ] Added to sitemap (top cities only)
- [ ] Crawl budget managed (noindex on low-value pages)

---

## IDEA-30: Granular Cost Breakdown

**Priority:** 30 / 39
**Impact:** High | **Effort:** High | **Schema Change:** Yes (new model)

### Problem
Only aggregate cost buckets exist (`costForNomadInUsd`, etc.). Numbeo gets 5M visits/month showing 50+ individual prices (meal cost, gym, beer, apartment rent). This depth is what converts visitors and ranks for competitive keywords.

### What to Build
1. New `CityPrice` model with 30-50 line items per city
2. Categories: food, housing, transport, utilities, entertainment, personal care
3. Display on city pages: expandable cost breakdown table
4. Enable comparison: "A restaurant meal in Bangkok costs 70% less than in Lisbon"

### Schema Change
```prisma
model CityPrice {
  id        String  @id @default(cuid())
  citySlug  String
  category  PriceCategory
  item      String  // "Meal at restaurant", "1-bedroom apartment"
  priceUsd  Decimal @db.Decimal(10, 2)
  updatedAt DateTime @updatedAt

  city City @relation(fields: [citySlug], references: [slug])

  @@unique([citySlug, item])
  @@index([citySlug, category])
}

enum PriceCategory {
  FOOD
  HOUSING
  TRANSPORT
  UTILITIES
  ENTERTAINMENT
  PERSONAL_CARE
}
```

### Notes
- Requires data pipeline: Numbeo data download, web scraping, or crowdsourcing
- Start with top 50 cities
- Consider user submissions (IDEA-15 style) to scale

### Acceptance Criteria
- [ ] Cost breakdown table on city pages (30+ items)
- [ ] Categorized and expandable
- [ ] Data for at least top 50 cities
- [ ] Comparison-ready data structure

---

## IDEA-31: User City Reviews

**Priority:** 31 / 39
**Impact:** Medium-High | **Effort:** Medium | **Schema Change:** Yes

### Problem
No social proof on city pages. NomadList has 8,000+ user reviews. Even simple 5-star ratings on key dimensions add trust and unique content.

### What to Build
1. Logged-in users can rate a city on 5 dimensions (1-5 stars):
   - Internet reliability
   - Value for money
   - Safety (felt)
   - Vibe & community
   - Ease of arrival
2. Optional text review (500 chars max)
3. Average ratings displayed on city page
4. One review per user per city

### Schema Change
```prisma
model CityReview {
  id                 String   @id @default(cuid())
  userId             String
  citySlug           String
  internetRating     Int      // 1-5
  valueRating        Int      // 1-5
  safetyRating       Int      // 1-5
  vibeRating         Int      // 1-5
  arrivalRating      Int      // 1-5
  content            String?  @db.VarChar(500)
  isActive           Boolean  @default(true)
  createdAt          DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  city City @relation(fields: [citySlug], references: [slug])

  @@unique([userId, citySlug])
  @@index([citySlug, isActive])
}
```

### Acceptance Criteria
- [ ] 5-dimension rating form on city pages
- [ ] Average ratings displayed prominently
- [ ] Optional text review (500 chars)
- [ ] One review per user per city
- [ ] Moderation: flag/report mechanism
- [ ] Works in both EN and PL

---

## IDEA-32: Public Nomad Profiles

**Priority:** 32 / 39
**Impact:** Medium | **Effort:** Medium | **Schema Change:** Minimal

### Problem
Users have no public presence. A profile showing cities visited, tips submitted, and travel record creates identity investment = stickiness.

### What to Build
1. Public page at `/nomads/[number]` (using existing `User.number` field)
2. Shows: cities visited (from Favorites), cities planned, tips submitted, member since date
3. Privacy toggles: users control what's visible
4. No follower system (keep it simple)

### Data Source
- Existing: `User`, `Favorite`, `CityTip` (IDEA-15), `CheckIn` (IDEA-11)

### Frontend Changes
- New page `src/pages/nomads/[number].vue`
- Privacy settings on dashboard
- Link from tips and check-ins to the author's profile

### Acceptance Criteria
- [ ] Public profile page for each user
- [ ] Shows travel history and contributions
- [ ] Privacy controls
- [ ] Works in both EN/PL

---

## IDEA-33: Public Data API

**Priority:** 33 / 39
**Impact:** Medium | **Effort:** Medium | **Schema Change:** Yes (API key model)

### Problem
No monetization path from developers/researchers. Clean structured nomad data for 500+ cities has real value.

### What to Build
1. Documented REST API with rate limiting
2. Free tier: 100 requests/day
3. Paid tier: $19/month, 10,000 requests/day
4. Endpoints: city list, city detail, compare, rankings

### Notes
- Phase 2 monetization — build after traffic established
- Generates backlinks from developer documentation

### Acceptance Criteria
- [ ] API documentation page
- [ ] API key management
- [ ] Rate limiting (free/paid tiers)
- [ ] Core endpoints exposed

---

## IDEA-34: Coworking Space Directory

**Priority:** 34 / 39
**Impact:** Medium | **Effort:** Medium | **Schema Change:** Yes

### Problem
Finding coworking spaces is the #1 operational challenge for nomads in a new city. No free tool has clean, structured coworking data with nomad-relevant fields (WiFi speed, daily price).

### What to Build
1. City pages get a "Coworking" section
2. User submissions: name, address, daily/monthly price, WiFi speed (self-reported), vibe tags
3. Admin approval (manual `isApproved` field)
4. Sort by rating/votes

### Schema Change
```prisma
model CoworkingSpace {
  id          String   @id @default(cuid())
  citySlug    String
  name        String
  address     String?
  dailyPrice  Decimal? @db.Decimal(10, 2)
  monthlyPrice Decimal? @db.Decimal(10, 2)
  wifiSpeed   Int?     // Mbps self-reported
  isApproved  Boolean  @default(false)
  submittedBy String
  createdAt   DateTime @default(now())

  city City @relation(fields: [citySlug], references: [slug])
  user User @relation(fields: [submittedBy], references: [id])

  @@index([citySlug, isApproved])
}
```

### Acceptance Criteria
- [ ] Coworking section on city pages
- [ ] User submission form
- [ ] Admin approval workflow
- [ ] Shows name, price, WiFi speed

---

## IDEA-35: "Pack for This City" Practical Info

**Priority:** 35 / 39
**Impact:** Medium | **Effort:** Low-Medium | **Schema Change:** Yes (country-level)

### Problem
Practical arrival logistics (plug type, SIM card, taxi app) are searched separately by nomads. This data is largely static and country-level.

### What to Build
1. New country-level fields: plug type, voltage, best SIM carrier, taxi app, tipping culture
2. Display on city pages in a "Practical Info" section
3. Targets: "best SIM card [city]", "plug type [country]"

### Schema Change
```prisma
model CountryInfo {
  id           String  @id @default(cuid())
  countryCode  String  @unique
  plugType     String? // "Type C, Type F"
  voltage      Int?    // 220
  frequency    Int?    // 50
  bestSim      String? // "AIS, DTAC, TrueMove"
  taxiApp      String? // "Grab, Bolt"
  tippingNote  String? @db.VarChar(200)
}
```

### Acceptance Criteria
- [ ] Practical info section on city pages
- [ ] Data for at least top 50 countries
- [ ] Works in both EN/PL

---

## IDEA-36: Historical Cost Trends

**Priority:** 36 / 39
**Impact:** Medium | **Effort:** Low (start) / High (payoff) | **Schema Change:** Yes

### Problem
No tool shows "Is Chiang Mai getting more expensive?" Historical cost snapshots take 6-12 months to become useful, but the seed needs planting now.

### What to Build
1. Monthly cron job: snapshot all city costs into a `CostSnapshot` table
2. After 6+ months: show trend line on city pages
3. After 12+ months: "Cost of living in [city] has increased 12% in the past year"

### Schema Change
```prisma
model CostSnapshot {
  id             String   @id @default(cuid())
  citySlug       String
  costNomad      Decimal  @db.Decimal(10, 2)
  costExpat      Decimal  @db.Decimal(10, 2)
  costLocal      Decimal  @db.Decimal(10, 2)
  snapshotMonth  DateTime // first of month

  city City @relation(fields: [citySlug], references: [slug])

  @@unique([citySlug, snapshotMonth])
  @@index([citySlug])
}
```

### Action Now
- Add the model and the cron job to start collecting data immediately
- The frontend visualization comes later (6-12 months)

### Acceptance Criteria
- [ ] CostSnapshot model created
- [ ] Monthly cron job records all city costs
- [ ] (Future) Trend line on city pages after 6+ months of data

---

## IDEA-37: Trending Cities List

**Priority:** 37 / 39
**Impact:** Medium | **Effort:** Medium | **Schema Change:** No

### Problem
No momentum signal exists. "Fastest growing nomad hubs" content gets press coverage and backlinks. NomadList's trending page gets cited by CNBC and TheStreet.

### What to Build
1. Page at `/trending` showing cities with the most momentum
2. Momentum signal derived from: favorites velocity, check-in growth, Google Trends data
3. Updated monthly
4. "Fastest growing nomad cities" report for press

### Data Source
- Favorites: count new favorites per city per month
- Check-ins (IDEA-11): count per city per month
- Optional: Google Trends API (free but rate-limited)

### Acceptance Criteria
- [ ] Trending page with momentum rankings
- [ ] Updated monthly
- [ ] Clear methodology explanation
- [ ] Shareable and linkable

---

## IDEA-38: City Forum / Q&A

**Priority:** 38 / 39
**Impact:** Medium | **Effort:** High | **Schema Change:** Yes (large)

### Problem
NomadList's forum ranks well for long-tail keywords. City-scoped Q&A is better than general forums because it's focused and discoverable.

### What to Build
1. Each city page gets a "Questions" tab
2. Users post questions, others answer
3. Upvoteable answers
4. Questions expire after 6 months (auto-archive)
5. Email notifications for replies

### Notes
- Only build at 500+ active users — an empty forum is worse than no forum
- Needs moderation tools (flag/report at minimum)
- High maintenance overhead

### Schema Change
```prisma
model Thread {
  id        String   @id @default(cuid())
  userId    String
  citySlug  String
  title     String   @db.VarChar(200)
  content   String   @db.VarChar(1000)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  expiresAt DateTime // 6 months from creation

  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  city    City     @relation(fields: [citySlug], references: [slug])
  replies Reply[]

  @@index([citySlug, isActive, createdAt])
}

model Reply {
  id        String   @id @default(cuid())
  threadId  String
  userId    String
  content   String   @db.VarChar(1000)
  upvotes   Int      @default(0)
  createdAt DateTime @default(now())

  thread Thread @relation(fields: [threadId], references: [id], onDelete: Cascade)
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Acceptance Criteria
- [ ] Q&A section on city pages
- [ ] Question + answer threading
- [ ] Upvoteable answers
- [ ] Auto-expire after 6 months
- [ ] Moderation tools (flag/report)
- [ ] Email notifications

---

## IDEA-39: Neighborhood Guides

**Priority:** 39 / 39
**Impact:** Medium-High | **Effort:** High | **Schema Change:** Yes (new model)

### Problem
All data is city-level. For cities nomads actually move to (Lisbon, Chiang Mai, Medellin, Bali), neighborhood choice is the real decision. NomadList's neighborhood feature is broken.

### What to Build
1. New `Neighborhood` model with sub-city data
2. Start with top 20 nomad cities, 3-5 neighborhoods each
3. Data: name, description, average rent, vibe tags, walkability, nomad density
4. City pages get a "Neighborhoods" section
5. Standalone pages: `/cities/lisbon/neighborhoods/baixa`

### Schema Change
```prisma
model Neighborhood {
  id          String  @id @default(cuid())
  citySlug    String
  slug        String
  name        String
  description String? @db.VarChar(500)
  avgRent     Decimal? @db.Decimal(10, 2)
  vibe        String[] // ["quiet", "social", "artsy"]
  walkability Int?    // 1-10

  city City @relation(fields: [citySlug], references: [slug])

  @@unique([citySlug, slug])
}
```

### Notes
- Very high effort for comprehensive data
- Start editorial: manually write 3-5 neighborhoods for top 20 cities
- Consider user submissions to scale
- True differentiation if done well

### Acceptance Criteria
- [ ] Neighborhood section on city pages (top 20 cities)
- [ ] 3-5 neighborhoods per city with descriptions
- [ ] Standalone neighborhood pages
- [ ] Works in both EN/PL
