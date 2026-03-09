<template>
  <div class="quiz-shell">
    <!-- Google Fonts -->
    <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
    </Head>

    <!-- Ambient background orbs -->
    <div class="ambient" aria-hidden="true">
      <div class="orb orb-a" />
      <div class="orb orb-b" />
      <div class="orb orb-c" />
    </div>

    <!-- Top chrome -->
    <header class="quiz-header">
      <NuxtLink :to="localePath('tools')" class="back-home">
        <LucideArrowLeft :size="16" />
        <span>Tools</span>
      </NuxtLink>

      <div class="step-dots">
        <span
          v-for="n in TOTAL_STEPS"
          :key="n"
          class="step-dot"
          :class="{ active: n === currentStep, done: n < currentStep }"
        />
      </div>

      <div class="step-label">
        <span class="step-num">{{ String(currentStep).padStart(2, '0') }}</span>
        <span class="step-sep">/</span>
        <span class="step-total">{{ String(TOTAL_STEPS).padStart(2, '0') }}</span>
      </div>
    </header>

    <!-- Progress bar -->
    <div class="progress-track" aria-hidden="true">
      <div class="progress-fill" :style="{ width: progressPct + '%' }" />
    </div>

    <!-- Quiz stage (slide transitions) -->
    <main class="quiz-main">
      <Transition :name="slideDir" mode="out-in">
        <!-- Step 1: Budget -->
        <div v-if="currentStep === 1" key="budget" class="step-card">
          <p class="step-badge">
            <LucideDollarSign :size="13" />
            {{ $t('quiz.stepBudget.question') }}
          </p>
          <h1 class="question">{{ $t('quiz.stepBudget.question') }}</h1>
          <div class="options-grid cols-2">
            <button
              v-for="(opt, i) in budgetOpts"
              :key="i"
              class="option-tile"
              :class="{ selected: answers.budget === i }"
              @click="pick('budget', i)"
            >
              <span class="opt-icon">{{ opt.icon }}</span>
              <span class="opt-label">{{ $t(`quiz.stepBudget.opt${i}`) }}</span>
            </button>
          </div>
        </div>

        <!-- Step 2: Climate -->
        <div v-else-if="currentStep === 2" key="climate" class="step-card">
          <p class="step-badge">
            <LucideThermometer :size="13" />
            {{ $t('quiz.stepClimate.question') }}
          </p>
          <h1 class="question">{{ $t('quiz.stepClimate.question') }}</h1>
          <div class="options-grid cols-3">
            <button
              v-for="(opt, i) in climateOpts"
              :key="i"
              class="option-tile"
              :class="{ selected: answers.climate === i, wide: i === 4 }"
              @click="pick('climate', i)"
            >
              <span class="opt-icon">{{ opt.icon }}</span>
              <span class="opt-label">{{ $t(`quiz.stepClimate.opt${i}`) }}</span>
            </button>
          </div>
        </div>

        <!-- Step 3: Internet -->
        <div v-else-if="currentStep === 3" key="internet" class="step-card">
          <p class="step-badge">
            <LucideWifi :size="13" />
            {{ $t('quiz.stepInternet.question') }}
          </p>
          <h1 class="question">{{ $t('quiz.stepInternet.question') }}</h1>
          <div class="options-grid cols-2">
            <button
              v-for="(opt, i) in internetOpts"
              :key="i"
              class="option-tile"
              :class="{ selected: answers.internet === i }"
              @click="pick('internet', i)"
            >
              <span class="opt-icon">{{ opt.icon }}</span>
              <span class="opt-label">{{ $t(`quiz.stepInternet.opt${i}`) }}</span>
              <span v-if="opt.sub" class="opt-sub">{{ opt.sub }}</span>
            </button>
          </div>
        </div>

        <!-- Step 4: Safety -->
        <div v-else-if="currentStep === 4" key="safety" class="step-card">
          <p class="step-badge">
            <LucideShield :size="13" />
            {{ $t('quiz.stepSafety.question') }}
          </p>
          <h1 class="question">{{ $t('quiz.stepSafety.question') }}</h1>
          <div class="options-grid cols-1">
            <button
              v-for="(opt, i) in safetyOpts"
              :key="i"
              class="option-tile"
              :class="{ selected: answers.safety === i }"
              @click="pick('safety', i)"
            >
              <span class="opt-icon">{{ opt.icon }}</span>
              <span class="opt-label">{{ $t(`quiz.stepSafety.opt${i}`) }}</span>
            </button>
          </div>
        </div>

        <!-- Step 5: Regions -->
        <div v-else-if="currentStep === 5" key="regions" class="step-card">
          <p class="step-badge">
            <LucideGlobe :size="13" />
            {{ $t('quiz.stepRegions.question') }}
          </p>
          <h1 class="question">{{ $t('quiz.stepRegions.question') }}</h1>
          <p class="step-hint">Select all that apply</p>
          <div class="options-grid cols-2">
            <!-- Anywhere (special) -->
            <button
              class="option-tile wide"
              :class="{ selected: answers.regions.length === 0 }"
              @click="selectAnywhere"
            >
              <span class="opt-icon">🌐</span>
              <span class="opt-label">{{ $t('quiz.stepRegions.anywhere') }}</span>
            </button>
            <button
              v-for="(region, i) in QUIZ_REGIONS"
              :key="region"
              class="option-tile"
              :class="{ selected: answers.regions.includes(i) }"
              @click="toggleRegion(i)"
            >
              <span class="opt-icon">{{ regionEmojis[i] }}</span>
              <span class="opt-label">{{ $t(`regions.${region}`) }}</span>
            </button>
          </div>
        </div>

        <!-- Step 6: Month -->
        <div v-else-if="currentStep === 6" key="month" class="step-card">
          <p class="step-badge">
            <LucideCalendar :size="13" />
            {{ $t('quiz.stepMonth.question') }}
          </p>
          <h1 class="question">{{ $t('quiz.stepMonth.question') }}</h1>
          <div class="options-grid cols-3">
            <button
              class="option-tile wide"
              :class="{ selected: answers.month === '' }"
              @click="answers.month = ''"
            >
              <span class="opt-icon">🗓️</span>
              <span class="opt-label">{{ $t('quiz.stepMonth.anyTime') }}</span>
            </button>
            <button
              v-for="mo in monthOpts"
              :key="mo.value"
              class="option-tile"
              :class="{ selected: answers.month === mo.value }"
              @click="pickMonth(mo.value)"
            >
              <span class="opt-icon">{{ mo.icon }}</span>
              <span class="opt-label">{{ $t(`quiz.stepMonth.${mo.key}`) }}</span>
            </button>
          </div>
        </div>
      </Transition>

      <!-- Nav controls -->
      <div class="quiz-nav">
        <button v-if="currentStep > 1" class="nav-btn secondary" @click="goBack">
          <LucideArrowLeft :size="16" />
          {{ $t('quiz.back') }}
        </button>
        <div v-else class="nav-spacer" />

        <button
          class="nav-btn primary"
          :disabled="!canProceed"
          @click="goNext"
        >
          {{ currentStep === TOTAL_STEPS ? $t('quiz.seeResults') : $t('quiz.next') }}
          <LucideArrowRight :size="16" />
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { QUIZ_REGIONS } from '~/shared/quiz.utils'

defineI18nRoute({ paths: { en: '/tools/quiz', pl: '/tools/quiz' } })

const { t } = useCustomI18n()
const router = useRouter()
const localePath = useLocalePath()

useSeoMeta({
  title: () => t('quiz.metaTitle'),
  description: () => t('quiz.metaDesc'),
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: '/' },
      { name: () => t('tools.badge'), item: '/tools' },
      { name: () => t('quiz.badge'), item: '/tools/quiz' },
    ],
  }),
])

const TOTAL_STEPS = 6

const currentStep = ref(1)
const slideDir = ref<'slide-right' | 'slide-left'>('slide-right')

const answers = reactive({
  budget: -1,
  climate: -1,
  internet: -1,
  safety: -1,
  regions: [] as number[],
  month: '',
})

const progressPct = computed(() => ((currentStep.value - 1) / (TOTAL_STEPS - 1)) * 100)

const canProceed = computed(() => {
  if (currentStep.value === 1) return answers.budget >= 0
  if (currentStep.value === 2) return answers.climate >= 0
  if (currentStep.value === 3) return answers.internet >= 0
  if (currentStep.value === 4) return answers.safety >= 0
  if (currentStep.value === 5) return true // regions has "anywhere" default
  if (currentStep.value === 6) return true // month has "any time" default
  return false
})

function pick(key: 'budget' | 'climate' | 'internet' | 'safety', idx: number) {
  answers[key] = idx
  // Auto-advance on selection after brief delay
  if (currentStep.value < TOTAL_STEPS) {
    setTimeout(goNext, 220)
  }
}

function toggleRegion(idx: number) {
  const pos = answers.regions.indexOf(idx)
  if (pos === -1) {
    answers.regions.push(idx)
  } else {
    answers.regions.splice(pos, 1)
  }
}

function selectAnywhere() {
  answers.regions = []
}

function goNext() {
  if (!canProceed.value) return
  if (currentStep.value === TOTAL_STEPS) {
    submitQuiz()
    return
  }
  slideDir.value = 'slide-right'
  currentStep.value++
}

function goBack() {
  slideDir.value = 'slide-left'
  currentStep.value--
}

function pickMonth(value: string) {
  answers.month = value
}

function submitQuiz() {
  router.push(
    localePath({
      name: 'tools-quiz-results',
      query: {
        budget: answers.budget,
        climate: answers.climate,
        internet: answers.internet,
        safety: answers.safety,
        regions: answers.regions.join(','),
        ...(answers.month ? { month: answers.month } : {}),
      },
    }),
  )
}

// Option definitions
const budgetOpts = [
  { icon: '🪙' },
  { icon: '💵' },
  { icon: '💳' },
  { icon: '💎' },
]

const climateOpts = [
  { icon: '🧊' },
  { icon: '🌤️' },
  { icon: '☀️' },
  { icon: '🌴' },
  { icon: '🌍' },
]

const internetOpts = [
  { icon: '📶', sub: '20 Mbps' },
  { icon: '⚡', sub: '50 Mbps' },
  { icon: '🚀', sub: '100 Mbps' },
  { icon: '🤷' },
]

const safetyOpts = [
  { icon: '🛡️' },
  { icon: '🔓' },
  { icon: '🧭' },
]

const regionEmojis = ['🇪🇺', '🌏', '🕌', '🌮', '🗽', '🌍', '🦘']

const monthOpts = [
  { value: '01', key: 'jan', icon: '❄️' },
  { value: '02', key: 'feb', icon: '🌨️' },
  { value: '03', key: 'mar', icon: '🌱' },
  { value: '04', key: 'apr', icon: '🌸' },
  { value: '05', key: 'may', icon: '🌿' },
  { value: '06', key: 'jun', icon: '☀️' },
  { value: '07', key: 'jul', icon: '🏖️' },
  { value: '08', key: 'aug', icon: '🌞' },
  { value: '09', key: 'sep', icon: '🍂' },
  { value: '10', key: 'oct', icon: '🍁' },
  { value: '11', key: 'nov', icon: '🌧️' },
  { value: '12', key: 'dec', icon: '🎄' },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=JetBrains+Mono:wght@400;500&display=swap');

.quiz-shell {
  min-height: 100dvh;
  background: #060e1b;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* ── Ambient orbs ── */
.ambient {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 8s ease-in-out infinite;
}
.orb-a {
  width: 45vw;
  height: 45vw;
  background: radial-gradient(circle, rgba(212, 168, 83, 0.12), transparent 70%);
  top: -15%;
  right: -10%;
  animation-delay: 0s;
}
.orb-b {
  width: 35vw;
  height: 35vw;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.08), transparent 70%);
  bottom: -10%;
  left: -8%;
  animation-delay: -3s;
}
.orb-c {
  width: 25vw;
  height: 25vw;
  background: radial-gradient(circle, rgba(212, 168, 83, 0.07), transparent 70%);
  top: 40%;
  left: 50%;
  animation-delay: -5s;
}
@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(2%, 3%); }
}

/* ── Header ── */
.quiz-header {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
}
.back-home {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.35);
  text-decoration: none;
  transition: color 0.2s;
  letter-spacing: 0.04em;
}
.back-home:hover { color: rgba(255,255,255,0.7); }

.step-dots {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.step-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  transition: all 0.3s ease;
}
.step-dot.active {
  background: #d4a853;
  width: 20px;
  border-radius: 3px;
}
.step-dot.done {
  background: rgba(212, 168, 83, 0.5);
}

.step-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.3);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.step-num { color: #d4a853; font-size: 0.8rem; }
.step-sep { opacity: 0.4; }

/* ── Progress bar ── */
.progress-track {
  position: relative;
  z-index: 10;
  height: 2px;
  background: rgba(255,255,255,0.06);
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #b8882e, #d4a853, #f0c96a);
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 8px rgba(212, 168, 83, 0.5);
}

/* ── Main stage ── */
.quiz-main {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  gap: 2rem;
  max-width: 680px;
  margin: 0 auto;
  width: 100%;
}

/* ── Step card ── */
.step-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.step-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #d4a853;
  opacity: 0.8;
  margin: 0;
}

.question {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.75rem, 5vw, 2.75rem);
  font-weight: 600;
  color: #fff;
  line-height: 1.15;
  margin: 0;
  letter-spacing: -0.01em;
}

.step-hint {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.35);
  margin: -0.75rem 0 0;
  font-style: italic;
}

/* ── Options grid ── */
.options-grid {
  display: grid;
  gap: 0.625rem;
}
.cols-1 { grid-template-columns: 1fr; }
.cols-2 { grid-template-columns: 1fr 1fr; }
.cols-3 { grid-template-columns: 1fr 1fr 1fr; }

@media (max-width: 400px) {
  .cols-3 { grid-template-columns: 1fr 1fr; }
}

.option-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 0.75rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.18s ease;
  text-align: center;
  min-height: 88px;
  color: rgba(255,255,255,0.7);
}
.option-tile:hover {
  background: rgba(255,255,255,0.07);
  border-color: rgba(255,255,255,0.15);
  color: #fff;
  transform: translateY(-1px);
}
.option-tile.selected {
  background: rgba(212, 168, 83, 0.1);
  border-color: #d4a853;
  color: #fff;
  box-shadow: 0 0 0 1px rgba(212, 168, 83, 0.3), 0 4px 20px rgba(212, 168, 83, 0.12);
}
.option-tile.wide {
  grid-column: 1 / -1;
  flex-direction: row;
  min-height: 60px;
  padding: 0.875rem 1.25rem;
  justify-content: flex-start;
  gap: 0.75rem;
}

.opt-icon {
  font-size: 1.375rem;
  line-height: 1;
  flex-shrink: 0;
}
.opt-label {
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1.3;
}
.opt-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: #d4a853;
  opacity: 0.7;
}
.option-tile.selected .opt-sub {
  opacity: 1;
}

/* ── Nav buttons ── */
.quiz-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;
}
.nav-spacer { flex: 1; }
.nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;
  border: none;
}
.nav-btn.secondary {
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.6);
  border: 1px solid rgba(255,255,255,0.08);
}
.nav-btn.secondary:hover {
  background: rgba(255,255,255,0.1);
  color: #fff;
}
.nav-btn.primary {
  background: linear-gradient(135deg, #b8882e, #d4a853);
  color: #0d0d0d;
  box-shadow: 0 4px 18px rgba(212, 168, 83, 0.25);
  margin-left: auto;
}
.nav-btn.primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(212, 168, 83, 0.35);
}
.nav-btn.primary:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  transform: none;
}

/* ── Slide transitions ── */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-right-enter-from { opacity: 0; transform: translateX(40px); }
.slide-right-leave-to  { opacity: 0; transform: translateX(-40px); }
.slide-left-enter-from { opacity: 0; transform: translateX(-40px); }
.slide-left-leave-to  { opacity: 0; transform: translateX(40px); }
</style>
