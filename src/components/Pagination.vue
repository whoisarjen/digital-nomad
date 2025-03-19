<script lang="ts" setup>
const PAGINATION_DOTS = '...';

const route = useRoute();

const { pagesCount } = defineProps({
  pagesCount: {
    type: Number,
    required: true,
  }
});

const currentPage = computed(() => Number(route.query.page) || 1);
const visiblePages = computed(() => {
  const pages = [];
  const maxPages = 5;
  const range = Math.floor(maxPages / 2);

  const start = Math.max(1, currentPage.value - range);
  const end = Math.min(pagesCount, currentPage.value + range);

  if (start > 1) pages.push(1);
  if (start > 2) pages.push(PAGINATION_DOTS);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (end < pagesCount - 1) pages.push(PAGINATION_DOTS);
  if (end < pagesCount) pages.push(pagesCount);

  return pages;
});
</script>

<template>
  <section
    v-if="pagesCount > 1"
    class="flex items-center justify-center mt-5 gap-1"
  >
    <NuxtLink
      v-if="currentPage > 1"
      :to="{
        name: route.name,
        params: route.params,
        query: { ...route.query, page: currentPage - 1 },
      }"
      class="size-10 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors flex items-center justify-center"
    >
      <font-awesome-icon :icon="['fas', 'chevron-left']" />
    </NuxtLink>

    <NuxtLink
      v-for="page in visiblePages"
      :key="page"
      :to="
        page === PAGINATION_DOTS
          ? undefined
          : {
              name: route.name,
              params: route.params,
              query: { ...route.query, page },
            }
      "
      class="size-10 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors flex items-center justify-center"
      :class="{
        'text-blue-700 !border-slate-400':
          Number(route.query.page) === page ||
          (!route.query.page && page === 1),
        'cursor-pointer': page !== PAGINATION_DOTS,
        'hover:bg-gray-400': page !== PAGINATION_DOTS,
      }"
    >
      {{ page }}
    </NuxtLink>

    <NuxtLink
      v-if="currentPage < pagesCount"
      :to="{
        name: route.name,
        params: route.params,
        query: { ...route.query, page: currentPage + 1 },
      }"
      class="size-10 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors flex items-center justify-center"
    >
      <font-awesome-icon :icon="['fas', 'chevron-right']" />
    </NuxtLink>
  </section>
</template>
