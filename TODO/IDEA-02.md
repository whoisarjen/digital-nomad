# IDEA-02: Month-Aware City Filter ("Climate Finder")
**Status:** DONE
**Priority:** 2/39
**Complexity:** S (minor polish remaining)

## What's Already Implemented
The month-aware filter is **fully implemented**:
- `MonthsPicker.vue` exists and is mounted inside `FiltersDrawer.vue`
- `getCitiesSchema` already has `months` as a required field; the index page always passes the current month as default
- `apps/nomad/src/server/api/cities/index.get.ts` joins with `MonthSummary` on the selected month, sorts by `totalScore`, and filters by `weathers`, `temperatures`, `totalScore` for that month
- `WeathersPicker.vue`, `TemperaturesPicker.vue` all exist and work with month-specific ranges

## Revised Analysis
Nothing structural to build. One small UX polish is missing:

**Missing**: A visible "Showing results for [Month]" chip/banner above the city grid. Currently the selected month in `MonthsPicker` is highlighted in the drawer but there is no persistent indicator on the main grid view that tells users their results are month-filtered.

This is a 15-minute frontend task — a single computed indicator component or inline chip on the grid header.

## Implementation Plan

### Database Changes
None.

### API Endpoints
None.

### Frontend Components/Pages
**Modify**: `apps/nomad/src/pages/index.vue`

Add a visible indicator above the city grid when a non-default month is selected:
```vue
<div v-if="filters.months && filters.months !== currentMonth" class="...">
  {{ t('explore.showingForMonth', { month: t(`months.${filters.months}`) }) }}
  <button @click="clearMonthFilter">{{ t('explore.clearMonth') }}</button>
</div>
```

### i18n Changes
Add to `en.json` and all locale files:
```json
"explore": {
  "showingForMonth": "Showing results for {month}",
  "clearMonth": "Clear"
}
```

## Dependencies
None.

## Notes
- This is effectively DONE for all practical purposes. The Climate Finder functionality works end-to-end.
- The indicator is a polish item, not a blocker for any other feature.
- Do not re-implement anything — the existing implementation is solid.
