<template>
  <div class="order-last sm:order-2 w-full pb-0">
    <div
      class="bg-white rounded-lg px-4 py-2 flex items-center gap-2 group border border-gray-300"
    >
      <input
        v-model="q"
        class="w-full bg-white text-black border-0 focus:outline-none text-sm"
        :placeholder="typedPlaceholder"
      >
      <LucideX
        v-if="q"
        class="text-gray-400 hover:text-gray-600 cursor-pointer flex-shrink-0"
        @click="q = ''"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SEARCH_BAR_MAXIMUM_Q_LENGTH } from '~/shared/global.utils';

const { t } = useCustomI18n()
const PLACEHOLDER_OPTIONS = ['Bangkok...', 'Shanghai...', 'Warsaw...', 'Thailand...', 'Japan...'];
const typedPlaceholder = ref(`${t('search.placeholder')} Bangkok...`);

const route = useRoute();
const router = useRouter();

const q = ref(route.query.q as string | undefined ?? '');

const pushSearch = () => {
  const trimmed = q.value.trim().substring(0, SEARCH_BAR_MAXIMUM_Q_LENGTH) || undefined;
  if (trimmed === route.query.q) return;
  router.push({
    query: {
      ...route.query,
      page: undefined,
      q: trimmed,
    },
  });
};

let debounceTimer: NodeJS.Timeout | null = null;
watch(q, () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(pushSearch, 400);
});

watch(() => route.query.q, (val) => {
  q.value = (val as string) ?? '';
});

let typingTimeout: NodeJS.Timeout | null = null;

const typeEffect = () => {
  let cityIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeNextChar = () => {
    const currentCity = PLACEHOLDER_OPTIONS[cityIndex]!;

    if (!isDeleting) {
      typedPlaceholder.value = `${t('search.placeholder')} ${currentCity.slice(0, charIndex++)}`;
      if (charIndex > currentCity.length) {
        isDeleting = true;
        typingTimeout = setTimeout(typeNextChar, 1000);
      } else {
        typingTimeout = setTimeout(typeNextChar, 150);
      }
    } else {
      typedPlaceholder.value = `${t('search.placeholder')} ${currentCity.slice(0, charIndex--)}`;
      if (charIndex === 0) {
        isDeleting = false;
        cityIndex = (cityIndex + 1) % PLACEHOLDER_OPTIONS.length;
        typingTimeout = setTimeout(typeNextChar, 500);
      } else {
        typingTimeout = setTimeout(typeNextChar, 100);
      }
    }
  };

  typeNextChar();
};

onMounted(typeEffect);

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
  if (typingTimeout) clearTimeout(typingTimeout);
});
</script>