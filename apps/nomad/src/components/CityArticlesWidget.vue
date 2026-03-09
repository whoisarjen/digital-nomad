<template>
  <section v-if="data?.data?.length" class="mt-10">
    <!-- Section header — dark, editorial label treatment -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-1 h-6 rounded-full bg-primary-400" />
        <span class="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">{{ $t('blog.relatedArticles') }}</span>
      </div>
      <div class="h-px flex-1 mx-4 bg-white/[0.06]" />
      <div class="size-7 rounded-lg bg-primary-500/10 flex items-center justify-center">
        <LucideBookOpen :size="14" class="text-primary-400" />
      </div>
    </div>

    <!-- 3+ articles: asymmetric magazine layout -->
    <div v-if="data.data.length >= 3" class="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <!-- Featured article — large, image-forward -->
      <NuxtLink
        :to="localePath({ name: 'blog-slug', params: { slug: data.data[0]?.slug } })"
        class="lg:col-span-3 group flex flex-col bg-white/[0.04] rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_56px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-all duration-300"
      >
        <!-- Image with overlaid title -->
        <div class="relative aspect-[16/10] overflow-hidden bg-white/[0.06] flex-shrink-0">
          <img
            v-if="data.data[0]?.featuredImageUrl"
            :src="data.data[0]?.featuredImageUrl"
            :alt="data.data[0]?.title ?? undefined"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            loading="lazy"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-white/[0.04]">
            <LucideFileText :size="36" class="text-white/20" />
          </div>
          <!-- Gradient for text legibility -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <UnsplashCredit
            v-if="data.data[0]?.featuredImageOwnerName"
            :owner-name="data.data[0]?.featuredImageOwnerName"
            :owner-username="data.data[0]?.featuredImageOwnerUsername"
          />
        </div>
        <!-- Content -->
        <div class="p-5 flex flex-col gap-2 flex-1">
          <h3 class="text-lg font-bold text-white leading-snug line-clamp-2 group-hover:text-primary-400 transition-colors">
            {{ data.data[0]?.title }}
          </h3>
          <p class="text-sm text-white/40 leading-relaxed line-clamp-2 flex-1">
            {{ data.data[0]?.excerpt }}
          </p>
          <div class="flex items-center gap-3 text-[11px] text-white/30 pt-2 mt-auto border-t border-white/[0.05]">
            <span class="font-medium text-primary-500">{{ $t('blog.minRead', { min: data.data[0]?.readingTimeMinutes }) }}</span>
            <span class="text-white/20">·</span>
            <time v-if="data.data[0]?.publishedAt" :datetime="data.data[0]?.publishedAt">
              {{ formatDate(data.data[0]?.publishedAt!) }}
            </time>
          </div>
        </div>
      </NuxtLink>

      <!-- Side articles stacked -->
      <div class="lg:col-span-2 flex flex-col gap-4">
        <NuxtLink
          v-for="article in data.data.slice(1, 3)"
          :key="article.slug"
          :to="localePath({ name: 'blog-slug', params: { slug: article.slug } })"
          class="group flex gap-0 bg-white/[0.04] rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 transition-all duration-300 flex-1"
        >
          <!-- Thumbnail -->
          <div class="relative w-28 sm:w-32 flex-shrink-0 bg-white/[0.06]">
            <img
              v-if="article.featuredImageUrl"
              :src="article.featuredImageUrl"
              :alt="article.title ?? undefined"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              loading="lazy"
            />
            <div v-else class="absolute inset-0 flex items-center justify-center">
              <LucideFileText :size="20" class="text-white/20" />
            </div>
          </div>
          <!-- Content -->
          <div class="flex flex-col gap-1.5 p-4 min-w-0 flex-1">
            <h3 class="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-primary-400 transition-colors">
              {{ article.title }}
            </h3>
            <p class="text-xs text-white/40 leading-relaxed line-clamp-2 flex-1">
              {{ article.excerpt }}
            </p>
            <div class="flex items-center gap-2 text-[11px] text-white/30 mt-auto pt-2 border-t border-white/[0.05]">
              <span class="font-medium text-primary-500">{{ $t('blog.minRead', { min: article.readingTimeMinutes }) }}</span>
              <span class="text-white/20">·</span>
              <time v-if="article.publishedAt" :datetime="article.publishedAt">
                {{ formatDate(article.publishedAt) }}
              </time>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- 1–2 articles: equal grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <NuxtLink
        v-for="article in data.data"
        :key="article.slug"
        :to="localePath({ name: 'blog-slug', params: { slug: article.slug } })"
        class="group flex flex-col bg-white/[0.04] rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 transition-all duration-300"
      >
        <div class="relative aspect-[3/2] overflow-hidden bg-white/[0.06] flex-shrink-0">
          <img
            v-if="article.featuredImageUrl"
            :src="article.featuredImageUrl"
            :alt="article.title ?? undefined"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            loading="lazy"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <LucideFileText :size="32" class="text-white/20" />
          </div>
          <UnsplashCredit
            v-if="article.featuredImageOwnerName"
            :owner-name="article.featuredImageOwnerName"
            :owner-username="article.featuredImageOwnerUsername"
          />
        </div>
        <div class="p-4 flex flex-col gap-1.5 flex-1">
          <h3 class="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-primary-400 transition-colors">
            {{ article.title }}
          </h3>
          <p class="text-xs text-white/40 leading-relaxed line-clamp-2 flex-1">
            {{ article.excerpt }}
          </p>
          <div class="flex items-center gap-2 text-[11px] text-white/30 mt-auto pt-2 border-t border-white/[0.05]">
            <span class="font-medium text-primary-500">{{ $t('blog.minRead', { min: article.readingTimeMinutes }) }}</span>
            <span class="text-white/20">·</span>
            <time v-if="article.publishedAt" :datetime="article.publishedAt">
              {{ formatDate(article.publishedAt) }}
            </time>
          </div>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
const { locale } = useCustomI18n()
const localePath = useLocalePath()
const props = defineProps<{ citySlug: string }>()

const queryParams = ref({ citySlug: props.citySlug })

watch(
  () => props.citySlug,
  (slug) => {
    if (slug) queryParams.value.citySlug = slug
  },
)

const { data } = await useArticlesByCity(queryParams, { lazy: true })

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString(getLocaleBcp47(locale.value), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>
