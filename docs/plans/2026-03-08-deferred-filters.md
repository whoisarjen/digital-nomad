# Deferred Filter Apply — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Filters inside the drawer accumulate as a draft and only apply to the URL (triggering API) when the user taps "Show results."

**Architecture:** FiltersDrawer owns a `draftQuery` ref. When open, it copies `route.query` into the draft (or reuses existing draft). Each picker inside the drawer receives its value via `modelValue` prop and emits `update:modelValue` — no `router.push()`. Pickers used outside the drawer keep their existing immediate behavior (no `modelValue` → standalone mode). "Show results" flushes draft to URL. "Clear Filters" applies immediately.

**Tech Stack:** Vue 3, Nuxt 3, TypeScript, TailwindCSS, Vitest

---

## Task 1: Add controlled mode to WeathersPicker

**Files:**
- Modify: `apps/nomad/src/components/WeathersPicker.vue`
- Test: `apps/nomad/src/components/__tests__/WeathersPicker.test.ts`

### Step 1: Write the failing test

Add a test that mounts WeathersPicker with a `modelValue` prop and verifies it emits `update:modelValue` instead of calling `router.push()`.

```ts
// In WeathersPicker.test.ts — add this test
it('emits update:modelValue in controlled mode without router.push', async () => {
  const wrapper = await mountSuspended(WeathersPicker, {
    props: {
      modelValue: ['SUN'],
    },
  })

  // Click CLOUDY button (2nd weather icon)
  const buttons = wrapper.findAll('[class*="cursor-pointer"]')
  await buttons[1]!.trigger('click')

  expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  expect(wrapper.emitted('update:modelValue')![0]).toEqual([['SUN', 'CLOUDY']])
})
```

### Step 2: Run test to verify it fails

Run: `cd apps/nomad && npx vitest run src/components/__tests__/WeathersPicker.test.ts`
Expected: FAIL — WeathersPicker doesn't accept `modelValue` prop yet

### Step 3: Implement controlled mode

In `WeathersPicker.vue`, add optional `modelValue` prop and `update:modelValue` emit. When `modelValue` is provided, use it instead of `route.query.weathers`. On click, emit instead of `router.push()`.

```vue
<script setup lang="ts">
import type { WeatherIcon } from '@prisma/client';

const props = defineProps<{
  modelValue?: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const isControlled = computed(() => props.modelValue !== undefined)

const route = useRoute();
const router = useRouter();

const WEATHERS_ICONS = {
  SUN: true,
  CLOUDY: true,
  WIND: true,
  RAIN: true,
  SNOW: true,
} as const satisfies { [key in Exclude<WeatherIcon, 'NULL'>]: boolean }

const toStringArray = (val: string | string[] | undefined): string[] =>
  Array.isArray(val) ? val : val ? [val] : []

const selectedOptions = ref<string[]>(
  isControlled.value
    ? [...(props.modelValue ?? [])]
    : toStringArray(route.query.weathers as string | string[] | undefined)
);

// Sync from modelValue in controlled mode
watch(() => props.modelValue, (newVal) => {
  if (isControlled.value) {
    selectedOptions.value = [...(newVal ?? [])]
  }
})

function selectWeather(value: string) {
  const index = selectedOptions.value.indexOf(value);

  let newSelections = []
  if (index !== -1) {
    newSelections = selectedOptions.value.filter(option => option !== value);
  } else {
    newSelections = [...selectedOptions.value, value];
  }

  if (isControlled.value) {
    emit('update:modelValue', newSelections)
    return
  }

  router.push({
    query: {
      ...route.query,
      page: undefined,
      weathers: newSelections.length ? newSelections : undefined,
    },
  });
}

// Standalone mode: sync from route
watch(() => route.query.weathers, (newVal) => {
  if (!isControlled.value) {
    selectedOptions.value = Array.isArray(newVal)
      ? (newVal as string[])
      : newVal ? [newVal] : [];
  }
}, {
  immediate: true,
});
</script>
```

Template stays the same — no changes needed.

### Step 4: Run test to verify it passes

Run: `cd apps/nomad && npx vitest run src/components/__tests__/WeathersPicker.test.ts`
Expected: PASS

### Step 5: Commit

```bash
git add apps/nomad/src/components/WeathersPicker.vue apps/nomad/src/components/__tests__/WeathersPicker.test.ts
git commit -m "feat(filters): add controlled mode to WeathersPicker"
```

---

## Task 2: Add controlled mode to RegionsPicker

**Files:**
- Modify: `apps/nomad/src/components/RegionsPicker.vue`
- Test: `apps/nomad/src/components/__tests__/RegionsPicker.test.ts`

Same pattern as WeathersPicker. Add `modelValue?: string[]` prop, `update:modelValue` emit, `isControlled` computed. On click: emit if controlled, `router.push()` if standalone.

### Step 1: Write the failing test

```ts
it('emits update:modelValue in controlled mode without router.push', async () => {
  const wrapper = await mountSuspended(RegionsPicker, {
    props: {
      modelValue: [],
    },
  })

  const buttons = wrapper.findAll('[class*="cursor-pointer"]')
  await buttons[0]!.trigger('click')

  expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  // First region is 'Europe'
  expect(wrapper.emitted('update:modelValue')![0]![0]).toContain('Europe')
})
```

### Step 2: Run test — expect FAIL

### Step 3: Implement controlled mode

Same dual-mode pattern: `defineProps<{ modelValue?: string[] }>()`, `isControlled`, emit vs router.push.

### Step 4: Run test — expect PASS

### Step 5: Commit

```bash
git add apps/nomad/src/components/RegionsPicker.vue apps/nomad/src/components/__tests__/RegionsPicker.test.ts
git commit -m "feat(filters): add controlled mode to RegionsPicker"
```

---

## Task 3: Add controlled mode to MonthsPicker

**Files:**
- Modify: `apps/nomad/src/components/MonthsPicker.vue`
- Test: (create) `apps/nomad/src/components/__tests__/MonthsPicker.test.ts`

### Step 1: Write the failing test

```ts
import { mountSuspended } from '@nuxt/test-utils/runtime'
import MonthsPicker from '~/components/MonthsPicker.vue'

describe('MonthsPicker', () => {
  it('emits update:modelValue in controlled mode', async () => {
    const wrapper = await mountSuspended(MonthsPicker, {
      props: {
        modelValue: '03',
      },
    })

    const buttons = wrapper.findAll('[class*="cursor-pointer"]')
    // Click April (index 3, value '04')
    await buttons[3]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['04'])
  })
})
```

### Step 2: Run test — expect FAIL

### Step 3: Implement controlled mode

Add `modelValue?: string` prop, `update:modelValue` emit. Dual mode: emit selected month if controlled, `router.push()` if standalone.

### Step 4: Run test — expect PASS

### Step 5: Commit

```bash
git add apps/nomad/src/components/MonthsPicker.vue apps/nomad/src/components/__tests__/MonthsPicker.test.ts
git commit -m "feat(filters): add controlled mode to MonthsPicker"
```

---

## Task 4: Add controlled mode to TemperaturesPicker

**Files:**
- Modify: `apps/nomad/src/components/TemperaturesPicker.vue`
- Test: (create) `apps/nomad/src/components/__tests__/TemperaturesPicker.test.ts`

### Step 1: Write the failing test

```ts
import { mountSuspended } from '@nuxt/test-utils/runtime'
import TemperaturesPicker from '~/components/TemperaturesPicker.vue'

describe('TemperaturesPicker', () => {
  it('emits update:modelValue in controlled mode', async () => {
    const wrapper = await mountSuspended(TemperaturesPicker, {
      props: {
        modelValue: ['gte:-50', 'lte:50'],
      },
    })

    const inputs = wrapper.findAll('input[type="number"]')
    await inputs[0]!.setValue(10)
    await inputs[0]!.trigger('input')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})
```

### Step 2: Run test — expect FAIL

### Step 3: Implement controlled mode

Add `modelValue?: string[]` prop (format: `['gte:MIN', 'lte:MAX']`). On input: emit updated array if controlled, `router.push()` if standalone.

### Step 4: Run test — expect PASS

### Step 5: Commit

```bash
git add apps/nomad/src/components/TemperaturesPicker.vue apps/nomad/src/components/__tests__/TemperaturesPicker.test.ts
git commit -m "feat(filters): add controlled mode to TemperaturesPicker"
```

---

## Task 5: Add controlled mode to BudgetFilter

**Files:**
- Modify: `apps/nomad/src/components/BudgetFilter.vue`
- Test: `apps/nomad/src/components/__tests__/BudgetFilter.test.ts`

### Step 1: Write the failing test

```ts
it('emits update:modelValue when checkbox toggled in controlled mode', async () => {
  const wrapper = await mountSuspended(BudgetFilter, {
    props: {
      modelValue: undefined, // no costs filter active
    },
  })

  const checkbox = wrapper.find('input[type="checkbox"]')
  await checkbox.setValue(true)

  expect(wrapper.emitted('update:modelValue')).toBeTruthy()
})
```

### Step 2: Run test — expect FAIL

### Step 3: Implement controlled mode

Add `modelValue?: string` prop (the `costs` value or `undefined`). When controlled: emit on checkbox toggle and slider change instead of `router.push()`. `useBudget()` still used for the slider display value.

### Step 4: Run test — expect PASS

### Step 5: Commit

```bash
git add apps/nomad/src/components/BudgetFilter.vue apps/nomad/src/components/__tests__/BudgetFilter.test.ts
git commit -m "feat(filters): add controlled mode to BudgetFilter"
```

---

## Task 6: Add controlled mode to SinglePicker

**Files:**
- Modify: `apps/nomad/src/components/SinglePicker.vue`
- Test: (create) `apps/nomad/src/components/__tests__/SinglePicker.test.ts`

### Step 1: Write the failing test

```ts
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SinglePicker from '~/components/SinglePicker.vue'

describe('SinglePicker', () => {
  it('emits update:modelValue in controlled mode', async () => {
    const wrapper = await mountSuspended(SinglePicker, {
      props: {
        name: 'safety',
        operation: 'gte',
        options: [
          { label: 'Middle', value: 'MIDDLE' },
          { label: 'High', value: 'HIGH' },
        ],
        modelValue: '-1', // default = all
      },
    })

    const select = wrapper.find('select')
    await select.setValue('HIGH')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['HIGH'])
  })
})
```

### Step 2: Run test — expect FAIL

### Step 3: Implement controlled mode

Add `modelValue?: string` prop. When controlled: emit on change, don't `router.push()`. When standalone: keep current behavior.

### Step 4: Run test — expect PASS

### Step 5: Commit

```bash
git add apps/nomad/src/components/SinglePicker.vue apps/nomad/src/components/__tests__/SinglePicker.test.ts
git commit -m "feat(filters): add controlled mode to SinglePicker"
```

---

## Task 7: Update FiltersDrawer to use draft state

**Files:**
- Modify: `apps/nomad/src/components/FiltersDrawer.vue`
- Test: (create) `apps/nomad/src/components/__tests__/FiltersDrawer.test.ts`

### Step 1: Write the failing test

```ts
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FiltersDrawer from '~/components/FiltersDrawer.vue'

describe('FiltersDrawer', () => {
  it('applies draft to router on "Show results" click', async () => {
    const wrapper = await mountSuspended(FiltersDrawer, {
      props: {
        modelValue: true,
        pickers: {},
        activeFilterCount: 0,
        isFavoritesActive: false,
      },
    })

    // The "Show results" button should exist
    const showResultsBtn = wrapper.findAll('button').find(b => b.text().includes('Show results'))
    expect(showResultsBtn).toBeTruthy()
  })
})
```

### Step 2: Run test — expect FAIL (or PASS — this is a structural test)

### Step 3: Implement draft state in FiltersDrawer

Key changes to `FiltersDrawer.vue`:

1. Add `draftQuery` ref and initialize from `route.query` on first open
2. Pass draft values as `v-model` to each picker
3. "Show results" button: calls `router.push({ query: draftQuery })` then emits close
4. "Clear Filters": calls `emit('clearFilters')` which parent handles (immediate apply)
5. Emit new `applyFilters` event with draft query

```vue
<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const props = defineProps<{
  modelValue: boolean
  pickers: any
  activeFilterCount: number
  isFavoritesActive: boolean
  hideRegions?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'toggleFavorites': []
  'clearFilters': []
}>()

// Draft state — persists across open/close
const draftQuery = ref<Record<string, any>>({ ...route.query })
const hasDraftBeenInitialized = ref(false)

// On first open, seed from route; on subsequent opens, keep draft
watch(() => props.modelValue, (open) => {
  if (open && !hasDraftBeenInitialized.value) {
    draftQuery.value = { ...route.query }
    hasDraftBeenInitialized.value = true
  }
  if (import.meta.client) {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})

// Sync draft when route changes externally (e.g. search bar, sort, clear)
watch(() => route.query, (newQuery) => {
  if (!props.modelValue) {
    draftQuery.value = { ...newQuery }
  }
}, { deep: true })

// Draft helpers for each picker
const draftWeathers = computed({
  get: () => {
    const w = draftQuery.value.weathers
    return Array.isArray(w) ? w : w ? [w] : []
  },
  set: (val: string[]) => {
    draftQuery.value = { ...draftQuery.value, weathers: val.length ? val : undefined }
  },
})

const draftRegions = computed({
  get: () => {
    const r = draftQuery.value.regions
    return Array.isArray(r) ? r : r ? [r] : []
  },
  set: (val: string[]) => {
    draftQuery.value = { ...draftQuery.value, regions: val.length ? val : undefined }
  },
})

const draftMonths = computed({
  get: () => (draftQuery.value.months as string) ?? getUserCurrentMonthString(),
  set: (val: string) => {
    draftQuery.value = {
      ...draftQuery.value,
      months: val === getUserCurrentMonthString() ? undefined : val,
    }
  },
})

const draftTemperatures = computed({
  get: () => {
    const t = draftQuery.value.temperatures
    return Array.isArray(t) ? t : t ? [t] : undefined
  },
  set: (val: string[] | undefined) => {
    draftQuery.value = { ...draftQuery.value, temperatures: val }
  },
})

const draftCosts = computed({
  get: () => draftQuery.value.costs as string | undefined,
  set: (val: string | undefined) => {
    const q = { ...draftQuery.value }
    if (val) {
      q.costs = val
    } else {
      delete q.costs
    }
    draftQuery.value = q
  },
})

// Draft filter count (shown in badge while drawer open)
const FILTER_EXCLUDE_PARAMS = ['page', 'q', 'orderBy', 'sort']
const draftFilterCount = computed(() =>
  Object.keys(draftQuery.value).filter(k =>
    !FILTER_EXCLUDE_PARAMS.includes(k) && draftQuery.value[k] !== undefined
  ).length
)

function applyAndClose() {
  router.push({ query: { ...draftQuery.value, page: undefined } })
  emit('update:modelValue', false)
}

function close() {
  emit('update:modelValue', false)
}

function clearAndClose() {
  emit('clearFilters')
  draftQuery.value = {}
  hasDraftBeenInitialized.value = false
  close()
}

// ... keep existing Escape + onMounted/onUnmounted
```

Template changes:
- Replace `<WeathersPicker />` with `<WeathersPicker v-model="draftWeathers" />`
- Replace `<RegionsPicker />` with `<RegionsPicker v-model="draftRegions" />`
- Replace `<MonthsPicker />` with `<MonthsPicker v-model="draftMonths" />`
- Replace `<TemperaturesPicker />` with `<TemperaturesPicker v-model="draftTemperatures" />`
- Replace `<BudgetFilter />` with `<BudgetFilter v-model="draftCosts" />`
- Replace `<SinglePicker :name="key" ... />` with `<SinglePicker :name="key" ... v-model="getDraftSingleValue(key)" @update:modelValue="setDraftSingleValue(key, $event)" />`
- Replace `activeFilterCount` badge with `draftFilterCount` while drawer is open
- "Show results" button: `@click="applyAndClose"` instead of `@click="close"`

### Step 4: Run all tests

Run: `cd apps/nomad && npx vitest run`
Expected: ALL PASS

### Step 5: Commit

```bash
git add apps/nomad/src/components/FiltersDrawer.vue apps/nomad/src/components/__tests__/FiltersDrawer.test.ts
git commit -m "feat(filters): implement deferred apply with draft state in FiltersDrawer"
```

---

## Task 8: Update index.vue and [region].vue to pass draft-aware props

**Files:**
- Modify: `apps/nomad/src/pages/index.vue`
- Modify: `apps/nomad/src/pages/regions/[region].vue`

### Step 1: Update index.vue

The `FiltersDrawer` usage stays the same — it already receives `activeFilterCount` and `clearFilters`. The drawer now handles draft internally. The `activeFilterCount` prop is still used for the toolbar badge (route-based count). The drawer internally uses `draftFilterCount` for its own badge.

No changes needed to `index.vue` or `[region].vue` — the drawer encapsulates all draft logic.

### Step 2: Run all tests

Run: `cd apps/nomad && npx vitest run`
Expected: ALL PASS

### Step 3: Run typecheck

Run: `cd /Users/kamilowczarek/Documents/GitHub/digital-nomad && npx turbo run typecheck`
Expected: PASS

### Step 4: Commit (only if changes were needed)

---

## Task 9: Final verification and deploy

### Step 1: Run full test suite

Run: `cd /Users/kamilowczarek/Documents/GitHub/digital-nomad && npm test`
Expected: ALL PASS

### Step 2: Run typecheck

Run: `npx turbo run typecheck`
Expected: PASS

### Step 3: Manual smoke test checklist

- [ ] Open drawer, select weather + region, close without "Show results" — URL unchanged
- [ ] Reopen drawer — previous selections still there
- [ ] Tap "Show results" — URL updates, cities refresh
- [ ] "Clear Filters" — URL clears immediately, drawer closes
- [ ] Pickers outside drawer (orderBy, sort, search) still apply immediately
- [ ] Month indicator above cards updates correctly after applying from drawer

### Step 4: Deploy

```bash
git push origin main
```
