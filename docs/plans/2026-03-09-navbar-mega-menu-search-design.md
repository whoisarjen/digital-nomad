# Navbar Redesign: Mega Menu + Triggered Search Panel

**Date:** 2026-03-09
**Status:** Approved

## Problem

The navbar has 8 navigation links + CurrencyPicker + LanguagePicker + auth CTA — all on one row. Every new page makes it worse and it will overflow on mid-size screens.

## Solution

Replace the flat link list with a grouped mega menu and add a triggered slide-down search panel.

---

## Design

### 1. Mega Menu (top-level nav groups)

| Group | Links inside |
|---|---|
| Discover | Cities, Regions, Countries |
| Rankings | Best Cities, Safe Cities |
| Tools | Compare, All Tools |
| Blog | standalone link (no dropdown) |

Each group shows a hover/click dropdown with icon + title + short description per link.
CurrencyPicker + LanguagePicker collapse into a single grouped pill: `💵 USD | EN`.

### 2. Search

A 🔍 icon button lives in the right section of the navbar. Clicking it (or pressing `/` as a shortcut) slides down a full-width panel beneath the navbar containing:

- A prominent search input (autofocused on open)
- Quick-filter chips: Popular, Budget, Asia, Europe, Warm weather (static, link to filtered city index)
- Live results list as user types (debounced 300ms)
- Each result shows: city name, country name, cost/mo
- Clicking a result navigates to `/cities/[slug]`
- Close on Esc, clicking outside, or route change

### 3. Search results behavior

- Results come from a new **lightweight endpoint** `GET /api/search/cities?q=` that queries the `City` table directly (not via `MonthSummary`), returning `slug`, `name`, `country.name`, `costForNomadInUsd`. Max 6 results.
- Why not reuse `/api/cities`? That endpoint joins through `MonthSummary` and is heavy. The search endpoint is intentionally minimal.
- If `q` is empty: no results shown (don't load all cities).
- If no results: show "No cities found" empty state.

---

## Components

| File | Change |
|---|---|
| `src/components/AppHeader.vue` | Refactor nav links → mega menu groups; add search icon button; wire open/close state |
| `src/components/AppSearchPanel.vue` | New — slide-down panel: input, chips, results list |
| `src/composables/useSearch.ts` | New — debounced `$fetch` to `/api/search/cities`, returns city results |
| `src/server/api/search/cities.get.ts` | New — lightweight city search endpoint |
| `src/server/api/search/__tests__/cities.get.test.ts` | New — server route tests |
| `src/composables/__tests__/useSearch.test.ts` | New — composable tests |
| `src/components/__tests__/AppSearchPanel.test.ts` | New — component tests |

---

## TDD Order

1. Write test for `GET /api/search/cities` → implement endpoint
2. Write test for `useSearch` composable → implement composable
3. Write test for `AppSearchPanel` component → implement component
4. Refactor `AppHeader.vue` (no new tests needed — existing header has no tests)

---

## Out of Scope

- No keyboard arrow-key navigation in results (can add later)
- No search history / recent cities
- No country/region results — cities only
- Mobile nav hamburger stays as-is (search panel works on mobile too)
