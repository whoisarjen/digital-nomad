<template>
  <div class="min-h-screen bg-gray-100 text-gray-900">
    <!-- Header -->
    <section class="bg-[#060E1B] pt-20 pb-10 px-6">
      <div class="max-w-screen-xl mx-auto">
        <h1 class="text-3xl sm:text-4xl font-bold text-white">
          {{ $t('blog.title') }}
        </h1>
        <p class="mt-2 text-gray-400 text-base max-w-xl">
          {{ $t('blog.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Content -->
    <section class="max-w-screen-xl mx-auto p-6">
      <!-- Skeleton -->
      <template v-if="status === 'pending'">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="bg-white rounded-xl overflow-hidden border border-gray-200">
            <div class="aspect-[3/2] skeleton" />
            <div class="p-4 flex flex-col gap-3">
              <div class="h-5 skeleton w-3/4" />
              <div class="h-4 skeleton w-full" />
              <div class="h-4 skeleton w-2/3" />
              <div class="flex justify-between pt-1">
                <div class="h-3 skeleton w-16" />
                <div class="h-3 skeleton w-20" />
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Articles -->
      <template v-else-if="articles?.data?.length">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArticleCard
            v-for="article in articles.data"
            :key="article.slug"
            :article="article"
          />
        </div>
        <div class="flex justify-center mt-8">
          <Pagination :pages-count="articles.pagesCount ?? 0" />
        </div>
      </template>

      <!-- Empty state -->
      <div v-else class="text-center py-20">
        <LucideFileText :size="48" class="mx-auto text-gray-300 mb-4" />
        <p class="text-gray-500">{{ $t('blog.noArticles') }}</p>
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

useHead(() => {
  const enUrl = 'https://nomad.whoisarjen.com/blog'
  const plUrl = 'https://nomad.whoisarjen.com/pl/blog'
  const currentUrl = locale.value === 'pl' ? plUrl : enUrl

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
      { rel: 'alternate', hreflang: 'en', href: enUrl },
      { rel: 'alternate', hreflang: 'pl', href: plUrl },
      { rel: 'alternate', hreflang: 'x-default', href: enUrl },
    ],
  }
})

const route = useRoute()

const queryParams = computed(() => ({
  page: route.query.page as string | undefined,
})) as Ref<Partial<GetArticlesSchema>>

const { data: articles, status } = await useArticles(queryParams)
</script>
