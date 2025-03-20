<template>
  <div class="block text-sm font-medium text-gray-700">Weathers</div>
  <div class="flex flex-wrap gap-1 justify-between">
    <div
      v-for="icon in (Object.keys(WEATHERS_ICONS) as WeatherIcon[])"
      :key="icon"
      @click="selectWeather(icon)"
      :class="[
        'px-4 py-2 rounded-xl border transition-all cursor-pointer text-center text-sm',
        selectedOption === icon
          ? 'bg-blue-500 text-white border-blue-500 scale-105'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
      ]"
    >
      <WeatherIcon :weather-icon="icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WeatherIcon } from '@prisma/client';

const route = useRoute();
const router = useRouter();

const WEATHERS_ICONS = {
  CLOUDY: true,
  SUN: true,
  WIND: true,
  RAIN: true,
  SNOW: true,
} as const satisfies { [key in Exclude<WeatherIcon, 'NULL'>]: boolean }

const selectedOption = ref<string | undefined>(route.query.weathers as string | undefined);

function selectWeather(value: string) {
  const isAlreadySelected = selectedOption.value === value

  if (isAlreadySelected) {
    selectedOption.value = undefined
  } else {
    selectedOption.value = value;
  }

  router.push({
    query: {
      ...route.query,
      page: undefined,
      weathers: isAlreadySelected ? undefined : value,
    }
  });
}

watch(() => route.query.weathers, (newVal) => {
  selectedOption.value = newVal as string | undefined
}, {
  immediate: true,
});
</script>
