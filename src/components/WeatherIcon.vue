<template>
  <LucideSun v-if="!props.weatherCode || SUN_CODES.includes(props.weatherCode)" :size="16" />
  <LucideCloudy v-else-if="CLOUDY_CODES.includes(props.weatherCode)" :size="16" />
  <LucideWind v-else-if="WIND_CODES.includes(props.weatherCode)" :size="16" />
  <LucideCloudRain v-else-if="RAIN_CODES.includes(props.weatherCode)" :size="16" />
  <LucideSnowflake v-else-if="SNOW_CODES.includes(props.weatherCode)" :size="16" />
</template>

<script lang="ts" setup>
import { SUN_CODES, CLOUDY_CODES, WIND_CODES, RAIN_CODES, SNOW_CODES } from '~/constants/global.constants'
const props = defineProps<{
  weatherCode: number | undefined
}>()
</script>
