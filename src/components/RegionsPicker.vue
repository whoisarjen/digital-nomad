<template>
  <div class="block text-sm font-medium text-gray-700">Regions</div>
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
      {{ region.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import concat from 'lodash/concat'
import compact from 'lodash/compact'
import { OPTIONS_REGIONS } from '~/shared/global.utils';

const route = useRoute();
const router = useRouter();

const selectedOptions = ref<string[]>(compact(concat(route.query.regions as string | string[] | undefined)));

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
