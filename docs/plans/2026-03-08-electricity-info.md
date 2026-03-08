# Electricity Info on City Pages — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Show plug type, voltage, frequency and a computed travel tip in the Internet & Infrastructure card on every city page.

**Architecture:** Add 3 nullable fields to `Country`, seed them from `packages/db/data/electricity.json`, extend the city detail API to return them, write a pure utility function to compute a travel tip sentence, then render 3 new rows + tip line in the existing card on the city page.

**Tech Stack:** Prisma (schema + seed), Nuxt 3 server routes, Vue 3 SFC, Tailwind CSS, Vitest

---

### Task 1: Schema — add electricity fields to Country

**Files:**
- Modify: `packages/db/prisma/schema.prisma`

**Step 1: Add 3 nullable fields to the Country model**

In `packages/db/prisma/schema.prisma`, inside the `Country` model, add after `englishProficiency`:

```prisma
plugTypes  String?
voltage    Int?
frequency  Int?
```

**Step 2: Push schema to DB**

```bash
npm run db:push
```

Expected: `Your database is now in sync with your Prisma schema.`

**Step 3: Commit**

```bash
git add packages/db/prisma/schema.prisma
git commit -m "feat(db): add plugTypes, voltage, frequency to Country model"
```

---

### Task 2: Seed script — populate electricity data

**Files:**
- Create: `packages/db/src/seeds/electricity.ts`

**Step 1: Write the seed script**

```ts
import { PrismaClient } from '@prisma/client'
import data from '../../data/electricity.json'

const prisma = new PrismaClient()

async function main() {
  const entries = Object.entries(data as Record<string, { plugTypes: string[]; voltage: number; frequency: number }>)

  let updated = 0
  for (const [code, info] of entries) {
    const result = await prisma.country.updateMany({
      where: { code },
      data: {
        plugTypes: info.plugTypes.join(','),
        voltage: info.voltage,
        frequency: info.frequency,
      },
    })
    updated += result.count
  }

  console.log(`Updated ${updated} countries`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

**Step 2: Run the seed**

```bash
cd packages/db && npx tsx src/seeds/electricity.ts
```

Expected: `Updated N countries` (should be close to 161).

**Step 3: Verify a sample row**

```bash
psql "$DATABASE_URL" -c "SELECT slug, code, \"plugTypes\", voltage, frequency FROM \"Country\" WHERE slug = 'germany';"
```

Expected: `plugTypes = C,F`, `voltage = 230`, `frequency = 50`.

**Step 4: Commit**

```bash
git add packages/db/src/seeds/electricity.ts
git commit -m "feat(db): seed electricity data for all countries"
```

---

### Task 3: API — return electricity fields from city detail endpoint

**Files:**
- Modify: `apps/nomad/src/server/api/cities/[slug].get.ts`
- Test: `apps/nomad/src/server/api/cities/__tests__/[slug].get.test.ts`

**Step 1: Write failing tests**

In `apps/nomad/src/server/api/cities/__tests__/[slug].get.test.ts`, update `mockCity` to include electricity fields on `country`, then add two new tests at the bottom of the `describe` block:

```ts
// Update mockCity country object to include electricity fields:
country: {
  name: 'Thailand',
  region: 'Asia',
  internetSpeed: 100,
  internetSpeedRanking: 50,
  englishProficiency: 416,
  plugTypes: 'A,B,C,I',
  voltage: 220,
  frequency: 50,
},

// New tests:
it('returns plugTypes, voltage, frequency from country', async () => {
  getValidatedRouterParamsMock.mockResolvedValue({ slug: 'bangkok' })
  prismaMock.city.findFirstOrThrow.mockResolvedValue(mockCity())

  const result = await handler.default(createMockH3Event({ params: { slug: 'bangkok' } }))

  expect(result.plugTypes).toBe('A,B,C,I')
  expect(result.voltage).toBe(220)
  expect(result.frequency).toBe(50)
})

it('returns null plugTypes/voltage/frequency when country has no electricity data', async () => {
  getValidatedRouterParamsMock.mockResolvedValue({ slug: 'nowhere' })
  prismaMock.city.findFirstOrThrow.mockResolvedValue(
    mockCity({
      country: {
        name: 'Unknown',
        region: 'Africa',
        internetSpeed: 10,
        internetSpeedRanking: 100,
        englishProficiency: 0,
        plugTypes: null,
        voltage: null,
        frequency: null,
      },
    }),
  )

  const result = await handler.default(createMockH3Event({ params: { slug: 'nowhere' } }))

  expect(result.plugTypes).toBeNull()
  expect(result.voltage).toBeNull()
  expect(result.frequency).toBeNull()
})
```

**Step 2: Run tests to verify they fail**

```bash
cd apps/nomad && npm run test:run -- src/server/api/cities/__tests__/\[slug\].get.test.ts
```

Expected: FAIL — `result.plugTypes` is `undefined`.

**Step 3: Extend the city detail endpoint**

In `apps/nomad/src/server/api/cities/[slug].get.ts`:

Add to the `country` select block:
```ts
country: {
  select: {
    name: true,
    region: true,
    internetSpeed: true,
    internetSpeedRanking: true,
    englishProficiency: true,
    plugTypes: true,
    voltage: true,
    frequency: true,
  },
},
```

In the return transform, add after `englishProficiency`:
```ts
plugTypes: countryData.plugTypes ?? null,
voltage: countryData.voltage ?? null,
frequency: countryData.frequency ?? null,
```

**Step 4: Run tests to verify they pass**

```bash
cd apps/nomad && npm run test:run -- src/server/api/cities/__tests__/\[slug\].get.test.ts
```

Expected: All tests PASS.

**Step 5: Commit**

```bash
git add apps/nomad/src/server/api/cities/[slug].get.ts apps/nomad/src/server/api/cities/__tests__/[slug].get.test.ts
git commit -m "feat(api): return plugTypes, voltage, frequency in city detail endpoint"
```

---

### Task 4: Utility — electricity travel tip function

**Files:**
- Create: `apps/nomad/src/utils/electricityTip.ts`
- Create: `apps/nomad/src/utils/__tests__/electricityTip.test.ts`

**Step 1: Write failing tests**

Create `apps/nomad/src/utils/__tests__/electricityTip.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getElectricityTip } from '../electricityTip'

describe('getElectricityTip', () => {
  it('returns null when no data', () => {
    expect(getElectricityTip(null, null)).toBeNull()
  })

  it('recommends UK adapter for Type G only', () => {
    const tip = getElectricityTip('G', 230)
    expect(tip).toContain('UK-style adapter')
  })

  it('recommends Type C/F adapter for European sockets', () => {
    const tip = getElectricityTip('C,F', 230)
    expect(tip).toContain('Type C/F adapter')
  })

  it('recommends North American adapter for Type A/B', () => {
    const tip = getElectricityTip('A,B', 120)
    expect(tip).toContain('North American adapter')
  })

  it('recommends Australian adapter for Type I only', () => {
    const tip = getElectricityTip('I', 230)
    expect(tip).toContain('Australian adapter')
  })

  it('notes that 230V is safe for modern electronics', () => {
    const tip = getElectricityTip('C,F', 230)
    expect(tip).toContain('230V')
    expect(tip).toContain('most modern electronics')
  })

  it('warns about low voltage for Americas/Japan', () => {
    const tip = getElectricityTip('A,B', 120)
    expect(tip).toContain('120V')
    expect(tip).toContain('check your devices')
  })

  it('handles mixed plug types by listing them', () => {
    const tip = getElectricityTip('A,B,C,I', 220)
    expect(tip).toContain('Type A, B, C, I')
  })
})
```

**Step 2: Run tests to verify they fail**

```bash
cd apps/nomad && npm run test:run -- src/utils/__tests__/electricityTip.test.ts
```

Expected: FAIL — module not found.

**Step 3: Write minimal implementation**

Create `apps/nomad/src/utils/electricityTip.ts`:

```ts
const EUROPEAN = new Set(['C', 'E', 'F'])
const UK = new Set(['G'])
const AMERICAN = new Set(['A', 'B'])
const AUSTRALIAN = new Set(['I'])

function getAdapterNote(types: string[]): string {
  const set = new Set(types)

  const isOnlyUK = types.every(t => UK.has(t))
  const isOnlyAustralian = types.every(t => AUSTRALIAN.has(t))
  const isOnlyAmerican = types.every(t => AMERICAN.has(t))
  const hasEuropean = types.some(t => EUROPEAN.has(t))

  if (isOnlyUK) return 'UK-style adapter'
  if (isOnlyAustralian) return 'Australian adapter'
  if (isOnlyAmerican) return 'North American adapter'
  if (hasEuropean) return 'Type C/F adapter'

  return `Type ${types.join(', ')} adapter`
}

function getVoltageNote(voltage: number): string {
  if (voltage >= 220) {
    return `${voltage}V — most modern electronics handle this automatically.`
  }
  return `${voltage}V — check your devices support ${voltage}V before plugging in.`
}

export function getElectricityTip(plugTypes: string | null, voltage: number | null): string | null {
  if (!plugTypes || voltage === null) return null

  const types = plugTypes.split(',').map(t => t.trim()).filter(Boolean)
  if (types.length === 0) return null

  const adapter = getAdapterNote(types)
  const voltageNote = getVoltageNote(voltage)

  return `Bring a ${adapter}. ${voltageNote}`
}
```

**Step 4: Run tests to verify they pass**

```bash
cd apps/nomad && npm run test:run -- src/utils/__tests__/electricityTip.test.ts
```

Expected: All tests PASS.

**Step 5: Commit**

```bash
git add apps/nomad/src/utils/electricityTip.ts apps/nomad/src/utils/__tests__/electricityTip.test.ts
git commit -m "feat(utils): add getElectricityTip utility function"
```

---

### Task 5: i18n — add translation keys

**Files:**
- Modify: `apps/nomad/src/locales/en.json`
- Modify: `apps/nomad/src/locales/pl.json`
- Modify: all other 9 locale files (ar, de, es, fr, it, ja, ko, pt, tr)

**Step 1: Add keys to en.json**

After `"countrySpeed": "Country Speed",` in the `city` block, add:

```json
"plugType": "Plug Type",
"voltage": "Voltage",
"frequency": "Frequency",
"electricityTip": "Electricity Tip",
```

**Step 2: Add keys to all other locale files**

Each file has the same structure. Add the same 4 keys after `"countrySpeed"` in each file. Use these translations:

**pl.json:**
```json
"plugType": "Typ wtyczki",
"voltage": "Napięcie",
"frequency": "Częstotliwość",
"electricityTip": "Wskazówka o prądzie",
```

**de.json:**
```json
"plugType": "Steckertyp",
"voltage": "Spannung",
"frequency": "Frequenz",
"electricityTip": "Stromhinweis",
```

**es.json:**
```json
"plugType": "Tipo de enchufe",
"voltage": "Voltaje",
"frequency": "Frecuencia",
"electricityTip": "Consejo eléctrico",
```

**fr.json:**
```json
"plugType": "Type de prise",
"voltage": "Tension",
"frequency": "Fréquence",
"electricityTip": "Conseil électrique",
```

**it.json:**
```json
"plugType": "Tipo di presa",
"voltage": "Tensione",
"frequency": "Frequenza",
"electricityTip": "Consiglio elettrico",
```

**pt.json:**
```json
"plugType": "Tipo de tomada",
"voltage": "Tensão",
"frequency": "Frequência",
"electricityTip": "Dica elétrica",
```

**ko.json:**
```json
"plugType": "플러그 유형",
"voltage": "전압",
"frequency": "주파수",
"electricityTip": "전기 팁",
```

**ja.json:**
```json
"plugType": "プラグタイプ",
"voltage": "電圧",
"frequency": "周波数",
"electricityTip": "電気のヒント",
```

**ar.json:**
```json
"plugType": "نوع القابس",
"voltage": "الجهد",
"frequency": "التردد",
"electricityTip": "نصيحة كهربائية",
```

**tr.json:**
```json
"plugType": "Fiş Tipi",
"voltage": "Voltaj",
"frequency": "Frekans",
"electricityTip": "Elektrik İpucu",
```

**Step 3: Commit**

```bash
git add apps/nomad/src/locales/
git commit -m "feat(i18n): add electricity field keys to all locales"
```

---

### Task 6: UI — add electricity rows to Internet & Infrastructure card

**Files:**
- Modify: `apps/nomad/src/pages/cities/[slug].vue`

**Step 1: Add electricity rows and travel tip to the Internet & Infrastructure card**

In `apps/nomad/src/pages/cities/[slug].vue`, find the Internet & Infrastructure card (around line 281). Inside the `<template v-if="data">` block, after the `countrySpeed` row (which ends around line 308), add:

```html
<div class="flex justify-between items-center py-3 border-b border-gray-50">
  <span class="text-sm text-gray-500">{{ $t('city.plugType') }}</span>
  <div class="flex items-center gap-1">
    <template v-if="data.plugTypes">
      <span
        v-for="type in data.plugTypes.split(',')"
        :key="type"
        class="inline-flex items-center justify-center size-6 rounded-md bg-gray-100 text-xs font-bold text-gray-700"
      >{{ type.trim() }}</span>
    </template>
    <span v-else class="text-sm text-gray-400">N/A</span>
  </div>
</div>
<div class="flex justify-between items-center py-3 border-b border-gray-50">
  <span class="text-sm text-gray-500">{{ $t('city.voltage') }}</span>
  <span
    class="text-sm font-semibold tabular-nums"
    :class="data.voltage && data.voltage < 200 ? 'text-amber-600' : 'text-gray-700'"
  >{{ data.voltage ? `${data.voltage}V` : 'N/A' }}</span>
</div>
<div class="flex justify-between items-center py-3">
  <span class="text-sm text-gray-500">{{ $t('city.frequency') }}</span>
  <span class="text-sm font-semibold text-gray-700 tabular-nums">{{ data.frequency ? `${data.frequency} Hz` : 'N/A' }}</span>
</div>
```

Then, just before the closing `</template>` of the `v-if="data"` block in that card (after the rows), add the travel tip divider and line:

```html
<div v-if="electricityTip" class="flex items-start gap-2 pt-3 mt-1 border-t border-gray-50">
  <LucideZap :size="14" class="text-amber-500 mt-0.5 shrink-0" />
  <p class="text-xs text-gray-500 leading-relaxed">{{ electricityTip }}</p>
</div>
```

**Step 2: Add the computed `electricityTip` to the script**

In the `<script lang="ts" setup>` block, add the import at the top alongside other imports:

```ts
import { getElectricityTip } from '~/utils/electricityTip'
```

Then add the computed property after the existing computed properties (e.g. after `getAirQualityClass`):

```ts
const electricityTip = computed(() =>
  data.value ? getElectricityTip(data.value.plugTypes ?? null, data.value.voltage ?? null) : null
)
```

**Step 3: Also add skeleton rows for the loading state**

In the `<template v-else>` block of the Internet & Infrastructure card (the skeleton section), the existing loop is `v-for="i in 2"`. Change it to `v-for="i in 5"` to account for the 3 new rows + the existing 2:

```html
<div v-for="i in 5" :key="i" class="flex justify-between items-center py-3" :class="{ 'border-b border-gray-50': i < 5 }">
```

**Step 4: Run typecheck**

```bash
cd apps/nomad && npm run typecheck
```

Expected: no errors.

**Step 5: Commit**

```bash
git add apps/nomad/src/pages/cities/[slug].vue
git commit -m "feat(ui): add electricity info to Internet & Infrastructure card"
```

---

### Task 7: Remove IDEA-03 file

**Files:**
- Delete: `TODO/IDEA-03.md`

**Step 1: Delete the file and commit**

```bash
git rm TODO/IDEA-03.md
git commit -m "chore: remove IDEA-03 (implemented as electricity info feature)"
```

---

### Task 8: Final verification

**Step 1: Run full test suite**

```bash
npm test
```

Expected: All tests pass, no failures.

**Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: No errors.

**Step 3: Manual smoke test**

Start the dev server and visit a city page (e.g. `/cities/berlin`). Verify:
- Plug Type row shows `C` `F` badges
- Voltage row shows `230V` in gray
- Frequency row shows `50 Hz`
- Travel tip appears: "Bring a Type C/F adapter. 230V — most modern electronics handle this automatically."

For a US city (e.g. `/cities/new-york`): voltage should be amber `120V`, tip should mention "check your devices".
