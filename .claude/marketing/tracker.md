# Marketing Tracker - nomad.whoisarjen.com

## Strategy: Dynamic Weekly Batch (5 articles/trigger, EN+PL)
**Started:** 2026-02-28
**Updated:** 2026-03-04 (v3 -- dynamic keyword selection, no static queue)
**Master plan:** `.claude/marketing/content/strategy/daily-content-automation-plan.md`
**Published log:** `.claude/marketing/published-log.md`

---

## How It Works

One trigger per week:
1. **Analyst agent** reads published log + DB state, picks 5 best keywords
2. **5 writer agents** run in parallel, each writes EN+PL, validates, inserts independently
3. **Master** logs results to published-log.md

No static queue. System decides what to write every time based on what exists and what's missing.

---

## SEO Metrics

| Metric | Current | W6 Target | M3 Target | M6 Target | M12 Target | Last Updated |
|--------|---------|-----------|-----------|-----------|------------|-------------|
| Articles published (EN+PL) | 0 | 30 | 60 | 80 | 150+ | 2026-03-04 |
| Articles indexed | 0 | 5-10 | 20 | 50 | 100+ | 2026-03-04 |
| Page 1 rankings | 0 | 0 | 2-3 | 10-15 | 30+ | 2026-03-04 |
| Monthly organic visitors | ~0 | 0-50 | 300-1,500 | 5,000-15,000 | 15,000-50,000 | 2026-03-04 |
| Languages with content | 2 (EN+PL) | 2 | 3 (+ES) | 5 | 6+ | 2026-03-04 |

---

## Batch History

| # | Date | Published | Failed | Types | Notes |
|---|------|-----------|--------|-------|-------|
| -- | -- | -- | -- | -- | -- |

---

## Next Action

Run first batch. Before that, verify:
- [ ] Google Search Console set up for nomad.whoisarjen.com
- [ ] Sitemap URLs submitted to GSC
- [ ] Basic analytics in place (Vercel Analytics / GA4)

---

## Positioning

- **Free vs NomadList's $100+ paywall**
- **Real API data** (Open-Meteo, Numbeo) vs user-submitted guesses
- **EN + PL from day 1** -- Polish nomad content has near-zero competition
- **Every article contains real DB numbers** -- the moat AI content mills can't copy
