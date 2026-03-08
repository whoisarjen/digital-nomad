# IDEA-30: Price Data Opportunities
**Status:** BRAINSTORM
**Priority:** 30/30
**Complexity:** varies

## Context
We now have 55 Numbeo price fields on every `City` row (restaurants, groceries, transport,
utilities, sport, childcare, clothing, rent, buy, salary, mortgage). This opens up features
that weren't possible before. This file collects ideas for using that data creatively.

---

## Ideas

### A. Grocery Basket Calculator
**What:** User selects items from a weekly grocery list (bread, eggs, chicken, vegetables…)
and sees the estimated weekly/monthly food cost for the city.
**Fields used:** all market fields (x9–x27)
**Complexity:** S — pure client-side, no new DB, one composable
**Page:** Could live on city page (widget) or as a standalone tool `/tools/basket`

---

### B. "Day in the Life" Budget Builder
**What:** User builds a typical day — 1 cheap meal + 1 mid-range + coffee + taxi + beer.
Shows daily cost in each city. Could be a fun shareable card.
**Fields used:** mealInexpensive, mealMidRange, cappuccino, taxi1km, domesticBeerRestaurant
**Complexity:** S — presets with sliders, URL-shareable
**Angle:** Very viral/shareable format. "My nomad day costs $18 in Tbilisi vs $62 in Lisbon"

---

### C. Rent vs Buy Break-Even Calculator
**What:** Given rent price + buy price per m² + mortgage rate, calculate how many years
until buying breaks even vs renting.
**Formula:** `breakeven = (pricePerM2 * size) / (rent * 12)`
**Fields used:** apartment1brCentre, pricePerM2Centre, mortgageInterestRate
**Complexity:** S — single calculator widget on city page
**Note:** mortgageInterestRate is local rate, may not apply to foreigners (add disclaimer)

---

### D. Local Salary Purchasing Power
**What:** Show how local average salary compares to nomad cost of living.
"A local earns $707/mo but nomad lifestyle costs $1,200 — that's 1.7× the local wage."
**Fields used:** averageMonthlyNetSalary + costForNomadInUsd (already on City)
**Complexity:** XS — computed display on city page, no new endpoint needed
**Value:** Context for ethical travel / understanding privilege

---

### E. City Cost Index (Base = Bangkok = 100)
**What:** Index all cities relative to a reference city. Show "Barcelona is 2.8× more expensive
than Bangkok for meals" using a simple relative index.
**Fields used:** mealInexpensiveRestaurant + rent fields as composite index
**Complexity:** M — needs a reference-city anchor and category-level indices
**Display:** Spider/radar chart or horizontal bar chart

---

### F. Cheapest City for Specific Lifestyle
**What:** Ranked list filtered by a specific cost concern.
Examples:
- "Cheapest cities where gym + fast internet + 1br < $800/mo"
- "Where can I eat out daily for under $10?"
- "Cities where a beer costs less than $2"
**Fields used:** any combination
**Complexity:** M — needs a new API endpoint + filter UI
**Could replace/extend** the existing cost filter on the city list page

---

### G. Monthly Budget Breakdown Pie
**What:** Given a budget and lifestyle tier, show how it splits across categories
(rent ~40%, food ~25%, transport ~10%, entertainment ~5%…) using the granular prices.
**Fields used:** apartment1brCentre, mealInexpensive × 30, monthlyTransportPass, etc.
**Complexity:** S — computed chart, client-side only

---

### H. Price Comparison Between Two Cities
**What:** Side-by-side price table for any two cities (coffee, beer, rent, salary…)
Shows % difference per item and total basket comparison.
**Fields used:** all 55 fields, compared between two city slugs
**Complexity:** M — extends the existing compare page
**Note:** The existing `/compare` page shows aggregate costs — this adds the line-item layer

---

### I. "Can I Retire Here?" Calculator
**What:** Given total savings + expected monthly expenses, show cities sorted by how many years
savings last with no income. Variant of IDEA-06 (runway) but uses granular prices to show
a realistic lifestyle-based cost estimate rather than the Numbeo aggregate.
**Fields used:** apartment1brOutside + mealMidRange × 30 + monthlyTransportPass + internet60mbps
**Complexity:** S — composable + page, builds on IDEA-06 blueprint

---

### J. Coworking / Work-From-Cafe Cost
**What:** Estimate monthly cost of working from cafes vs coworking.
"2 coffees/day + fast internet plan = $X/month in this city"
**Fields used:** cappuccino × 60 + internet60mbps
**Complexity:** XS — single computed display
**Note:** No coworking space count data available yet — just the cost proxy

---

### K. Field Coverage Dashboard (Internal)
**What:** Admin/internal page showing which cities have price data vs null,
which categories are best covered, which cities need manual review.
**Fields used:** all nullable price fields
**Complexity:** S — internal only, useful for data maintenance
**Route:** `/admin/price-coverage` or as a logged-in dashboard section

---

## Fields Worth Reconsidering

| Field | Issue |
|---|---|
| `mortgageInterestRate` | Local rate; largely irrelevant to nomads who can't get local mortgages |
| `volkswagenGolf` / `toyotaCorolla` | Car purchase prices; nomads rarely buy cars, but useful for expat/family audience |
| `cigarettes20Pack` | Niche, but cheap to keep |
| `internationalPrimarySchoolYearly` | Very relevant for family nomads, worth surfacing |
| `averageMonthlyNetSalary` | Gold for "privilege context" and salary benchmarking (idea D above) |

## Fields Currently Unexploited in UI
- All market/grocery fields (shown in CostBreakdown but not used in any calculation)
- `averageMonthlyNetSalary` — not shown anywhere yet
- `mortgageInterestRate` — shown in CostBreakdown finance tab only
- All rent/buy fields except 1br (used in existing cost cards)

## Recommended Next Steps
1. Ship `CostBreakdown.vue` on city pages (IDEA-11 UI — already built)
2. Add idea D (Local Salary Purchasing Power) to city page — XS effort, high insight value
3. Extend `/compare` with granular price table (idea H) — M effort, high SEO value
4. Build idea B ("Day in the Life") as a shareable tool — S effort, high viral potential
