# Weekly Content Batch Strategy for nomad.whoisarjen.com

**Created:** 2026-03-04
**Updated:** 2026-03-04 (v5 -- /content skill, dynamic analysis, parallel pipelines)
**Status:** Master plan - ready for implementation
**Trigger:** `/content N` (e.g., `/content 7` for 7 articles)

---

## The Flow

```
You: "/content 7"
    |
    v
Keyword Analyst queries DB + reads published-log.md
    → picks 7 best keywords dynamically
    |
    v
7 pipeline agents spawn in parallel (background)
Master spawns 5 independent pipelines (background, in parallel)
    |
    +---> Pipeline 1 ----+
    +---> Pipeline 2 ----+--- each runs independently
    +---> Pipeline 3 ----+--- first to finish inserts first
    +---> Pipeline 4 ----+
    +---> Pipeline 5 ----+
```

Each pipeline (fully independent):

```
[EN Writer] writes English article
    |
    v
[10 Translation Agents] run in parallel
    PL, ES, DE, PT, FR, KO, AR, TR, JA, IT
    |
    v (all 10 return)
[Validate] complete object with all 11 languages
    |
    v
[Insert] single prisma.article.create with ALL fields populated
    |
    v
[Report] result back to master
```

Key: Pipeline 3 might finish before Pipeline 1. That's fine — it inserts immediately. No waiting.

---

## Phase 1: Keyword Analyst Agent

Runs first. Returns 5 briefs. One agent, one call.

### What it reads

- `published-log.md` — what articles already exist
- Database: City table — which cities have richest data but no article
- Database: Article table — existing slugs to avoid duplicates

### Decision algorithm

1. Count published articles by type from log (city-cost / comparison / filtered)
2. Determine batch mix (target ~3 city-cost + 1 comparison + 1 filtered, flex based on gaps)
3. For each slot, pick best keyword:
   - **city-cost**: highest-population city with no article yet (population ~ search volume)
   - **comparison**: pair where both cities are top-50 by nomad score and no comparison exists
   - **filtered**: rotate through cheapest, safest, best internet, best weather, by region, seasonal
4. Validate: no slug conflicts, all city slugs exist, at least 2 regions represented
5. Return 5 briefs

### Brief format

```
{
  type: "city-cost",
  keyword: "cost of living in bangkok for digital nomads",
  citySlugs: ["bangkok"],
  suggestedSlug: "cost-of-living-bangkok-digital-nomads-2026"
}
```

---

## Phase 2: Five Independent Pipelines

Master spawns all 5 in background. Each is a self-contained pipeline agent (general-purpose) that orchestrates its own writer + translators.

### Step 1: EN Writer

The pipeline agent writes (or spawns a writer for) the English article.

**For city-cost articles**, queries DB then writes in **HTML** (not Markdown):
```html
<p>[Opening: 2-3 sentences. Key cost number. Target keyword naturally.]</p>

<h2>Monthly Cost Breakdown</h2>
<table><thead><tr><th>Lifestyle</th><th>Monthly Cost</th></tr></thead>
<tbody><tr><td>Digital Nomad</td><td>$X</td></tr>...</tbody></table>
<p>[Narrative contextualizing the numbers]</p>

<h2>Internet &amp; Remote Work</h2>
<p>[internetSpeedCity + comparison to ~35 Mbps global average]</p>

<h2>Weather &amp; Best Time to Visit</h2>
<table>...[MonthSummary: 12-month table with temperatures]...</table>

<h2>Safety &amp; Healthcare</h2>
<p>[safety level, healthCare level, quality indices]</p>

<h2>Air Quality</h2>
<p>[airQuality, airQualityNow]</p>

<h2>How [City] Compares</h2>
<p>[3-4 similar cities from DB. Internal links to /cities/[slug]]</p>

<h2>FAQ</h2>
<p>[4-6 Q&A pairs citing specific data points]</p>

<h2>Bottom Line</h2>
<p>[2-3 sentence verdict]</p>
```

**For comparison articles**: side-by-side data tables + verdict section.

**For filtered articles**: ranked list of top 10 cities by the filter metric.

Output: complete EN fields (titleEn, excerptEn, contentEn, metaTitleEn, metaDescEn, FAQ questionEn/answerEn).

### Step 2: 10 Translation Agents (Parallel)

Immediately after EN is ready, spawn 10 translation agents in parallel — one per language:

```
EN content ready
    |
    +---> Translate to PL (agent)
    +---> Translate to ES (agent)
    +---> Translate to DE (agent)
    +---> Translate to PT (agent)
    +---> Translate to FR (agent)
    +---> Translate to KO (agent)
    +---> Translate to AR (agent)
    +---> Translate to TR (agent)
    +---> Translate to JA (agent)
    +---> Translate to IT (agent)
```

Each translation agent receives:
- The EN title, excerpt, content, metaTitle, metaDesc
- The EN FAQ pairs
- The target language code

Each returns:
- title[Lang], excerpt[Lang], content[Lang], metaTitle[Lang], metaDesc[Lang]
- FAQ question[Lang]/answer[Lang] pairs

**Translation rules:**
- Numbers, prices, speeds stay the same (no conversion)
- City names stay in original form (Bangkok, not Bangkoku)
- Internal links stay the same (URL slugs are language-independent)
- Meta title under 60 chars in target language
- Meta description 120-155 chars in target language
- Content must be natural in the target language, not word-for-word machine translation

### Step 3: Assemble Complete Object

Pipeline agent collects EN + all 10 translations into one article object:

```typescript
const article = {
  slug: "cost-of-living-bangkok-digital-nomads-2026",
  isPublished: true,
  publishedAt: new Date(),

  // English (from writer)
  titleEn, excerptEn, contentEn, metaTitleEn, metaDescEn,

  // Polish (from PL translator)
  titlePl, excerptPl, contentPl, metaTitlePl, metaDescPl,

  // Spanish (from ES translator)
  titleEs, excerptEs, contentEs, metaTitleEs, metaDescEs,

  // German (from DE translator)
  titleDe, excerptDe, contentDe, metaTitleDe, metaDescDe,

  // Portuguese (from PT translator)
  titlePt, excerptPt, contentPt, metaTitlePt, metaDescPt,

  // French (from FR translator)
  titleFr, excerptFr, contentFr, metaTitleFr, metaDescFr,

  // Korean (from KO translator)
  titleKo, excerptKo, contentKo, metaTitleKo, metaDescKo,

  // Arabic (from AR translator)
  titleAr, excerptAr, contentAr, metaTitleAr, metaDescAr,

  // Turkish (from TR translator)
  titleTr, excerptTr, contentTr, metaTitleTr, metaDescTr,

  // Japanese (from JA translator)
  titleJa, excerptJa, contentJa, metaTitleJa, metaDescJa,

  // Italian (from IT translator)
  titleIt, excerptIt, contentIt, metaTitleIt, metaDescIt,

  faqs: [
    {
      questionEn, answerEn,
      questionPl, answerPl,
      questionEs, answerEs,
      questionDe, answerDe,
      questionPt, answerPt,
      questionFr, answerFr,
      questionKo, answerKo,
      questionAr, answerAr,
      questionTr, answerTr,
      questionJa, answerJa,
      questionIt, answerIt,
    }
  ],

  readingTimeMinutes: 6,
  featuredImageUrl: null,

  cities: {
    create: [{ citySlug: "bangkok", isPrimary: true }]
  }
}
```

### Step 4: Validate

**Hard fails (no insert):**
- Slug already exists in Article table
- Any required field empty (titleEn, titlePl, excerptEn, excerptPl, contentEn, contentPl)
- contentEn under 500 words
- Primary city slug does not exist in City table

**Soft warnings (insert anyway, flag in report):**
- Any meta title over 60 chars (auto-truncate)
- Any meta description over 155 chars (auto-truncate)
- Any translation content under 400 words (might indicate failed translation)
- Fewer than 4 FAQ pairs
- No featured image

### Step 5: Insert

Single `prisma.article.create()` with all 11 languages populated. One DB call.

### Step 6: Report

Pipeline returns to master:
```
{
  status: "published",
  slug: "cost-of-living-bangkok-digital-nomads-2026",
  type: "city-cost",
  keyword: "cost of living in bangkok for digital nomads",
  wordCountEn: 1800,
  translationsCompleted: 10,
  translationsFailed: 0,
  warnings: ["metaTitleKo truncated to 58 chars"]
}
```

This report arrives the moment THIS pipeline finishes — not when all 5 finish.

---

## Timing

Approximate per pipeline:
- EN writing: ~60s
- 10 translations (parallel): ~60-90s
- Validation + insert: ~5s
- **Total per article: ~2-3 minutes**

All 5 pipelines run in parallel, so total wall time for a full batch: **~3-5 minutes**.

First article inserts at ~2 min. Last article inserts at ~5 min. No waiting.

---

## Failure Handling

| Scenario | What happens |
|---|---|
| EN writer fails | Pipeline reports failure. Other 4 pipelines unaffected. |
| 1 of 10 translators fails | Pipeline inserts anyway — failed language gets `""` (schema default). Flagged in report. |
| Slug conflict on insert | Pipeline reports conflict. No insert. Others unaffected. |
| City slug doesn't exist | Pipeline reports error. No insert. Others unaffected. |
| All 5 pipelines fail | Master reports "0/5 published" and lists all reasons. |

If a translator fails, the article still publishes with the other 10 languages filled. Missing language falls back to `""` which means that language version won't show content — but the other 10 do. This is better than blocking the whole insert for one failed translation.

---

## The Published Log

`published-log.md` is append-only. Each insert adds a row.

```markdown
| Date | Slug | Type | Keyword | Langs | Warnings |
|------|------|------|---------|-------|----------|
| 2026-03-05 | cost-of-living-bangkok-... | city-cost | cost of living in bangkok... | 11/11 | none |
| 2026-03-05 | lisbon-vs-porto-... | comparison | lisbon vs porto... | 10/11 (KO failed) | metaTitleKo failed |
```

The analyst reads this log on the next trigger to know what exists.

---

## Content Rules (Non-Negotiable)

1. **Every number from the database.** No hallucinated data.
2. **All 11 languages per insert.** One object, one DB call.
3. **Each pipeline is independent.** First done = first inserted.
4. **Validation before insert.** Hard fails block the insert. Soft warnings don't.
5. **Failed translations don't block.** Missing lang gets `""`, article publishes with rest.
6. **Analyst runs first, fresh every trigger.** No static queue.
7. **HTML format, not Markdown.** All article content fields (contentEn, contentPl, etc.) must be written in HTML (`<h2>`, `<p>`, `<table>`, `<ul>`, etc.). No Markdown syntax.
8. **Unsplash featured image required.** Every article must have a featured image from Unsplash. Use the Unsplash API or web search to find a relevant, high-quality photo. Populate `featuredImageUrl`, `featuredImageAlt`, `featuredImageOwnerName`, and `featuredImageOwnerUsername`.
9. **Web research encouraged.** Pipeline agents should use WebSearch/WebFetch to research the city/topic for richer, more accurate content beyond raw database numbers.

---

## Summary

You say "run content batch". Analyst picks 5 keywords. 5 independent pipelines launch. Each writes EN, translates to 10 languages in parallel, assembles one complete object, validates, and inserts immediately. First article in the DB within ~2 minutes. All 5 done within ~5 minutes. All 11 languages populated. No waiting.
