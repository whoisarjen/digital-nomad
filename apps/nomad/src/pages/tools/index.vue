<template>
  <div class="min-h-screen bg-[#060E1B]">
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-1/3 -right-[15%] w-[50%] h-[50%] rounded-full bg-primary-500/[0.06] blur-[100px] animate-float" />
        <div class="absolute -bottom-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-accent-500/[0.04] blur-[80px] animate-float-reverse" />
      </div>

      <div class="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <div class="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-1.5 text-sm text-gray-400 mb-6">
          <LucideWrench :size="14" class="text-primary-400" />
          {{ $t('tools.badge') }}
        </div>

        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-4">
          {{ $t('tools.title') }}
        </h1>
        <p class="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {{ $t('tools.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Tools grid -->
    <section class="max-w-5xl mx-auto px-6 pb-24">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NuxtLink
          v-for="tool in tools"
          :key="tool.name"
          :to="localePath(tool.route)"
          class="group relative flex flex-col bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/[0.16] rounded-2xl p-7 transition-all duration-300 overflow-hidden"
        >
          <!-- Accent glow on hover -->
          <div
            class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-2xl pointer-events-none"
            :class="tool.glowClass"
          />

          <div class="relative z-10 flex flex-col h-full">
            <!-- Icon -->
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 flex-shrink-0"
              :class="tool.iconBgClass"
            >
              <component :is="tool.icon" :size="26" :class="tool.iconClass" />
            </div>

            <!-- Content -->
            <div class="flex-1">
              <div class="flex items-start justify-between gap-3 mb-2">
                <h2 class="text-lg font-bold text-white leading-tight">{{ tool.name }}</h2>
                <span
                  class="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  :class="tool.badgeClass"
                >
                  {{ tool.badge }}
                </span>
              </div>
              <p class="text-sm text-gray-400 leading-relaxed mb-6">
                {{ tool.description }}
              </p>
            </div>

            <!-- Footer -->
            <div class="flex items-center gap-1.5 text-sm font-semibold" :class="tool.ctaClass">
              {{ $t('tools.open') }}
              <LucideArrowRight :size="15" class="transition-transform group-hover:translate-x-1 duration-200" />
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t } = useCustomI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => t('tools.metaTitle'),
  description: () => t('tools.metaDesc'),
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: '/' },
      { name: () => t('tools.badge') },
    ],
  }),
])

const iconCalendar = resolveComponent('LucideCalendarDays')
const iconPiggyBank = resolveComponent('LucidePiggyBank')
const iconSunrise = resolveComponent('LucideSunrise')
const iconSparkles = resolveComponent('LucideSparkles')

const tools = computed(() => [
  {
    route: 'quiz',
    name: t('quiz.title'),
    description: t('quiz.subtitle'),
    badge: t('landing.new'),
    icon: iconSparkles,
    iconBgClass: 'bg-amber-500/15',
    iconClass: 'text-amber-400',
    glowClass: 'bg-amber-500/[0.04]',
    badgeClass: 'bg-amber-500/20 text-amber-300',
    ctaClass: 'text-amber-400',
  },
  {
    route: 'tools-schengen-calculator',
    name: t('tools.schengenName'),
    description: t('tools.schengenDesc'),
    badge: t('tools.badgeFree'),
    icon: iconCalendar,
    iconBgClass: 'bg-primary-500/15',
    iconClass: 'text-primary-400',
    glowClass: 'bg-primary-500/[0.04]',
    badgeClass: 'bg-primary-500/20 text-primary-300',
    ctaClass: 'text-primary-400',
  },
  {
    route: 'tools-runway-calculator',
    name: t('tools.runwayName'),
    description: t('tools.runwayDesc'),
    badge: t('tools.badgeNew'),
    icon: iconPiggyBank,
    iconBgClass: 'bg-accent-500/15',
    iconClass: 'text-accent-400',
    glowClass: 'bg-accent-500/[0.04]',
    badgeClass: 'bg-accent-500/20 text-accent-300',
    ctaClass: 'text-accent-400',
  },
  {
    route: 'tools-day-in-the-life',
    name: t('tools.dayInLifeName'),
    description: t('tools.dayInLifeDesc'),
    badge: t('tools.badgeNew'),
    icon: iconSunrise,
    iconBgClass: 'bg-amber-500/15',
    iconClass: 'text-amber-400',
    glowClass: 'bg-amber-500/[0.04]',
    badgeClass: 'bg-amber-500/20 text-amber-300',
    ctaClass: 'text-amber-400',
  },
])
</script>
