<template>
  <div class="relative group">
    <div
      class="p-2 rounded-xl hover:bg-white/20 focus:bg-white/20 focus:outline-none transition-all duration-300 cursor-pointer flex items-center justify-center min-w-11 min-h-11"
      tabindex="0"
    >
      <img
        :src="`/flags/${locale}.png`"
        :alt="locale"
        class="w-7 h-5 rounded border border-white/20"
      />
    </div>

    <div class="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-all duration-200 z-[9999] right-0" :class="direction === 'above' ? 'bottom-full mb-1' : 'top-full mt-1'">
      <div class="bg-white min-w-40 shadow-xl py-2 rounded-xl border">
        <h3 class="px-3 font-medium mb-2 block text-center text-gray-900 text-sm">
          {{ $t('lang.selectLanguage') }}
        </h3>
        <div class="divide-y max-h-80 overflow-y-auto">
          <NuxtLink
            v-for="language in locales"
            :key="language.code"
            :to="switchLocalePath(language.code as any)"
            class="py-2.5 flex justify-between hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-all cursor-pointer px-3 items-center min-h-11 text-gray-900 text-sm"
          >
            {{ language.name }}
            <img
              :src="`/flags/${language.code}.png`"
              :alt="language.code as string"
              class="w-7 h-5 rounded border border-gray-200"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  direction?: 'above' | 'below'
}>(), {
  direction: 'below',
})
const { locale, locales } = useCustomI18n();
const switchLocalePath = useSwitchLocalePath();
</script>
