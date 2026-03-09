<template>
  <div class="min-h-screen">
    <!-- Hero -->
    <section class="relative pt-24 pb-16 px-6 overflow-hidden">
      <div class="absolute inset-0 opacity-40" style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='1' fill='rgba(255,255,255,0.025)'/%3E%3C/svg%3E&quot;);" />
      <div class="absolute -top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary-500/[0.06] blur-[100px]" />

      <div class="relative max-w-screen-xl mx-auto">
        <div class="flex items-center gap-3 mb-4">
          <NuxtLink :to="localePath('index')" class="text-sm text-white/40 hover:text-white/70 transition-colors">
            {{ $t('nav.exploreCities') }}
          </NuxtLink>
          <span class="text-white/20">/</span>
          <span class="text-sm text-primary-400">{{ $t('blog.title') }}</span>
        </div>

        <h1 class="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          {{ $t('blog.title') }}
        </h1>
        <p class="mt-3 text-lg text-white/40 max-w-xl">
          {{ $t('blog.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Content -->
    <section class="relative z-10 min-h-[60vh]">
      <div class="max-w-screen-xl mx-auto px-6 py-12">
        <!-- Skeleton -->
        <template v-if="status === 'pending'">
          <!-- Featured skeleton — matches aspect-[4/3] / md:min-h-[320px] + p-6 sm:p-8 layout -->
          <div class="mb-10 rounded-2xl overflow-hidden bg-white/[0.04] border border-white/[0.07]">
            <div class="grid md:grid-cols-2">
              <div class="aspect-[4/3] md:aspect-auto md:min-h-[320px] skeleton rounded-none" />
              <div class="p-6 sm:p-8 flex flex-col justify-center">
                <!-- Badge: dot + "LATEST POST" label -->
                <div class="flex items-center gap-1.5 mb-3">
                  <div class="size-1.5 rounded-full skeleton flex-shrink-0" />
                  <div class="h-3 skeleton w-20" />
                </div>
                <!-- Title: line-clamp-3 at text-xl/2xl -->
                <div class="h-6 skeleton w-[85%] mb-1.5" />
                <div class="h-6 skeleton w-[65%] mb-1.5" />
                <div class="h-6 skeleton w-[45%]" />
                <!-- Excerpt: line-clamp-3 at text-sm -->
                <div class="mt-3 h-4 skeleton w-full mb-1.5" />
                <div class="h-4 skeleton w-[90%] mb-1.5" />
                <div class="h-4 skeleton w-[70%]" />
                <!-- Meta: date + read time -->
                <div class="flex items-center gap-4 mt-6">
                  <div class="h-3 skeleton w-28" />
                  <div class="h-3 skeleton w-16" />
                </div>
              </div>
            </div>
          </div>

          <!-- Grid skeleton — matches grid-cols-1 md:grid-cols-2 lg:grid-cols-3, aspect-[3/2], p-5 -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 9" :key="i" class="rounded-2xl overflow-hidden bg-white/[0.04] border border-white/[0.07] flex flex-col">
              <div class="aspect-[3/2] skeleton rounded-none" />
              <div class="p-5 flex flex-col flex-1">
                <!-- Title: line-clamp-2 at text-base -->
                <div class="h-5 skeleton w-full mb-1.5" />
                <div class="h-5 skeleton w-3/4" />
                <!-- Excerpt: line-clamp-2 at text-sm -->
                <div class="mt-2 h-4 skeleton w-full mb-1.5" />
                <div class="h-4 skeleton w-4/5" />
                <!-- Footer: border-t with date + read time -->
                <div class="flex items-center justify-between pt-4 mt-auto border-t border-white/[0.07]" style="margin-top: 1rem;">
                  <div class="h-3 skeleton w-24" />
                  <div class="h-3 skeleton w-14" />
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Articles -->
        <template v-else-if="articles?.data?.length">
          <!-- Featured (first article) -->
          <NuxtLink
            v-if="featured"
            :to="localePath({ name: 'blog-slug', params: { slug: featured.slug } })"
            class="block mb-10 rounded-2xl overflow-hidden bg-white/[0.04] border border-white/[0.07] group hover:border-white/[0.14] transition-colors duration-300"
          >
            <div class="grid md:grid-cols-2">
              <div class="relative aspect-[4/3] md:aspect-auto md:min-h-[320px] overflow-hidden bg-white/[0.04]">
                <img
                  v-if="featured.featuredImageUrl"
                  :src="featured.featuredImageUrl"
                  :alt="featured.title"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <LucideFileText :size="48" class="text-white/20" />
                </div>
                <UnsplashCredit v-if="featured.featuredImageOwnerName" :owner-name="featured.featuredImageOwnerName" :owner-username="featured.featuredImageOwnerUsername" />
              </div>
              <div class="p-6 sm:p-8 flex flex-col justify-center">
                <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-400 uppercase tracking-wider mb-3">
                  <span class="size-1.5 rounded-full bg-primary-400" />
                  {{ $t('blog.latestPost') }}
                </span>
                <h2 class="text-xl sm:text-2xl font-bold text-white leading-snug group-hover:text-primary-400 transition-colors line-clamp-3">
                  {{ featured.title }}
                </h2>
                <p class="mt-3 text-sm text-white/50 leading-relaxed line-clamp-3">
                  {{ featured.excerpt }}
                </p>
                <div class="flex items-center gap-4 mt-6 text-xs text-white/30">
                  <time v-if="featured.publishedAt" :datetime="featured.publishedAt" class="flex items-center gap-1">
                    <LucideCalendar :size="12" />
                    {{ formatDate(featured.publishedAt) }}
                  </time>
                  <span class="flex items-center gap-1">
                    <LucideClock :size="12" />
                    {{ $t('blog.minRead', { min: featured.readingTimeMinutes }) }}
                  </span>
                </div>
              </div>
            </div>
          </NuxtLink>

          <!-- Grid -->
          <div v-if="remaining.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NuxtLink
              v-for="article in remaining"
              :key="article.slug"
              :to="localePath({ name: 'blog-slug', params: { slug: article.slug } })"
              class="rounded-2xl overflow-hidden bg-white/[0.04] border border-white/[0.07] flex flex-col group hover:border-white/[0.14] transition-colors duration-300"
            >
              <div class="relative aspect-[3/2] overflow-hidden bg-white/[0.04]">
                <img
                  v-if="article.featuredImageUrl"
                  :src="article.featuredImageUrl"
                  :alt="article.title"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <LucideFileText :size="32" class="text-white/20" />
                </div>
                <UnsplashCredit v-if="article.featuredImageOwnerName" :owner-name="article.featuredImageOwnerName" :owner-username="article.featuredImageOwnerUsername" />
              </div>
              <div class="p-5 flex flex-col flex-1">
                <h3 class="text-base font-semibold text-white leading-snug line-clamp-2 group-hover:text-primary-400 transition-colors">
                  {{ article.title }}
                </h3>
                <p class="mt-2 text-sm text-white/50 leading-relaxed line-clamp-2 flex-1">
                  {{ article.excerpt }}
                </p>
                <div class="flex items-center justify-between text-xs text-white/30 pt-4 mt-3 border-t border-white/[0.07]">
                  <time v-if="article.publishedAt" :datetime="article.publishedAt">
                    {{ formatDate(article.publishedAt) }}
                  </time>
                  <span>{{ $t('blog.minRead', { min: article.readingTimeMinutes }) }}</span>
                </div>
              </div>
            </NuxtLink>
          </div>

          <Pagination v-if="(articles.pagesCount ?? 0) > 1" :pages-count="articles.pagesCount ?? 0" class="mt-10" />
        </template>

        <!-- Empty -->
        <div v-else class="text-center py-24">
          <div class="size-20 rounded-2xl bg-white/[0.06] flex items-center justify-center mx-auto mb-5">
            <LucideFileText :size="32" class="text-white/30" />
          </div>
          <p class="text-white/50 text-lg">{{ $t('blog.noArticles') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { GetArticlesSchema } from '~/shared/global.schema';
defineI18nRoute({
  paths: {
    en: '/blog',
    pl: '/blog',
  },
})

const { locale, t } = useCustomI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => t('blog.title'),
  description: () => t('blog.subtitle'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: '/' },
      { name: () => t('blog.title') },
    ],
  }),
])

const route = useRoute()

const queryParams = computed(() => ({
  page: route.query.page as string | undefined,
})) as Ref<Partial<GetArticlesSchema>>

const { data: articles, status } = await useArticles(queryParams)

const featured = computed(() => articles.value?.data?.[0] ?? null)
const remaining = computed(() => articles.value?.data?.slice(1) ?? [])

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString(getLocaleBcp47(locale.value), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
