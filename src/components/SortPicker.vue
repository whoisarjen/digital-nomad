<template>
  <div v-if="selectedOption === DEFAULT_SORT_VALUE" class="custom-button" @click="() => updateQuery('asc')">
    <LucideArrowDownWideNarrow :size="16" />
  </div>
  <div v-else class="custom-button" @click="() => updateQuery('desc')">
    <LucideArrowUpNarrowWide :size="16" />
  </div>
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
