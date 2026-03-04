<template>
  <button
    v-if="selectedOption === DEFAULT_SORT_VALUE"
    class="px-4 py-2.5 flex items-center justify-center rounded-lg border bg-white border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
    @click="() => updateQuery('asc')"
  >
    <LucideArrowDownWideNarrow :size="16" />
  </button>
  <button
    v-else
    class="px-4 py-2.5 flex items-center justify-center rounded-lg border bg-primary-50 border-primary-300 text-primary-800 hover:bg-primary-100 cursor-pointer transition-colors"
    @click="() => updateQuery('desc')"
  >
    <LucideArrowUpNarrowWide :size="16" />
  </button>
</template>

<script lang="ts" setup>
import { DEFAULT_SORT_VALUE } from '~/shared/global.utils'

const route = useRoute()
const router = useRouter()

const selectedOption = ref<string | number>(route.query.sort as string | number | undefined ?? DEFAULT_SORT_VALUE)

function updateQuery(value: 'desc' | 'asc') {
    router.push({
        query: {
            ...route.query,
            sort: DEFAULT_SORT_VALUE === value ? undefined : value,
        }
    })
}

watch(() => route.query.sort, (newVal) => {
    selectedOption.value = newVal as string | number | undefined ?? DEFAULT_SORT_VALUE
}, {
    immediate: true,
})
</script>
