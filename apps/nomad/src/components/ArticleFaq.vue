<template>
  <section v-if="faqs.length" class="bg-white rounded-xl shadow-sm p-6">
    <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
      <LucideMessageCircleQuestion :size="20" class="text-primary-500" />
      {{ $t('blog.faqTitle') }}
    </h2>
    <div class="flex flex-col divide-y divide-gray-100">
      <div
        v-for="(faq, index) in faqs"
        :key="index"
        class="py-3"
      >
        <button
          class="w-full flex items-center justify-between gap-3 text-left"
          @click="toggle(index)"
        >
          <span class="text-sm font-medium text-gray-900">
            {{ faq.question }}
          </span>
          <LucideChevronDown
            :size="16"
            class="text-gray-400 flex-shrink-0 transition-transform duration-200"
            :class="{ 'rotate-180': openIndexes.has(index) }"
          />
        </button>
        <div
          v-if="openIndexes.has(index)"
          class="mt-2 text-sm text-gray-600 leading-relaxed"
        >
          {{ faq.answer }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  faqs: Array<{ question: string | null; answer: string | null }>
}>()

const openIndexes = ref<Set<number>>(new Set())

const toggle = (index: number) => {
  const next = new Set(openIndexes.value)
  if (next.has(index)) {
    next.delete(index)
  } else {
    next.add(index)
  }
  openIndexes.value = next
}
</script>
