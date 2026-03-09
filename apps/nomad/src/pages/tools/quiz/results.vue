<template>
  <div class="results-shell">
    <Head>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
    </Head>

    <!-- Ambient -->
    <div class="ambient" aria-hidden="true">
      <div class="orb orb-a" />
      <div class="orb orb-b" />
    </div>

    <!-- Header -->
    <header class="results-header">
      <NuxtLink :to="localePath({ name: 'tools-quiz' })" class="back-link">
        <LucideArrowLeft :size="15" />
        {{ $t('quiz.retake') }}
      </NuxtLink>
      <button class="share-btn" @click="share">
        <LucideShare2 v-if="!copied" :size="15" />
        <LucideCheck v-else :size="15" />
        {{ copied ? $t('quiz.copied') : $t('quiz.shareResults') }}
      </button>
    </header>

    <!-- Loading -->
    <div v-if="!data" class="loading-state">
      <div class="loading-ring" />
      <p class="loading-text">{{ $t('quiz.loading') }}</p>
    </div>

    <!-- Results -->
    <main v-else class="results-main">
      <div class="results-intro">
        <p class="intro-badge">
          <LucideMapPin :size="12" />
          {{ $t('quiz.badge') }}
        </p>
        <h1 class="intro-title">{{ $t('quiz.resultsTitle') }}</h1>
        <p class="intro-sub">{{ $t('quiz.resultsSubtitle') }}</p>
      </div>

      <!-- No results -->
      <div v-if="topCities.length === 0" class="no-results">
        <p>{{ $t('quiz.noResults') }}</p>
        <NuxtLink :to="localePath({ name: 'tools-quiz' })" class="retake-link">
          {{ $t('quiz.retake') }} →
        </NuxtLink>
      </div>

      <!-- City cards -->
      <div v-else class="city-list">
        <div
          v-for="(entry, idx) in topCities"
          :key="entry.city.slug"
          class="city-card"
          :class="{ featured: idx === 0 }"
          :style="cardBg(entry.city)"
        >
          <!-- Rank badge -->
          <div class="rank-badge" :class="rankClass(idx)">
            <span class="rank-num">#{{ idx + 1 }}</span>
          </div>

          <!-- Score ring -->
          <div class="score-ring-wrap">
            <svg class="score-ring" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.12)" stroke-width="3" />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#d4a853"
                stroke-width="3"
                stroke-linecap="round"
                stroke-dasharray="125.66"
                :stroke-dashoffset="125.66 - (125.66 * entry.pct) / 100"
                transform="rotate(-90 24 24)"
              />
            </svg>
            <span class="score-val">{{ entry.pct }}%</span>
          </div>

          <!-- Info overlay -->
          <div class="card-overlay" />
          <div class="card-content">
            <div class="city-meta">
              <h2 class="city-name">{{ entry.city.name }}</h2>
              <p class="city-country">{{ entry.city.country }} · {{ entry.city.region ? $t(`regions.${entry.city.region}`) : '' }}</p>
            </div>

            <div class="city-stats">
              <div v-if="entry.city.costForNomadInUsd" class="stat-pill">
                <LucideDollarSign :size="11" />
                ${{ Math.round(entry.city.costForNomadInUsd) }}{{ $t('quiz.perMonth') }}
              </div>
              <div v-if="entry.city.internetSpeedCity" class="stat-pill">
                <LucideWifi :size="11" />
                {{ entry.city.internetSpeedCity }} Mbps
              </div>
              <div v-if="entry.city.safety" class="stat-pill" :class="`safety-${entry.city.safety.toLowerCase()}`">
                <LucideShield :size="11" />
                {{ entry.city.safety === 'HIGH' ? $t('safety.safe') : entry.city.safety === 'MIDDLE' ? $t('safety.moderate') : $t('safety.caution') }}
              </div>
              <div v-if="entry.city.monthTemperatureC ?? entry.city.temperatureC" class="stat-pill">
                <LucideThermometer :size="11" />
                {{ Math.round((entry.city.monthTemperatureC ?? entry.city.temperatureC)!) }}°C
              </div>
            </div>

            <NuxtLink
              :to="localePath({ name: 'cities-slug', params: { slug: entry.city.slug } })"
              class="view-city-btn"
            >
              View City Profile
              <LucideArrowRight :size="13" />
            </NuxtLink>
          </div>

          <!-- Attribution -->
          <div v-if="entry.city.image?.ownerName" class="attribution">
            Photo by {{ entry.city.image.ownerName }}
          </div>
        </div>
      </div>

      <!-- Retake CTA -->
      <div class="retake-section">
        <NuxtLink :to="localePath({ name: 'tools-quiz' })" class="retake-btn">
          <LucideRefreshCw :size="15" />
          {{ $t('quiz.retake') }}
        </NuxtLink>
        <NuxtLink :to="localePath('/')" class="explore-btn">
          {{ $t('hero.cta') }}
          <LucideArrowRight :size="15" />
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { scoreCity, type QuizAnswers, QUIZ_REGIONS, MAX_QUIZ_SCORE } from '~/shared/quiz.utils'

defineI18nRoute({ paths: { en: '/tools/quiz/results', pl: '/tools/quiz/results' } })

// noindex — results are personalized/dynamic
useSeoMeta({
  robots: 'noindex, nofollow',
})

const route = useRoute()
const localePath = useLocalePath()

// Parse answers from URL query params
const answers = computed<QuizAnswers>(() => ({
  budget: Number(route.query.budget ?? 1),
  climate: Number(route.query.climate ?? 4),
  internet: Number(route.query.internet ?? 3),
  safety: Number(route.query.safety ?? 2),
  regions: route.query.regions
    ? String(route.query.regions).split(',').filter(Boolean).map(Number)
    : [],
}))

// Month from URL query ('' = any time, '01'–'12' = specific month)
const month = computed(() => (route.query.month ? String(route.query.month) : ''))

// Fetch all quiz cities (with optional month for temperature override)
const { data } = await useQuizCities(month, { lazy: true })

// Score + sort + take top 5
const topCities = computed(() => {
  if (!data.value) return []

  return data.value
    .map((city) => {
      const score = scoreCity(
        {
          costForNomadInUsd: city.costForNomadInUsd,
          temperatureC: city.temperatureC,
          monthTemperatureC: city.monthTemperatureC,
          internetSpeedCity: city.internetSpeedCity,
          safety: city.safety as 'HIGH' | 'MIDDLE' | 'LOW' | null,
          region: city.region,
        },
        answers.value,
      )
      const pct = Math.round((score / MAX_QUIZ_SCORE) * 100)
      return { city, score, pct }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
})

// Share
const copied = ref(false)
async function share() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // clipboard not available
  }
}

// Card bg from unsplash
function cardBg(city: { image: { url: string } | null }) {
  if (!city.image?.url) return {}
  const src = `${city.image.url}&w=800&q=75&auto=format&fit=crop`
  return { '--card-bg': `url("${src}")` }
}

function rankClass(idx: number) {
  if (idx === 0) return 'rank-gold'
  if (idx === 1) return 'rank-silver'
  if (idx === 2) return 'rank-bronze'
  return ''
}
</script>

<style scoped>
.results-shell {
  min-height: 100dvh;
  background: #060e1b;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
}

/* ── Ambient ── */
.ambient { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
}
.orb-a {
  width: 50vw; height: 50vw;
  background: radial-gradient(circle, rgba(212,168,83,0.1), transparent 70%);
  top: -20%; right: -15%;
}
.orb-b {
  width: 40vw; height: 40vw;
  background: radial-gradient(circle, rgba(59,130,246,0.07), transparent 70%);
  bottom: 0; left: -10%;
}

/* ── Header ── */
.results-header {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.4);
  text-decoration: none;
  transition: color 0.2s;
}
.back-link:hover { color: rgba(255,255,255,0.8); }
.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.78rem;
  font-weight: 500;
  color: #d4a853;
  background: rgba(212,168,83,0.08);
  border: 1px solid rgba(212,168,83,0.2);
  border-radius: 8px;
  padding: 0.5rem 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}
.share-btn:hover { background: rgba(212,168,83,0.15); }

/* ── Loading ── */
.loading-state {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
.loading-ring {
  width: 40px; height: 40px;
  border: 2px solid rgba(255,255,255,0.1);
  border-top-color: #d4a853;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.loading-text {
  font-size: 0.875rem;
  color: rgba(255,255,255,0.4);
  font-family: 'JetBrains Mono', monospace;
}

/* ── Main ── */
.results-main {
  position: relative;
  z-index: 10;
  max-width: 680px;
  margin: 0 auto;
  width: 100%;
  padding: 2rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* ── Intro ── */
.results-intro { display: flex; flex-direction: column; gap: 0.5rem; }
.intro-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #d4a853;
  margin: 0;
}
.intro-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 600;
  color: #fff;
  margin: 0;
  line-height: 1.1;
}
.intro-sub {
  font-size: 0.875rem;
  color: rgba(255,255,255,0.45);
  margin: 0;
}

/* ── No results ── */
.no-results {
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(255,255,255,0.5);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.retake-link {
  color: #d4a853;
  text-decoration: none;
  font-weight: 600;
}

/* ── City list ── */
.city-list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

/* ── City card ── */
.city-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background-color: rgba(255,255,255,0.04);
  background-image: var(--card-bg);
  background-size: cover;
  background-position: center;
  border: 1px solid rgba(255,255,255,0.08);
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: fade-up 0.4s ease both;
}
.city-card:nth-child(1) { animation-delay: 0.05s; }
.city-card:nth-child(2) { animation-delay: 0.12s; }
.city-card:nth-child(3) { animation-delay: 0.19s; }
.city-card:nth-child(4) { animation-delay: 0.26s; }
.city-card:nth-child(5) { animation-delay: 0.33s; }
@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.city-card.featured {
  min-height: 280px;
  border-color: rgba(212,168,83,0.3);
  box-shadow: 0 0 0 1px rgba(212,168,83,0.15), 0 8px 40px rgba(0,0,0,0.4);
}
.city-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.4);
}

/* Dark gradient overlay */
.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(6, 14, 27, 0.92) 0%,
    rgba(6, 14, 27, 0.6) 50%,
    rgba(6, 14, 27, 0.1) 100%
  );
}

/* Rank badge */
.rank-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(6,14,27,0.7);
  border: 1px solid rgba(255,255,255,0.15);
  backdrop-filter: blur(6px);
}
.rank-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  font-weight: 500;
  color: rgba(255,255,255,0.7);
}
.rank-badge.rank-gold { border-color: #d4a853; background: rgba(212,168,83,0.2); }
.rank-badge.rank-gold .rank-num { color: #d4a853; }
.rank-badge.rank-silver { border-color: #a0aec0; background: rgba(160,174,192,0.15); }
.rank-badge.rank-silver .rank-num { color: #a0aec0; }
.rank-badge.rank-bronze { border-color: #c77f3e; background: rgba(199,127,62,0.15); }
.rank-badge.rank-bronze .rank-num { color: #c77f3e; }

/* Score ring */
.score-ring-wrap {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
  width: 48px;
  height: 48px;
}
.score-ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.score-val {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  font-weight: 500;
  color: #d4a853;
}

/* Card content */
.card-content {
  position: relative;
  z-index: 2;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.city-meta { display: flex; flex-direction: column; gap: 0.2rem; }
.city-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  line-height: 1.1;
}
.city-country {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.5);
  margin: 0;
}

/* Stat pills */
.city-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}
.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  font-weight: 500;
  padding: 0.25rem 0.625rem;
  border-radius: 99px;
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.75);
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(4px);
}
.stat-pill.safety-high { background: rgba(34,197,94,0.15); color: #4ade80; border-color: rgba(34,197,94,0.2); }
.stat-pill.safety-middle { background: rgba(234,179,8,0.12); color: #facc15; border-color: rgba(234,179,8,0.2); }
.stat-pill.safety-low { background: rgba(239,68,68,0.12); color: #f87171; border-color: rgba(239,68,68,0.2); }

/* View city button */
.view-city-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #d4a853;
  text-decoration: none;
  transition: gap 0.2s;
}
.view-city-btn:hover { gap: 0.6rem; }

/* Attribution */
.attribution {
  position: absolute;
  bottom: 0.5rem;
  right: 0.75rem;
  font-size: 0.55rem;
  color: rgba(255,255,255,0.2);
  z-index: 2;
}

/* ── Retake section ── */
.retake-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  padding-top: 0.5rem;
}
.retake-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255,255,255,0.5);
  text-decoration: none;
  padding: 0.625rem 1.25rem;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
  transition: all 0.2s;
}
.retake-btn:hover { color: #fff; background: rgba(255,255,255,0.08); }
.explore-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #d4a853;
  text-decoration: none;
  padding: 0.625rem 1.25rem;
  border-radius: 10px;
  background: rgba(212,168,83,0.08);
  border: 1px solid rgba(212,168,83,0.2);
  transition: all 0.2s;
}
.explore-btn:hover { background: rgba(212,168,83,0.15); }
</style>
