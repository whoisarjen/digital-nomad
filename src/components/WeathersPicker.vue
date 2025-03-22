<template>
  <div class="block text-sm font-medium text-gray-700">Weathers</div>
  <div class="flex flex-wrap gap-1">
    <div
      v-for="icon in (Object.keys(WEATHERS_ICONS) as WeatherIcon[])"
      :key="icon"
      @click="selectWeather(icon)"
      class="custom-button flex flex-grow justify-center"
      :class="{
        'custom-button-active': selectedOptions.includes(icon),
      }"
    >
      <WeatherIcon :weather-icon="icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import concat from 'lodash/concat'
import compact from 'lodash/compact'
import type { WeatherIcon } from '@prisma/client';

const route = useRoute();
const router = useRouter();

const WEATHERS_ICONS = {
  SUN: true,
  CLOUDY: true,
  WIND: true,
  RAIN: true,
  SNOW: true,
} as const satisfies { [key in Exclude<WeatherIcon, 'NULL'>]: boolean }

const selectedOptions = ref<string[]>(compact(concat(route.query.weathers as string | string[] | undefined)));

function selectWeather(value: string) {
  const index = selectedOptions.value.indexOf(value);

  let newSelections = []
  if (index !== -1) {
    newSelections = selectedOptions.value.filter(option => option !== value);
  } else {
    newSelections = [...selectedOptions.value, value];
  }

  router.push({
    query: {
      ...route.query,
      page: undefined,
      weathers: newSelections,
    },
  });
}

watch(() => route.query.weathers, (newVal) => {
  selectedOptions.value = Array.isArray(newVal)
    ? (newVal as string[])
    : newVal ? [newVal] : [];
}, {
  immediate: true,
});
</script>
