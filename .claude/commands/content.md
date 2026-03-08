# Content Batch — Create $ARGUMENTS articles

You are the content batch orchestrator for **nomad.whoisarjen.com**.

The user wants **$ARGUMENTS** articles created. If no number is given, default to **5**.

## Your Job

Execute the full pipeline: analyze → write → translate → validate → insert. Each article is independent — insert as soon as it's ready, don't wait for others.

## Step 1: Read Current State

Read these files to understand what exists:
- `.claude/marketing/published-log.md` — articles already published (avoid duplicates)
- `.claude/marketing/content/strategy/daily-content-automation-plan.md` — templates and rules

## Step 2: Pick Keywords (Keyword Analyst)

### Step 2a: Check GSC for Organic Keyword Opportunities

Query Google Search Console for keywords Google already associates with the site. Run via bash:

```bash
echo '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"search_analytics","arguments":{"siteUrl":"sc-domain:nomad.whoisarjen.com","startDate":"YYYY-MM-DD","endDate":"YYYY-MM-DD","dimensions":"query","rowLimit":100}},"id":1}' | GOOGLE_APPLICATION_CREDENTIALS=/Users/kamilowczarek/.config/gsc-credentials.json npx -y mcp-server-gsc 2>/dev/null
```

Use the last 30 days as the date range.

**If GSC query fails** (timeout, auth error, empty response, or any error): log a warning to the user ("GSC unavailable, proceeding with discovery keywords") and skip directly to Step 2b. Do NOT block the pipeline.

**Analyze GSC keywords (only if data returned):**
1. Look for queries with **impressions ≥ 5** — keywords Google already ranks or considers the site for
2. Cross-reference with existing articles (`SELECT slug FROM "Article"`) — skip keywords already covered
3. A GSC keyword is "interesting" if:
   - It has ≥ 10 impressions AND no matching article exists, OR
   - It has any clicks (even 1), OR
   - It targets a city/topic the site has data for but no article yet
4. Extract the city name or topic from the query (e.g. "digital nomad sao vicente" → city: sao-vicente-cape-verde)
5. Verify the extracted city slug exists in the DB

**Decision:**
- If interesting GSC keywords found → prioritize them for article creation (fill remaining slots with discovery)
- If no interesting GSC keywords (< 3 queries, all low impressions, or all already covered) → skip to Step 2b entirely

### Step 2b: Discovery Keywords (Normal Flow)

Query the database to decide what to write. Use Neon MCP (`mcp__Neon__run_sql`, projectId: `flat-shape-62285932`).

### Gather data:
```sql
-- Cities with richest data (have costs + internet + safety), ordered by population
SELECT slug, name, country, region, "costForNomadInUsd", "internetSpeedCity", safety, population
FROM "City"
WHERE "costForNomadInUsd" IS NOT NULL AND "internetSpeedCity" IS NOT NULL
ORDER BY population DESC
LIMIT 100;

-- Existing article slugs (to avoid duplicates)
SELECT slug FROM "Article";
```

### Pick N keywords using this logic:
1. Check `published-log.md` for what types exist (city-cost / comparison / filtered)
2. **GSC-sourced keywords come first** — if Step 2a found opportunities, use those slots first
3. Fill remaining slots with discovery: ~60% city-cost, ~20% comparison, ~20% filtered/regional
4. For **city-cost**: pick highest-population cities with no article yet
5. For **comparison**: pick pairs in same region, both in top-50, no comparison exists
6. For **filtered**: rotate through cheapest, safest, best internet, best weather, by region, seasonal
7. Ensure at least 2 different regions in the batch
8. Verify all city slugs exist in DB
9. **Never duplicate** — check both `published-log.md` AND existing article slugs in DB

## Step 3: Spawn N Pipeline Agents (All in Parallel, Background)

For each keyword, spawn one `general-purpose` agent as a background pipeline. **Launch ALL of them in a single message** so they run in parallel.

Each pipeline agent receives this prompt (fill in the specifics):

```
You are a content pipeline for nomad.whoisarjen.com. Create ONE complete article and insert it into the database.

## Your Article
- Type: [city-cost / comparison / filtered]
- Keyword: "[the keyword]"
- City slugs: [list]
- Suggested slug: "[slug]"

## Step 1: Query DB for Real Data

Use Neon MCP (mcp__Neon__run_sql, projectId: "flat-shape-62285932") to get real numbers.

For city-cost articles, run:
SELECT name, country, region, "costForNomadInUsd", "costForExpatInUsd", "costForLocalInUsd",
       "internetSpeedCity", safety, "airQuality", "healthCare", population
FROM "City" WHERE slug = '[city-slug]';

SELECT month, "temperatureAvg", "temperatureMin", "temperatureMax", "humidityAvg", "precipitationSum"
FROM "MonthSummary" WHERE "citySlug" = '[city-slug]' ORDER BY month;

SELECT "safetyIndex", "healthCareIndex", "costOfLivingIndex", "qualityOfLifeIndex"
FROM "QualityIndex" WHERE "citySlug" = '[city-slug]';

-- 3-4 similar cities for comparison section
SELECT slug, name, "costForNomadInUsd", "internetSpeedCity", safety
FROM "City"
WHERE region = '[same-region]' AND slug != '[city-slug]' AND "costForNomadInUsd" IS NOT NULL
ORDER BY ABS("costForNomadInUsd" - [target-cost]) LIMIT 4;

For comparison articles: query both cities.
For filtered articles: query top 10-15 by the filter metric.

## Step 2: Write English Article

Use the data to write a 1500-2500 word article. Every number MUST come from the query results.

[Include the relevant template from the strategy doc based on article type]

Output these English fields:
- titleEn (under 70 chars)
- excerptEn (1-2 sentences with key data point)
- contentEn (full markdown, 1500-2500 words)
- metaTitleEn (under 60 chars)
- metaDescEn (120-155 chars, include key number)
- FAQ pairs: 4-6 questionEn/answerEn pairs

## Step 3: Translate to 10 Languages (Parallel)

Spawn 10 translation agents in parallel (one per language: PL, ES, DE, PT, FR, KO, AR, TR, JA, IT).

Each translator receives the EN title, excerpt, content, metaTitle, metaDesc, and FAQ pairs.

Translation rules:
- Numbers, prices, speeds stay the same
- City names stay in original form
- Internal links stay the same
- Meta title under 60 chars in target language
- Meta description 120-155 chars in target language
- Natural translation, not word-for-word

Collect all 10 translations.

## Step 4: Validate

Hard fails (do NOT insert):
- Check slug doesn't already exist: SELECT slug FROM "Article" WHERE slug = '[slug]'
- titleEn and titlePl must be non-empty
- contentEn must be 500+ words
- Primary city slug must exist in City table

Soft warnings (insert anyway, note in report):
- Any meta title over 60 chars → truncate
- Any meta description over 155 chars → truncate
- Translation content under 400 words → flag

## Step 5: Insert via SQL

Use mcp__Neon__run_sql to insert. Build the INSERT statement with ALL 11 languages:

INSERT INTO "Article" (
  slug, "isPublished", "publishedAt",
  "titleEn", "excerptEn", "contentEn", "metaTitleEn", "metaDescEn",
  "titlePl", "excerptPl", "contentPl", "metaTitlePl", "metaDescPl",
  "titleEs", "excerptEs", "contentEs", "metaTitleEs", "metaDescEs",
  "titleDe", "excerptDe", "contentDe", "metaTitleDe", "metaDescDe",
  "titlePt", "excerptPt", "contentPt", "metaTitlePt", "metaDescPt",
  "titleFr", "excerptFr", "contentFr", "metaTitleFr", "metaDescFr",
  "titleKo", "excerptKo", "contentKo", "metaTitleKo", "metaDescKo",
  "titleAr", "excerptAr", "contentAr", "metaTitleAr", "metaDescAr",
  "titleTr", "excerptTr", "contentTr", "metaTitleTr", "metaDescTr",
  "titleJa", "excerptJa", "contentJa", "metaTitleJa", "metaDescJa",
  "titleIt", "excerptIt", "contentIt", "metaTitleIt", "metaDescIt",
  faqs, "readingTimeMinutes"
) VALUES (...);

Then insert city links:
INSERT INTO "ArticleCityMap" ("articleSlug", "citySlug", "isPrimary") VALUES ('[slug]', '[city]', true);

## Step 6: Report

Return a summary:
- Status: published / failed
- Slug
- Type and keyword
- Word count (EN)
- Translations completed (X/10)
- Any warnings
```

## Step 4: Collect Results & Log

As each pipeline agent completes (they report independently), append to `.claude/marketing/published-log.md`.

## Step 5: Report Summary

After all N agents finish, present:

```
## Content Batch Complete

**Articles requested:** N
**Published:** X/N
**Failed:** Y (with reasons)

| # | Slug | Type | Languages | Warnings |
|---|------|------|-----------|----------|
| 1 | cost-of-living-bangkok-... | city-cost | 11/11 | none |
| 2 | lisbon-vs-porto-... | comparison | 10/11 | KO translation short |
| ...

**Next trigger will analyze fresh and pick the next best keywords.**
```
