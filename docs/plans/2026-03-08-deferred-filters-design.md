# Deferred Filter Apply

## Problem

Filters inside the drawer apply immediately on selection, triggering API calls on every change. Users should be able to configure multiple filters and apply them all at once.

## Design

### Core concept

FiltersDrawer owns a `draftQuery` ref. Pickers inside the drawer become controlled components (v-model). Pickers outside the drawer keep their current immediate `router.push()` behavior.

### Data flow

1. **Drawer opens** — copy `route.query` into `draftQuery`
2. **User toggles filters** — pickers update `draftQuery` via v-model, no router/API calls
3. **"Show results" tapped** — `router.push({ query: draftQuery })`, drawer closes, API fires
4. **Drawer closed without apply** (backdrop/escape/drag) — `draftQuery` stays in memory, no router change
5. **Drawer reopens** — uses existing `draftQuery` (not route.query), so uncommitted selections persist
6. **"Clear Filters" tapped** — immediately `router.push({ query: {} })`, clears `draftQuery`, drawer closes

### Picker dual mode

Each picker supports two modes, detected by whether `modelValue` prop is provided:

- **Standalone** (no modelValue): reads/writes `route.query` directly via `router.push()` — current behavior, used outside the drawer
- **Controlled** (modelValue provided): accepts value via prop, emits `update:modelValue` — used inside the drawer

### Affected components

- FiltersDrawer.vue — owns draftQuery, passes v-model to pickers, applies on "Show results"
- WeathersPicker.vue — add controlled mode
- RegionsPicker.vue — add controlled mode
- TemperaturesPicker.vue — add controlled mode
- MonthsPicker.vue — add controlled mode
- BudgetFilter.vue — add controlled mode
- SinglePicker.vue — add controlled mode

### Not changed

- Search bar (q param) — applies immediately, not in drawer
- Sort/orderBy — applies immediately, not in drawer
- Pagination — resets on filter apply
- Favorites toggle — inside drawer but uses auth flow, keeps immediate behavior

### Active filter count

The badge on the drawer reads from `draftQuery` while the drawer is open, giving the user feedback on how many filters they've configured before applying.
