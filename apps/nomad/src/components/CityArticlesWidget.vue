<template>
  <section v-if="data?.data?.length">
    <div class="flex items-center gap-2.5 mb-5">
      <div class="size-8 rounded-xl bg-primary-50 flex items-center justify-center">
        <LucideBookOpen :size="16" class="text-primary-600" />
      </div>
      <h2 class="text-base font-bold text-gray-900">{{ $t('blog.relatedArticles') }}</h2>
    </div>

    <!-- 3 articles: magazine layout -->
    <div v-if="data.data.length >= 3" class="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <!-- Featured article (large) -->
      <NuxtLink
        :to="localePath({ name: 'blog-slug', params: { slug: data.data[0].slug } })"
        class="lg:col-span-3 group flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-lg transition-shadow"
      >
        <div class="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            v-if="data.data[0].featuredImageUrl"
            :src="data.data[0].featuredImageUrl"
            :alt="data.data[0].title ?? undefined"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <LucideFileText :size="32" class="text-gray-300" />
          </div>
          <UnsplashCredit v-if="data.data[0].featuredImageOwnerName" :owner-name="data.data[0].featuredImageOwnerName" :owner-username="data.data[0].featuredImageOwnerUsername" />
        </div>
        <div class="p-5 flex flex-col gap-2 flex-1">
          <h3 class="text-lg font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors">
            {{ data.data[0].title }}
          </h3>
          <p class="text-sm text-gray-500 leading-relaxed line-clamp-2">
            {{ data.data[0].excerpt }}
          </p>
          <div class="flex items-center gap-3 text-xs text-gray-400 mt-auto pt-2">
            <span>{{ $t('blog.minRead', { min: data.data[0].readingTimeMinutes }) }}</span>
            <time v-if="data.data[0].publishedAt" :datetime="data.data[0].publishedAt">
              {{ formatDate(data.data[0].publishedAt) }}
            </time>
          </div>
        </div>
      </NuxtLink>

      <!-- Side articles (stacked) -->
      <div class="lg:col-span-2 flex flex-col gap-4">
        <NuxtLink
          v-for="article in data.data.slice(1, 3)"
          :key="article.slug"
          :to="localePath({ name: 'blog-slug', params: { slug: article.slug } })"
          class="group flex gap-4 rounded-2xl overflow-hidden bg-white border border-gray-100 p-3 hover:shadow-lg transition-shadow flex-1"
        >
          <div class="relative w-28 sm:w-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
            <img
              v-if="article.featuredImageUrl"
              :src="article.featuredImageUrl"
              :alt="article.title ?? undefined"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <LucideFileText :size="20" class="text-gray-300" />
            </div>
            <UnsplashCredit v-if="article.featuredImageOwnerName" :owner-name="article.featuredImageOwnerName" :owner-username="article.featuredImageOwnerUsername" />
          </div>
          <div class="flex flex-col gap-1.5 py-1 min-w-0 flex-1">
            <h3 class="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors">
              {{ article.title }}
            </h3>
            <p class="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
              {{ article.excerpt }}
            </p>
            <div class="flex items-center gap-3 text-[11px] text-gray-400">
              <span>{{ $t('blog.minRead', { min: article.readingTimeMinutes }) }}</span>
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
        class="group flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-lg transition-shadow"
      >
        <div class="relative aspect-[3/2] overflow-hidden bg-gray-100">
          <img
            v-if="article.featuredImageUrl"
            :src="article.featuredImageUrl"
            :alt="article.title ?? undefined"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <LucideFileText :size="32" class="text-gray-300" />
          </div>
          <UnsplashCredit v-if="article.featuredImageOwnerName" :owner-name="article.featuredImageOwnerName" :owner-username="article.featuredImageOwnerUsername" />
        </div>
        <div class="p-4 flex flex-col gap-1.5 flex-1">
          <h3 class="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors">
            {{ article.title }}
          </h3>
          <p class="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {{ article.excerpt }}
          </p>
          <div class="flex items-center gap-3 text-[11px] text-gray-400 mt-auto pt-1">
            <span>{{ $t('blog.minRead', { min: article.readingTimeMinutes }) }}</span>
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
