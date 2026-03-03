<template>
  <div class="min-h-screen bg-[#060E1B]">
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
    <section class="bg-gray-50 rounded-t-[2rem] -mt-2 relative z-10 min-h-[60vh]">
      <div class="max-w-screen-xl mx-auto px-6 py-12">
        <!-- Skeleton -->
        <template v-if="status === 'pending'">
          <div class="mb-10 rounded-2xl overflow-hidden bg-white border border-gray-200">
            <div class="grid md:grid-cols-2">
              <div class="aspect-[4/3] md:aspect-auto md:min-h-[320px] skeleton rounded-none" />
              <div class="p-8 flex flex-col gap-4">
                <div class="h-3 skeleton w-20" />
                <div class="h-7 skeleton w-4/5" />
                <div class="h-4 skeleton w-full" />
                <div class="h-4 skeleton w-3/4" />
                <div class="mt-auto flex justify-between">
                  <div class="h-3 skeleton w-24" />
                  <div class="h-3 skeleton w-16" />
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 6" :key="i" class="rounded-2xl overflow-hidden bg-white border border-gray-200">
              <div class="aspect-[3/2] skeleton rounded-none" />
              <div class="p-5 flex flex-col gap-3">
                <div class="h-5 skeleton w-3/4" />
                <div class="h-4 skeleton w-full" />
                <div class="h-4 skeleton w-2/3" />
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
            class="block mb-10 rounded-2xl overflow-hidden bg-white border border-gray-200 group hover:shadow-xl transition-shadow duration-300"
          >
            <div class="grid md:grid-cols-2">
              <div class="relative aspect-[4/3] md:aspect-auto md:min-h-[320px] overflow-hidden bg-gray-100">
                <img
                  v-if="featured.featuredImageUrl"
                  :src="featured.featuredImageUrl"
                  :alt="featured.title"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <LucideFileText :size="48" class="text-gray-300" />
                </div>
                <UnsplashCredit v-if="featured.featuredImageOwnerName" :owner-name="featured.featuredImageOwnerName" :owner-username="featured.featuredImageOwnerUsername" />
              </div>
              <div class="p-6 sm:p-8 flex flex-col justify-center">
                <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 uppercase tracking-wider mb-3">
                  <span class="size-1.5 rounded-full bg-primary-500" />
                  {{ $t('blog.latestPost') }}
                </span>
                <h2 class="text-xl sm:text-2xl font-bold text-gray-900 leading-snug group-hover:text-primary-700 transition-colors line-clamp-3">
                  {{ featured.title }}
                </h2>
                <p class="mt-3 text-sm text-gray-500 leading-relaxed line-clamp-3">
                  {{ featured.excerpt }}
                </p>
                <div class="flex items-center gap-4 mt-6 text-xs text-gray-400">
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
              class="rounded-2xl overflow-hidden bg-white border border-gray-200 flex flex-col group hover:shadow-lg transition-shadow duration-300"
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
                <UnsplashCredit v-if="article.featuredImageOwnerName" :owner-name="article.featuredImageOwnerName" :owner-username="article.featuredImageOwnerUsername" />
              </div>
              <div class="p-5 flex flex-col flex-1">
                <h3 class="text-base font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors">
                  {{ article.title }}
                </h3>
                <p class="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">
                  {{ article.excerpt }}
                </p>
                <div class="flex items-center justify-between text-xs text-gray-400 pt-4 mt-3 border-t border-gray-100">
                  <time v-if="article.publishedAt" :datetime="article.publishedAt">
                    {{ formatDate(article.publishedAt) }}
                  </time>
                  <span>{{ $t('blog.minRead', { min: article.readingTimeMinutes }) }}</span>
                </div>
              </div>
            </NuxtLink>
          </div>

          <div v-if="(articles.pagesCount ?? 0) > 1" class="flex justify-center mt-10">
            <Pagination :pages-count="articles.pagesCount ?? 0" />
          </div>
        </template>

        <!-- Empty -->
        <div v-else class="text-center py-24">
          <div class="size-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
            <LucideFileText :size="32" class="text-gray-400" />
          </div>
          <p class="text-gray-500 text-lg">{{ $t('blog.noArticles') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { GetArticlesSchema } from '~/shared/global.schema';
import { LOCALES } from '~/constants/global.constant'

defineI18nRoute({
  paths: {
    en: '/blog',
    pl: '/blog',
  },
})

const { locale, t } = useCustomI18n()
const localePath = useLocalePath()
const BASE_URL = 'https://nomad.whoisarjen.com'

useHead(() => {
  const enUrl = `${BASE_URL}/blog`
  const currentUrl = locale.value === 'en' ? enUrl : `${BASE_URL}/${locale.value}/blog`

  const hreflangLinks: { rel: string; hreflang: string; href: string }[] = LOCALES.map(l => ({
    rel: 'alternate',
    hreflang: l.code as string,
    href: l.code === 'en' ? `${BASE_URL}/blog` : `${BASE_URL}/${l.code}/blog`,
  }))
  hreflangLinks.push({ rel: 'alternate', hreflang: 'x-default', href: enUrl })

  return {
    title: `${t('blog.title')} - Digital Nomad`,
    meta: [
      { name: 'description', content: t('blog.subtitle') },
      { property: 'og:title', content: `${t('blog.title')} - Digital Nomad` },
      { property: 'og:description', content: t('blog.subtitle') },
      { property: 'og:url', content: currentUrl },
    ],
    link: [
      { rel: 'canonical', href: currentUrl },
      ...hreflangLinks,
    ],
  }
})

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
