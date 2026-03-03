<template>
  <NuxtLink
    :to="localePath({ name: 'blog-slug', params: { slug: article.slug } })"
    class="bg-white rounded-xl overflow-hidden border border-gray-200 flex flex-col group transition-shadow hover:shadow-md"
  >
    <div class="relative aspect-[3/2] overflow-hidden bg-gray-100">
      <img
        v-if="article.featuredImageUrl"
        :src="article.featuredImageUrl"
        :alt="article.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <LucideFileText :size="32" class="text-gray-300" />
      </div>
    </div>

    <div class="p-4 flex flex-col flex-1 gap-2">
      <h3 class="text-base font-semibold text-gray-900 leading-snug line-clamp-2">
        {{ article.title }}
      </h3>
      <p class="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">
        {{ article.excerpt }}
      </p>
      <div class="flex items-center justify-between text-xs text-gray-400 pt-1">
        <span>{{ $t('blog.minRead', { min: article.readingTimeMinutes }) }}</span>
        <time v-if="article.publishedAt" :datetime="article.publishedAt">
          {{ formatDate(article.publishedAt) }}
        </time>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const { locale } = useCustomI18n()
const localePath = useLocalePath()

defineProps<{
  article: {
    slug: string
    title: string
    excerpt: string
    featuredImageUrl: string | null
    readingTimeMinutes: number
    publishedAt: string | null
  }
}>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString(getLocaleBcp47(locale.value), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>
