<template>
  <Transition name="search-panel">
    <div
      v-if="open"
      class="absolute top-full left-0 right-0 z-40 bg-[#0d1b2e] border-b border-white/10 shadow-2xl"
    >
      <div class="max-w-screen-2xl mx-auto px-4 py-4">
        <!-- Search input -->
        <div class="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 h-12 mb-4 focus-within:border-white/25 transition-colors">
          <svg class="w-4 h-4 text-white/40 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            :placeholder="$t('search.placeholder')"
            class="flex-1 bg-transparent outline-none text-white placeholder-white/30 text-sm"
            @keydown.esc="$emit('close')"
          />
          <span class="text-xs text-white/25 flex-shrink-0 hidden sm:block">Esc</span>
        </div>

        <!-- Quick chips (shown when no query) -->
        <div v-if="!query.trim()" class="flex items-center gap-2 flex-wrap">
          <NuxtLink
            v-for="chip in quickChips"
            :key="chip.label"
            :to="chip.to"
            class="px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 text-white/50 hover:border-white/25 hover:text-white/80 transition-colors"
            @click="$emit('close')"
          >
            {{ chip.label }}
          </NuxtLink>
        </div>

        <!-- Results -->
        <div v-if="query.trim()">
          <template v-if="isLoading">
            <div v-for="n in 3" :key="n" class="h-12 rounded-xl bg-white/5 animate-pulse mb-1" />
          </template>
          <template v-else-if="hasResults">
            <!-- Cities section -->
            <div v-if="results.cities.length">
              <div class="text-[10px] font-bold tracking-wider uppercase text-white/30 px-3 pt-1 pb-2">
                {{ $t('search.cities') }}
              </div>
              <NuxtLink
                v-for="city in results.cities"
                :key="city.slug"
                :to="localePath(`/cities/${city.slug}`)"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                @click="$emit('close')"
              >
                <span class="text-lg flex-shrink-0">🏙️</span>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-white group-hover:text-white/90">{{ city.name }}</div>
                  <div class="text-xs text-white/40">{{ city.country }}</div>
                </div>
                <div v-if="city.costForNomadInUsd" class="text-xs font-semibold text-blue-400 flex-shrink-0">
                  ${{ city.costForNomadInUsd.toLocaleString() }}/mo
                </div>
              </NuxtLink>
            </div>

            <!-- Articles section -->
            <div v-if="results.articles.length">
              <div class="text-[10px] font-bold tracking-wider uppercase text-white/30 px-3 pt-3 pb-2">
                {{ $t('search.articles') }}
              </div>
              <NuxtLink
                v-for="article in results.articles"
                :key="article.slug"
                :to="localePath(`/blog/${article.slug}`)"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                @click="$emit('close')"
              >
                <span class="text-lg flex-shrink-0">📝</span>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-white group-hover:text-white/90">{{ article.title }}</div>
                </div>
                <div v-if="article.readingTimeMinutes" class="text-xs text-white/40 flex-shrink-0">
                  {{ article.readingTimeMinutes }} min
                </div>
              </NuxtLink>
            </div>
          </template>
          <p v-else class="text-sm text-white/40 px-3 py-4">
            {{ $t('search.noResults') }}
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useSearch } from '~/composables/useSearch'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const localePath = useLocalePath()
const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const { results, isLoading } = useSearch(query)

const hasResults = computed(() =>
  results.value.cities.length > 0 || results.value.articles.length > 0,
)

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    query.value = ''
    nextTick(() => inputRef.value?.focus())
  }
})

onMounted(() => {
  const handler = (e: MouseEvent) => {
    const el = document.querySelector('header')
    if (!el?.contains(e.target as Node)) emit('close')
  }
  document.addEventListener('mousedown', handler)
  onUnmounted(() => document.removeEventListener('mousedown', handler))
})

defineExpose({ query })

const quickChips = [
  { label: '🔥 Popular', to: '/' },
  { label: '💰 Under $1,500', to: '/?costs=1500' },
  { label: '🌏 Southeast Asia', to: '/?regions=Southeast+Asia' },
  { label: '🇪🇺 Europe', to: '/?regions=Europe' },
  { label: '☀️ Warm weather', to: '/?weathers=SUNNY' },
]
</script>

<style scoped>
.search-panel-enter-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.search-panel-leave-active { transition: opacity 0.1s ease, transform 0.1s ease; }
.search-panel-enter-from, .search-panel-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
