<template>
  <div class="screen">
    <div class="scanlines" aria-hidden="true" />

    <header class="topbar">
      <span class="pid">PID: 0x{{ pid }}</span>
      <span class="dot" :class="pulse ? 'dot--on' : 'dot--off'" />
      <span class="status">{{ pulse ? 'RUNNING' : 'IDLE' }}</span>
    </header>

    <main class="body">
      <svg class="robot" viewBox="0 0 80 88" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Antenna -->
        <line x1="40" y1="12" x2="40" y2="4" stroke="#39d66b" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="40" cy="3" r="3.5" fill="#f5c53a"/>
        <circle cx="40" cy="3" r="1.5" fill="#fff8d6"/>
        <!-- Ears -->
        <circle cx="11" cy="38" r="7.5" fill="#0c1e12" stroke="#39d66b" stroke-width="1.5"/>
        <circle cx="11" cy="38" r="3.5" fill="#0a1710"/>
        <circle cx="69" cy="38" r="7.5" fill="#0c1e12" stroke="#39d66b" stroke-width="1.5"/>
        <circle cx="69" cy="38" r="3.5" fill="#0a1710"/>
        <!-- Head -->
        <circle cx="40" cy="38" r="28" fill="#0c1e12" stroke="#39d66b" stroke-width="1.8"/>
        <!-- Left eye -->
        <circle cx="27" cy="35" r="10" fill="#060e09" stroke="#39d66b" stroke-width="1.4"/>
        <circle cx="27" cy="35" r="7"  fill="#2ecf60"/>
        <circle cx="27" cy="35" r="4"  fill="#0d3520"/>
        <circle cx="30"  cy="31.5" r="2.6" fill="white" opacity="0.95"/>
        <circle cx="24.5" cy="38"  r="1.2" fill="white" opacity="0.55"/>
        <circle cx="29"   cy="38"  r="0.7" fill="white" opacity="0.4"/>
        <!-- Right eye -->
        <circle cx="53" cy="35" r="10" fill="#060e09" stroke="#39d66b" stroke-width="1.4"/>
        <circle cx="53" cy="35" r="7"  fill="#2ecf60"/>
        <circle cx="53" cy="35" r="4"  fill="#0d3520"/>
        <circle cx="56"  cy="31.5" r="2.6" fill="white" opacity="0.95"/>
        <circle cx="50.5" cy="38"  r="1.2" fill="white" opacity="0.55"/>
        <circle cx="55"   cy="38"  r="0.7" fill="white" opacity="0.4"/>
        <!-- Cheeks -->
        <ellipse cx="18" cy="48" rx="8" ry="5" fill="#e85c7a" opacity="0.22"/>
        <ellipse cx="62" cy="48" rx="8" ry="5" fill="#e85c7a" opacity="0.22"/>
        <!-- Tiny nose -->
        <circle cx="40" cy="49" r="1.6" fill="#39d66b" opacity="0.65"/>
        <!-- Smile -->
        <path d="M31 55 Q40 65 49 55" stroke="#39d66b" stroke-width="2" stroke-linecap="round"/>
        <!-- Chest gem (red lucky accent) -->
        <path d="M37 70 L40 66 L43 70 L40 74 Z" fill="#e83a5a" opacity="0.85"/>
        <path d="M38.5 70 L40 67.5 L41.5 70 L40 72.5 Z" fill="#ff7a96" opacity="0.6"/>
        <!-- Body -->
        <ellipse cx="40" cy="79" rx="15" ry="7.5" fill="#0c1e12" stroke="#39d66b" stroke-width="1.5"/>
      </svg>

      <h1 class="title">COLLECTOR</h1>
      <p class="tagline">{{ tagline }}</p>

      <div class="log-box" ref="logBox">
        <div
          v-for="(entry, i) in log"
          :key="i"
          class="log-line"
          :class="entry.type"
        >
          <span class="log-time">{{ entry.time }}</span>
          <span class="log-tag">[{{ entry.tag }}]</span>
          <span class="log-msg">{{ entry.msg }}</span>
        </div>
        <div class="log-line cursor-line">
          <span class="log-time">{{ now }}</span>
          <span class="blink">█</span>
        </div>
      </div>

      <div class="stats">
        <div class="stat" v-for="s in stats" :key="s.label">
          <span class="stat-value">{{ s.value }}</span>
          <span class="stat-label">{{ s.label }}</span>
        </div>
      </div>
    </main>

    <footer class="foot">
      <span class="foot-note">nothing to see here, move along</span>
      <a href="https://whoisarjen.com" target="_blank" rel="noopener" class="foot-link">
        by @whoisarjen →
      </a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

useHead({ title: 'Collector — Nomad Data Scout' })

const pid = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0')
const pulse = ref(true)
const logBox = ref<HTMLElement | null>(null)
const now = ref('')

const taglines = [
  'scouting cities so nomads don\'t have to.',
  'visiting 847 cities simultaneously, via HTTP.',
  'collecting data nobody asked for, except nomads.',
  'bored but productive. mostly bored.',
  'running crons so you can find cheap rent.',
]
const tagline = taglines[Math.floor(Math.random() * taglines.length)]

type LogType = 'ok' | 'warn' | 'info' | 'dim'

const logMessages: Array<{ tag: string; msg: string; type: LogType }> = [
  { tag: 'CRON', msg: 'job started. nobody clapped.', type: 'ok' },
  { tag: 'HTTP', msg: 'GET Chiang Mai cost of living → $850/mo', type: 'dim' },
  { tag: 'DB', msg: 'upserted 847 cities. the db remains unimpressed.', type: 'ok' },
  { tag: 'HTTP', msg: 'GET Lisbon internet speed → 142 Mbps, nice', type: 'dim' },
  { tag: 'PARSE', msg: 'Tbilisi nomad score: 87/100. underrated.', type: 'ok' },
  { tag: 'WARN', msg: 'Medellín API rate limit hit. classic.', type: 'warn' },
  { tag: 'RETRY', msg: 'attempt 2/3. still optimistic.', type: 'warn' },
  { tag: 'HTTP', msg: 'GET Prague beer price → cheaper than coffee. noted.', type: 'dim' },
  { tag: 'DB', msg: 'writing 1,204 rows. sipping virtual coffee.', type: 'ok' },
  { tag: 'HTTP', msg: 'GET Tokyo rent → expensive. shocking to no one.', type: 'dim' },
  { tag: 'PARSE', msg: 'Amsterdam: bike count exceeds population. expected.', type: 'dim' },
  { tag: 'HTTP', msg: 'GET Dubai tax rate → 0%. confirmed again.', type: 'ok' },
  { tag: 'WARN', msg: 'Playa del Carmen humidity: 91%. concerning.', type: 'warn' },
  { tag: 'DB', msg: 'index scan: 2ms. fast and meaningless.', type: 'ok' },
  { tag: 'HTTP', msg: 'GET Bali visa rules → 30d free, still fine', type: 'dim' },
  { tag: 'CRON', msg: 'job finished. nobody was watching.', type: 'ok' },
  { tag: 'SYS', msg: 'memory: fine. spirit: diminished.', type: 'info' },
  { tag: 'WARN', msg: 'you visited this page. that was unexpected.', type: 'warn' },
  { tag: 'CRON', msg: 'next run in 6h. going to nap.', type: 'info' },
  { tag: 'SYS', msg: 'carrying on regardless.', type: 'dim' },
]

const log = ref<Array<{ time: string; tag: string; msg: string; type: LogType }>>([])
const stats = ref([
  { label: 'cities tracked', value: '0' },
  { label: 'data points', value: '0' },
  { label: 'crons today', value: '0' },
  { label: 'coffee consumed', value: '∞' },
])

function getTime() {
  return new Date().toLocaleTimeString('en-GB', { hour12: false })
}

function animateStats() {
  const finals = [847, 124308, 48, '∞'] as const
  let step = 0
  const iv = setInterval(() => {
    step++
    stats.value = stats.value.map((s, i) => ({
      ...s,
      value: finals[i] === '∞' ? '∞' : step >= 30
        ? String(finals[i])
        : String(Math.floor((Number(finals[i]) / 30) * step)),
    }))
    if (step >= 30) clearInterval(iv)
  }, 50)
}

let logIdx = 0
let logTimer: ReturnType<typeof setInterval>
let clockTimer: ReturnType<typeof setInterval>
let pulseTimer: ReturnType<typeof setInterval>

onMounted(() => {
  now.value = getTime()
  clockTimer = setInterval(() => { now.value = getTime() }, 1000)
  pulseTimer = setInterval(() => { pulse.value = !pulse.value }, 900)

  const addLog = () => {
    const entry = logMessages[logIdx % logMessages.length]!
    log.value.push({ ...entry, time: getTime() })
    logIdx++
    if (log.value.length > 12) log.value.shift()
    setTimeout(() => {
      logBox.value?.scrollTo({ top: logBox.value.scrollHeight, behavior: 'smooth' })
    }, 50)
  }

  addLog()
  logTimer = setInterval(addLog, 2200)
  animateStats()
})

onUnmounted(() => {
  clearInterval(logTimer)
  clearInterval(clockTimer)
  clearInterval(pulseTimer)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Azeret+Mono:ital,wght@0,100..900;1,100..900&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:     #080c0b;
  --panel:  #0d1410;
  --border: #1c2e22;
  --green:  #39d66b;
  --dim:    #2e5c40;
  --muted:  #537a60;
  --warn:   #d6a039;
  --info:   #39b4d6;
  --text:   #c8e8d0;
  --font:   'Azeret Mono', monospace;
}

html, body { height: 100%; background: var(--bg); color: var(--text); font-family: var(--font); }

.screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 740px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
}

.scanlines {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 100;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 3px,
    rgba(0,0,0,0.06) 3px,
    rgba(0,0,0,0.06) 4px
  );
}

/* ── Top bar ── */
.topbar {
  display: flex;
  align-items: center;
  gap: .6rem;
  padding: 1.2rem 0 .8rem;
  border-bottom: 1px solid var(--border);
  font-size: .7rem;
  color: var(--muted);
  letter-spacing: .1em;
  text-transform: uppercase;
}
.pid { margin-right: auto; }
.dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  transition: background .3s;
}
.dot--on  { background: var(--green); box-shadow: 0 0 8px var(--green); }
.dot--off { background: var(--dim); }
.status { color: var(--green); font-size: .7rem; }

/* ── Body ── */
.body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 0 2rem;
  gap: 1.4rem;
}

.robot {
  width: 150px;
  height: auto;
  filter: drop-shadow(0 0 10px rgba(57,214,107,.65)) drop-shadow(0 0 28px rgba(57,214,107,.25));
  animation: float 4s ease-in-out infinite;
  user-select: none;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-6px); }
}

.title {
  font-size: clamp(3.5rem, 10vw, 6rem);
  font-weight: 900;
  letter-spacing: -.02em;
  color: var(--green);
  text-shadow: 0 0 40px rgba(57,214,107,.3), 0 0 80px rgba(57,214,107,.1);
  line-height: 1;
}

.tagline {
  font-size: .8rem;
  color: var(--muted);
  font-style: italic;
  letter-spacing: .05em;
}

/* ── Log box ── */
.log-box {
  width: 100%;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 1rem 1.2rem;
  font-size: .72rem;
  line-height: 1.8;
  height: 230px;
  overflow-y: auto;
  scrollbar-width: none;
}
.log-box::-webkit-scrollbar { display: none; }

.log-line {
  display: grid;
  grid-template-columns: 6rem 5rem 1fr;
  gap: .4rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cursor-line { grid-template-columns: 6rem 1fr; }

.log-time { color: var(--dim); }
.log-tag  { color: var(--muted); }
.log-msg  { color: var(--text); }

.log-line.ok   .log-msg { color: var(--green); }
.log-line.warn .log-msg { color: var(--warn);  }
.log-line.info .log-msg { color: var(--info);  }
.log-line.dim  .log-msg { color: var(--muted); }

.blink {
  color: var(--green);
  animation: blink 1s step-end infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

/* ── Stats ── */
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  width: 100%;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
}
.stat {
  background: var(--panel);
  padding: 1rem .8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .3rem;
}
.stat-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--green);
  text-shadow: 0 0 20px rgba(57,214,107,.4);
  font-variant-numeric: tabular-nums;
}
.stat-label {
  font-size: .6rem;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: var(--muted);
  text-align: center;
}

/* ── Footer ── */
.foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0 1.5rem;
  border-top: 1px solid var(--border);
  font-size: .68rem;
  color: var(--dim);
}
.foot-note { font-style: italic; }
.foot-link {
  color: var(--green);
  text-decoration: none;
  letter-spacing: .05em;
  transition: text-shadow .2s;
}
.foot-link:hover { text-shadow: 0 0 12px var(--green); }

@media (max-width: 500px) {
  .stats { grid-template-columns: repeat(2, 1fr); }
  .log-line { grid-template-columns: 5.5rem 4rem 1fr; font-size: .65rem; }
}
</style>
