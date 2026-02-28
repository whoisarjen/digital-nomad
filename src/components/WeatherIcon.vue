<template>
  <LucideSun v-if="props.weatherIcon === 'SUN'" :size="16" />
  <LucideCloudy v-else-if="props.weatherIcon === 'CLOUDY'" :size="16" />
  <LucideWind v-else-if="props.weatherIcon === 'WIND'" :size="16" />
  <LucideCloudRain v-else-if="props.weatherIcon === 'RAIN'" :size="16" />
  <LucideSnowflake v-else-if="props.weatherIcon === 'SNOW'" :size="16" />
</template>

<script lang="ts" setup>
import type { WeatherIcon } from '@prisma/client';

const props = defineProps<{
  weatherIcon: WeatherIcon
}>()
</script>
