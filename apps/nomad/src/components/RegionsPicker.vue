<template>
  <div class="block text-sm font-medium text-gray-700">{{ $t('filters.regions') }}</div>
  <div class="flex flex-wrap gap-1">
    <div
      v-for="region in OPTIONS_REGIONS"
      :key="region.value"
      @click="selectRegion(region.value)"
      class="custom-button flex-grow"
      :class="{
        'custom-button-active': selectedOptions.includes(region.value),
      }"
    >
      {{ $t(`regions.${region.value}`) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { OPTIONS_REGIONS } from '~/shared/global.utils';

const route = useRoute();
const router = useRouter();

const toStringArray = (val: string | string[] | undefined): string[] =>
  Array.isArray(val) ? val : val ? [val] : []

const selectedOptions = ref<string[]>(toStringArray(route.query.regions as string | string[] | undefined));

function selectRegion(value: string) {
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
      regions: newSelections,
    },
  });
}

watch(() => route.query.regions, (newVal) => {
  selectedOptions.value = Array.isArray(newVal)
    ? (newVal as string[])
    : newVal ? [newVal] : [];
}, {
  immediate: true,
});
</script>
