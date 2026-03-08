<template>
  <div class="bg-gray-100 min-h-screen">
    <!-- Dark hero zone -->
    <section class="relative bg-[#060E1B] text-white overflow-hidden">
      <!-- Ambient orbs -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-1/3 -right-[15%] w-[50%] h-[50%] rounded-full bg-primary-500/[0.06] blur-[100px] animate-float" />
        <div class="absolute -bottom-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-amber-500/[0.04] blur-[80px] animate-float-reverse" />
      </div>

      <div class="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <!-- Breadcrumb pill -->
        <div class="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-1.5 text-sm text-gray-400 mb-6">
          <LucideCalculator :size="14" class="text-primary-400" />
          {{ $t('schengen.toolsNav') }}
        </div>

        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
          {{ $t('schengen.title') }}
        </h1>
        <p class="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {{ $t('schengen.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Main content -->
    <section class="max-w-4xl mx-auto px-6 -mt-2 pb-20">

      <!-- ═══ GAUGE + STATS CARD ═══ -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-6">
        <div class="flex flex-col md:flex-row items-center gap-8">

          <!-- Arc Gauge -->
          <div class="relative flex-shrink-0">
            <svg width="220" height="130" viewBox="0 0 220 130" class="block">
              <!-- Track -->
              <path
                :d="arcPath"
                fill="none"
                stroke="#e5e7eb"
                stroke-width="16"
                stroke-linecap="round"
              />
              <!-- Filled arc -->
              <path
                v-if="daysUsed > 0"
                :d="arcPath"
                fill="none"
                :stroke="gaugeColor"
                stroke-width="16"
                stroke-linecap="round"
                :stroke-dasharray="arcLength"
                :stroke-dashoffset="arcLength - (arcLength * Math.min(daysUsed, 90) / 90)"
                class="transition-all duration-700 ease-out"
              />
              <!-- Glow filter -->
              <defs>
                <filter id="gauge-glow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <!-- Glow arc (subtle) -->
              <path
                v-if="daysUsed > 0"
                :d="arcPath"
                fill="none"
                :stroke="gaugeColor"
                stroke-width="8"
                stroke-linecap="round"
                :stroke-dasharray="arcLength"
                :stroke-dashoffset="arcLength - (arcLength * Math.min(daysUsed, 90) / 90)"
                filter="url(#gauge-glow)"
                opacity="0.3"
                class="transition-all duration-700 ease-out"
              />
            </svg>
            <!-- Center number -->
            <div class="absolute inset-0 flex flex-col items-center justify-end pb-2">
              <span
                class="text-4xl font-bold tabular-nums transition-colors duration-300"
                :class="gaugeTextClass"
              >
                {{ daysRemaining }}
              </span>
              <span class="text-xs text-gray-400 mt-0.5">
                {{ $t('schengen.daysRemainingOf') }}
              </span>
            </div>
          </div>

          <!-- Stats grid -->
          <div class="flex-1 w-full grid grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-xl p-4">
              <div class="text-xs text-gray-500 mb-1">{{ $t('schengen.daysUsed', { days: '' }).trim() }}</div>
              <div class="text-2xl font-bold tabular-nums text-gray-900">{{ daysUsed }}</div>
              <div class="mt-1.5 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700 ease-out"
                  :class="progressBarClass"
                  :style="{ width: `${Math.min(100, (daysUsed / 90) * 100)}%` }"
                />
              </div>
            </div>

            <div class="bg-gray-50 rounded-xl p-4">
              <div class="text-xs text-gray-500 mb-1">{{ $t('schengen.daysRemaining', { days: '' }).trim() }}</div>
              <div
                class="text-2xl font-bold tabular-nums transition-colors duration-300"
                :class="gaugeTextClass"
              >
                {{ daysRemaining }}
              </div>
              <div class="text-xs mt-1.5" :class="statusTextClass">
                {{ statusLabel }}
              </div>
            </div>

            <div class="bg-gray-50 rounded-xl p-4">
              <div class="text-xs text-gray-500 mb-1">{{ $t('schengen.checkDate') }}</div>
              <div class="text-sm font-semibold text-gray-900">{{ $t('schengen.today') }}</div>
              <div class="text-xs text-gray-400 mt-0.5">{{ formattedCheckDate }}</div>
            </div>

            <div class="bg-gray-50 rounded-xl p-4">
              <div class="text-xs text-gray-500 mb-1">{{ $t('schengen.nextSafeEntry') }}</div>
              <div class="text-sm font-semibold" :class="nextSafeEntry ? 'text-amber-600' : 'text-emerald-600'">
                {{ nextSafeEntry ? formattedNextSafe : '—' }}
              </div>
              <div v-if="nextSafeEntry" class="text-xs text-gray-400 mt-0.5">
                {{ daysUntilSafe }} {{ $t('schengen.days') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ ENTRIES CARD ═══ -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-6">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-lg font-semibold text-gray-900">
            <LucidePlane :size="18" class="inline -mt-0.5 mr-1.5 text-primary-500" />
            {{ entries.length ? `${entries.length} trip${entries.length > 1 ? 's' : ''}` : $t('schengen.addEntry') }}
          </h2>
          <button
            @click="addEntry"
            class="inline-flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <LucidePlus :size="15" />
            {{ $t('schengen.addEntry') }}
          </button>
        </div>

        <!-- Empty state -->
        <div v-if="!entries.length" class="text-center py-12 text-gray-400">
          <LucideGlobe :size="40" class="mx-auto mb-3 text-gray-300" />
          <p class="text-sm">{{ $t('schengen.noEntries') }}</p>
        </div>

        <!-- Entry rows -->
        <TransitionGroup name="entry-row" tag="div" class="flex flex-col gap-3">
          <div
            v-for="(entry, i) in entries"
            :key="entry.id"
            class="group flex flex-wrap sm:flex-nowrap items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 hover:border-primary-200 transition-colors"
          >
            <!-- Trip number -->
            <span class="hidden sm:flex size-7 items-center justify-center rounded-full bg-primary-500/10 text-primary-600 text-xs font-bold flex-shrink-0">
              {{ i + 1 }}
            </span>

            <!-- Entry date -->
            <div class="flex-1 min-w-0">
              <label class="text-[10px] uppercase tracking-wider text-gray-400 font-medium">{{ $t('schengen.entryDate') }}</label>
              <input
                type="date"
                v-model="entry.from"
                class="block w-full mt-0.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-shadow"
              />
            </div>

            <!-- Arrow -->
            <LucideArrowRight :size="16" class="text-gray-300 flex-shrink-0 hidden sm:block mt-4" />

            <!-- Exit date -->
            <div class="flex-1 min-w-0">
              <label class="text-[10px] uppercase tracking-wider text-gray-400 font-medium">{{ $t('schengen.exitDate') }}</label>
              <input
                type="date"
                v-model="entry.to"
                class="block w-full mt-0.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-shadow"
              />
            </div>

            <!-- Days badge -->
            <div class="flex items-center gap-2 flex-shrink-0 mt-4">
              <span
                v-if="entry.from && entry.to && tripDays(entry) > 0"
                class="text-xs font-semibold tabular-nums rounded-full px-2.5 py-1"
                :class="tripDays(entry) > 30
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-primary-50 text-primary-700 border border-primary-200'"
              >
                {{ $t('schengen.tripDays', { days: tripDays(entry) }) }}
              </span>

              <!-- Remove -->
              <button
                @click="removeEntry(i)"
                class="size-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                :aria-label="$t('schengen.removeEntry')"
              >
                <LucideTrash2 :size="15" />
              </button>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- ═══ HOW IT WORKS ═══ -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-3">
          <LucideInfo :size="18" class="inline -mt-0.5 mr-1.5 text-gray-400" />
          {{ $t('schengen.howItWorks') }}
        </h2>
        <p class="text-sm text-gray-500 leading-relaxed">
          {{ $t('schengen.howItWorksDesc') }}
        </p>

        <!-- Visual explanation -->
        <div class="mt-5 flex items-center gap-3 overflow-hidden">
          <div class="flex-1 h-2.5 rounded-full bg-gray-100 relative overflow-hidden">
            <div class="absolute left-0 top-0 h-full rounded-full bg-primary-400/30" style="width: 50%" />
            <div class="absolute left-0 top-0 h-full rounded-full bg-primary-500" style="width: 25%" />
          </div>
          <div class="flex-shrink-0 text-[10px] text-gray-400 font-medium whitespace-nowrap">
            180 {{ $t('schengen.days') }}
          </div>
        </div>
        <div class="flex justify-between mt-1.5 text-[10px] text-gray-400">
          <span>90 {{ $t('schengen.days') }} max</span>
          <span>Rolling window</span>
        </div>
      </div>

      <!-- ═══ NON-SCHENGEN RECOMMENDATIONS ═══ -->
      <div
        v-if="daysRemaining <= 20 && entries.length > 0"
        class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 sm:p-8"
      >
        <h2 class="text-lg font-semibold text-gray-900 mb-2">
          <LucideMapPin :size="18" class="inline -mt-0.5 mr-1.5 text-amber-500" />
          {{ $t('schengen.nonSchengenTitle') }}
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
          <NuxtLink
            v-for="city in nonSchengenSuggestions"
            :key="city.slug"
            :to="localePath({ name: 'cities-slug', params: { slug: city.slug } })"
            class="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-amber-100 hover:border-primary-300 hover:shadow-sm transition-all group"
          >
            <div class="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
              {{ city.name }}
            </div>
            <div class="text-xs text-gray-400 mt-0.5">{{ city.country }}</div>
            <div class="text-xs font-medium text-emerald-600 mt-1 tabular-nums">
              ${{ city.cost }}/mo
            </div>
          </NuxtLink>
        </div>
      </div>

    </section>
  </div>
</template>

<script setup lang="ts">
import { useSchengenCalculator, type SchengenEntry } from '~/composables/useSchengenCalculator'

defineI18nRoute({
  paths: {
    en: '/tools/schengen-calculator',
    pl: '/narzedzia/kalkulator-schengen',
    es: '/herramientas/calculadora-schengen',
    de: '/werkzeuge/schengen-rechner',
    fr: '/outils/calculateur-schengen',
    pt: '/ferramentas/calculadora-schengen',
    it: '/strumenti/calcolatore-schengen',
    ko: '/tools/schengen-calculator',
    ja: '/tools/schengen-calculator',
    ar: '/tools/schengen-calculator',
    tr: '/araclar/schengen-hesaplayici',
  },
})

const { t, locale } = useCustomI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => t('schengen.title'),
  description: () => t('schengen.metaDesc'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: '/' },
      { name: () => t('schengen.toolsNav'), item: '/tools' },
      { name: () => t('schengen.title') },
    ],
  }),
  {
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does the Schengen 90/180 day rule work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Schengen Area allows visa-free stays of up to 90 days within any rolling 180-day period. This means on any given day, you look back 180 days and count how many days you were present in the Schengen zone. That count must not exceed 90.',
        },
      },
    ],
  } as any,
])

// ─── Entries state (persisted to localStorage) ───
interface EntryWithId extends SchengenEntry {
  id: number
}

let nextId = 0
const entries = ref<EntryWithId[]>([])

// Hydrate from localStorage
onMounted(() => {
  const saved = localStorage.getItem('nomad:schengen-entries')
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as SchengenEntry[]
      entries.value = parsed.map(e => ({ ...e, id: nextId++ }))
    } catch { /* ignore bad data */ }
  }
})

// Persist on change
watch(entries, (val) => {
  const toSave = val.map(({ from, to }) => ({ from, to }))
  localStorage.setItem('nomad:schengen-entries', JSON.stringify(toSave))
}, { deep: true })

function addEntry() {
  entries.value.push({ id: nextId++, from: '', to: '' })
}

function removeEntry(index: number) {
  entries.value.splice(index, 1)
}

function tripDays(entry: SchengenEntry): number {
  if (!entry.from || !entry.to) return 0
  const from = new Date(entry.from)
  const to = new Date(entry.to)
  if (from > to) return 0
  return Math.floor((to.getTime() - from.getTime()) / 86_400_000) + 1
}

// ─── Calculator ───
const validEntries = computed(() =>
  entries.value
    .filter(e => e.from && e.to)
    .map(({ from, to }) => ({ from, to }))
)

const { daysUsed, daysRemaining, isOverLimit, nextSafeEntry } = useSchengenCalculator(validEntries)

// ─── Arc gauge geometry ───
const ARC_RADIUS = 90
const ARC_CX = 110
const ARC_CY = 110

const arcPath = computed(() => {
  const startAngle = Math.PI
  const endAngle = 0
  const x1 = ARC_CX + ARC_RADIUS * Math.cos(startAngle)
  const y1 = ARC_CY + ARC_RADIUS * Math.sin(startAngle)
  const x2 = ARC_CX + ARC_RADIUS * Math.cos(endAngle)
  const y2 = ARC_CY + ARC_RADIUS * Math.sin(endAngle)
  return `M ${x1} ${y1} A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 1 ${x2} ${y2}`
})

const arcLength = computed(() => Math.PI * ARC_RADIUS)

// ─── Color logic ───
const gaugeColor = computed(() => {
  if (isOverLimit.value) return '#ef4444'
  if (daysUsed.value >= 70) return '#f59e0b'
  return '#2A9D8F'
})

const gaugeTextClass = computed(() => {
  if (isOverLimit.value) return 'text-red-500'
  if (daysRemaining.value <= 20) return 'text-amber-500'
  return 'text-gray-900'
})

const progressBarClass = computed(() => {
  if (isOverLimit.value) return 'bg-red-500'
  if (daysUsed.value >= 70) return 'bg-amber-400'
  return 'bg-primary-500'
})

const statusTextClass = computed(() => {
  if (isOverLimit.value) return 'text-red-500 font-semibold'
  if (daysRemaining.value <= 20) return 'text-amber-600'
  return 'text-emerald-600'
})

const statusLabel = computed(() => {
  if (isOverLimit.value) return t('schengen.overLimit')
  if (daysRemaining.value <= 20) return t('schengen.warningStatus')
  return t('schengen.safeStatus')
})

// ─── Formatted dates ───
const formattedCheckDate = computed(() =>
  new Date().toLocaleDateString(locale.value, { year: 'numeric', month: 'short', day: 'numeric' })
)

const formattedNextSafe = computed(() =>
  nextSafeEntry.value
    ? nextSafeEntry.value.toLocaleDateString(locale.value, { year: 'numeric', month: 'short', day: 'numeric' })
    : null
)

const daysUntilSafe = computed(() => {
  if (!nextSafeEntry.value) return 0
  return Math.ceil((nextSafeEntry.value.getTime() - Date.now()) / 86_400_000)
})

// ─── Non-Schengen suggestions (hardcoded popular destinations) ───
const nonSchengenSuggestions = [
  { slug: 'tirana', name: 'Tirana', country: 'Albania', cost: 1200 },
  { slug: 'tbilisi', name: 'Tbilisi', country: 'Georgia', cost: 1100 },
  { slug: 'istanbul', name: 'Istanbul', country: 'Turkey', cost: 1500 },
  { slug: 'belgrade', name: 'Belgrade', country: 'Serbia', cost: 1300 },
  { slug: 'sarajevo', name: 'Sarajevo', country: 'Bosnia', cost: 1100 },
  { slug: 'london', name: 'London', country: 'UK', cost: 3200 },
  { slug: 'podgorica', name: 'Podgorica', country: 'Montenegro', cost: 1200 },
  { slug: 'skopje', name: 'Skopje', country: 'North Macedonia', cost: 1000 },
]
</script>

<style scoped>
.entry-row-enter-active {
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.entry-row-leave-active {
  transition: all 0.2s ease-in;
}
.entry-row-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.entry-row-leave-to {
  opacity: 0;
  transform: translateX(16px);
}

input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0.5;
  cursor: pointer;
}
input[type="date"]::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}
</style>
