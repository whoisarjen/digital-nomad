<template>
  <AuthGate :message="t('favorites.signInToSave')" position="bottom" align="right" v-slot="{ isLocked }">
    <button
      @click.stop.prevent="handleClick"
      :disabled="toggling || isLocked"
      :class="[
        'group/fav relative transition-all duration-300 select-none',
        variant === 'overlay' ? overlayClasses : inlineClasses,
        toggling && 'pointer-events-none',
        isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ]"
      :aria-label="isFav ? t('favorites.saved') : t('favorites.save')"
    >
      <span
        v-if="showPing"
        class="absolute inset-0 rounded-full animate-ping-once bg-rose-400/30 pointer-events-none"
      />
      <LucideHeart
        :size="size === 'sm' ? 16 : 18"
        :class="[
          'transition-all duration-300 ease-out',
          isFav
            ? 'text-rose-500 fill-rose-500 drop-shadow-[0_0_6px_rgba(244,63,94,0.4)]'
            : !isLocked
              ? 'text-white group-hover/fav:text-rose-400 group-hover/fav:drop-shadow-[0_0_4px_rgba(251,113,133,0.3)]'
              : 'text-white/50',
          justToggled && 'scale-125',
          !justToggled && 'scale-100',
        ]"
      />
      <span
        v-if="variant === 'inline'"
        :class="[
          'transition-colors duration-300 text-sm font-medium',
          isFav ? 'text-rose-400' : 'text-white/70 group-hover/fav:text-white',
        ]"
      >
        {{ isFav ? t('favorites.saved') : t('favorites.save') }}
      </span>
      <template v-if="showBurst">
        <span
          v-for="i in 6"
          :key="i"
          class="absolute pointer-events-none size-1 rounded-full bg-rose-400"
          :style="getBurstStyle(i)"
        />
      </template>
    </button>
  </AuthGate>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  citySlug: string
  variant?: 'overlay' | 'inline'
  size?: 'sm' | 'md'
}>(), {
  variant: 'overlay',
  size: 'sm',
})

const { t } = useCustomI18n()
const { isFavorited, toggleFavorite, isLoggedIn } = useFavoriteSlugs()

const toggling = ref(false)
const justToggled = ref(false)
const showPing = ref(false)
const showBurst = ref(false)

const isFav = computed(() => isFavorited(props.citySlug))

const overlayClasses = computed(() => [
  'flex items-center justify-center rounded-full backdrop-blur-md',
  'bg-black/50 border border-white/[0.08]',
  'hover:bg-black/60 hover:border-white/[0.15]',
  props.size === 'sm' ? 'size-9' : 'size-11',
].join(' '))

const inlineClasses = computed(() => [
  'flex items-center gap-2 rounded-full',
  'bg-white/[0.06] border border-white/[0.08]',
  'hover:bg-white/[0.1] hover:border-white/[0.15]',
  props.size === 'sm' ? 'px-3 py-1.5' : 'px-4 py-2',
].join(' '))

function getBurstStyle(index: number) {
  const angle = (index * 60) * (Math.PI / 180)
  const distance = 14
  return {
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`,
    animation: 'burst 0.5s ease-out forwards',
    animationDelay: `${index * 20}ms`,
  }
}

async function handleClick() {
  if (toggling.value || !isLoggedIn.value) return
  toggling.value = true

  await toggleFavorite(props.citySlug)

  justToggled.value = true
  if (isFav.value) {
    showBurst.value = true
    showPing.value = true
  }

  setTimeout(() => {
    justToggled.value = false
  }, 300)

  setTimeout(() => {
    showPing.value = false
    showBurst.value = false
    toggling.value = false
  }, 500)
}
</script>

<style scoped>
@keyframes burst {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) translate(0, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) translate(var(--tx, 14px), var(--ty, 0)) scale(0);
  }
}

.animate-ping-once {
  animation: ping-once 0.5s ease-out forwards;
}

@keyframes ping-once {
  0% {
    transform: scale(1);
    opacity: 0.4;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}
</style>
