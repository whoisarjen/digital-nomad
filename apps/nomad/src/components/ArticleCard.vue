<template>
  <NuxtLink
    :to="localePath({ name: 'blog-slug', params: { slug: article.slug } })"
    class="bg-white/[0.04] rounded-xl overflow-hidden border border-white/[0.1] flex flex-col group transition-all hover:border-white/[0.15]"
  >
    <div class="relative aspect-[3/2] overflow-hidden bg-white/[0.06]">
      <img
        v-if="article.featuredImageUrl"
        :src="article.featuredImageUrl"
        :alt="article.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <LucideFileText :size="32" class="text-white/30" />
      </div>
    </div>

    <div class="p-4 flex flex-col flex-1 gap-2">
      <h3 class="text-base font-semibold text-white leading-snug line-clamp-2">
        {{ article.title }}
      </h3>
      <p class="text-sm text-white/50 leading-relaxed line-clamp-2 flex-1">
        {{ article.excerpt }}
      </p>
      <div class="flex items-center justify-between text-xs text-white/40 pt-1">
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
