<template>
  <div class="order-last sm:order-2 w-3/4 pb-0">
    <div
      class="bg-gray-100 rounded-lg h-12 p-2 flex ps-4 sm:ps-0 flex-row-reverse sm:flex-row items-center sm:pe-6"
    >
      <input
        v-model="q"
        class="w-full bg-gray-100 ps-4 text-black border-0 focus:outline-none"
        placeholder="Search for a city..."
        @keyup.enter="handleSearch"
      >
      <LucideSearch class="text-gray-400 cursor-pointer" @click="handleSearch" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SEARCH_BAR_MAXIMUM_Q_LENGTH } from '~/shared/global.utils';

const route = useRoute();
const router = useRouter();

const q = ref(route.query.q as string | undefined ?? '');

const handleSearch = () => {
  router.push({
    query: {
      q: q.value.trim().substring(0, SEARCH_BAR_MAXIMUM_Q_LENGTH) || undefined,
    }
  });
};
</script>