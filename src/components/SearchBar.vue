<template>
  <div class="order-last sm:order-2 w-3/4 pb-0">
    <div
      class="bg-gray-100 rounded-lg h-12 p-2 flex ps-4 sm:ps-0 flex-row-reverse sm:flex-row items-center sm:pe-6 group"
    >
      <input
        v-model="q"
        class="w-full bg-gray-100 ps-4 text-black border-0 focus:outline-none"
        :placeholder="typedPlaceholder"
        @keyup.enter="handleSearch"
      >
      <LucideSearch class="text-gray-400 cursor-pointer group-hover:text-blue-500" @click="handleSearch" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SEARCH_BAR_MAXIMUM_Q_LENGTH } from '~/shared/global.utils';

const PLACEHOLDER_OPTIONS = ['Bangkok...', 'Shanghai...', 'Warsaw...', 'Thailand...', 'Japan...'];
const typedPlaceholder = ref('Search for a city...', );

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

let typingTimeout: NodeJS.Timeout | null = null;

const typeEffect = () => {
  let cityIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeNextChar = () => {
    const currentCity = PLACEHOLDER_OPTIONS[cityIndex];

    if (!isDeleting) {
      typedPlaceholder.value = `Search for ${currentCity.slice(0, charIndex++)}`;
      if (charIndex > currentCity.length) {
        isDeleting = true;
        typingTimeout = setTimeout(typeNextChar, 1000); // Pause before deleting
      } else {
        typingTimeout = setTimeout(typeNextChar, 150);
      }
    } else {
      typedPlaceholder.value = `Search for ${currentCity.slice(0, charIndex--)}`;
      if (charIndex === 0) {
        isDeleting = false;
        cityIndex = (cityIndex + 1) % PLACEHOLDER_OPTIONS.length;
        typingTimeout = setTimeout(typeNextChar, 500); // Pause before typing next city
      } else {
        typingTimeout = setTimeout(typeNextChar, 100);
      }
    }
  };

  typeNextChar();
};

onMounted(typeEffect);

onUnmounted(() => {
  if (typingTimeout) clearTimeout(typingTimeout);
});
</script>