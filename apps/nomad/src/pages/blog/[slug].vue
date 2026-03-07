<template>
  <div class="min-h-screen bg-[#060E1B]">
    <!-- Loading -->
    <template v-if="!data || status !== 'success'">
      <section class="pt-24 pb-16 px-6">
        <div class="max-w-screen-md mx-auto flex flex-col gap-4">
          <div class="h-3 skeleton w-32" />
          <div class="h-10 skeleton w-3/4" />
          <div class="h-4 skeleton w-1/3" />
        </div>
      </section>
      <div class="bg-gray-50 rounded-t-[2rem] -mt-2 relative z-10">
        <div class="max-w-screen-md mx-auto px-6 py-12 flex flex-col gap-4">
          <div class="h-4 skeleton w-full" />
          <div class="h-4 skeleton w-full" />
          <div class="h-4 skeleton w-2/3" />
          <div class="h-64 skeleton w-full mt-4 rounded-xl" />
          <div class="h-4 skeleton w-full mt-4" />
          <div class="h-4 skeleton w-full" />
          <div class="h-4 skeleton w-1/2" />
        </div>
      </div>
    </template>

    <!-- Article -->
    <template v-else>
      <!-- Header zone -->
      <section class="relative pt-24 pb-16 px-6 overflow-hidden">
        <div class="absolute inset-0 opacity-40" style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='1' fill='rgba(255,255,255,0.025)'/%3E%3C/svg%3E&quot;);" />
        <div class="absolute -top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary-500/[0.06] blur-[100px]" />

        <div class="relative max-w-screen-md mx-auto">
          <!-- Breadcrumb -->
          <div class="flex items-center gap-3 mb-6">
            <NuxtLink :to="localePath('index')" class="text-sm text-white/40 hover:text-white/70 transition-colors">
              {{ $t('nav.exploreCities') }}
            </NuxtLink>
            <span class="text-white/20">/</span>
            <NuxtLink :to="localePath({ name: 'blog' })" class="text-sm text-white/40 hover:text-white/70 transition-colors">
              {{ $t('blog.title') }}
            </NuxtLink>
            <span class="text-white/20">/</span>
            <span class="text-sm text-primary-400 truncate max-w-[200px]">{{ data.title }}</span>
          </div>

          <!-- Title -->
          <h1 class="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight">
            {{ data.title }}
          </h1>

          <!-- Meta -->
          <div class="flex flex-wrap items-center gap-4 mt-4 text-sm text-white/40">
            <time v-if="data.publishedAt" :datetime="data.publishedAt" class="flex items-center gap-1.5">
              <LucideCalendar :size="14" class="text-white/30" />
              {{ formatDate(data.publishedAt) }}
            </time>
            <span class="flex items-center gap-1.5">
              <LucideClock :size="14" class="text-white/30" />
              {{ $t('blog.minRead', { min: data.readingTimeMinutes }) }}
            </span>
          </div>

          <!-- City tags -->
          <div v-if="data.cities?.length" class="flex flex-wrap gap-2 mt-5">
            <NuxtLink
              v-for="mapping in data.cities"
              :key="mapping.city.slug"
              :to="localePath({ name: 'cities-slug', params: { slug: mapping.city.slug } })"
              class="inline-flex items-center gap-1.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] rounded-full px-3.5 py-1.5 text-xs font-medium text-white/70 hover:text-white transition-colors"
            >
              <LucideMapPin :size="12" class="text-primary-400" />
              {{ mapping.city.name }}, {{ mapping.city.country }}
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Content zone -->
      <div class="bg-gray-50 rounded-t-[2rem] -mt-2 relative z-10">
        <article class="max-w-screen-md mx-auto px-6 py-12">
          <!-- Hero image -->
          <div v-if="data.featuredImageUrl" class="relative -mt-20 mb-10 rounded-2xl overflow-hidden shadow-xl aspect-[2/1] group/img">
            <img
              :src="data.featuredImageUrl"
              :alt="data.title"
              class="w-full h-full object-cover"
            />
            <UnsplashCredit v-if="data.featuredImageOwnerName" :owner-name="data.featuredImageOwnerName" :owner-username="data.featuredImageOwnerUsername" />
          </div>

          <!-- Article content -->
          <div class="article-content" v-html="data.content" />

          <!-- FAQ -->
          <div v-if="data.faqs?.length" class="mt-12 pt-10 border-t border-gray-200">
            <ArticleFaq :faqs="data.faqs" />
          </div>

          <!-- Back to blog -->
          <div class="mt-12 pt-8 border-t border-gray-200">
            <NuxtLink
              :to="localePath({ name: 'blog' })"
              class="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
            >
              <LucideArrowLeft :size="14" />
              {{ $t('blog.backToBlog') }}
            </NuxtLink>
          </div>
        </article>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/blog/[slug]',
    pl: '/blog/[slug]',
  },
})

const { locale, t } = useCustomI18n()
const localePath = useLocalePath()

const route = useRoute()

const queryParams = ref({ slug: route.params.slug as string })

watch(
  () => route.params.slug as string,
  (slug) => {
    if (slug) queryParams.value.slug = slug
  },
)

const { data, status } = await useArticleBySlug(queryParams, { lazy: true })

useHead(() => {
  if (!data.value) return {}
  const title = data.value.metaTitle || data.value.title
  const description = data.value.metaDesc || data.value.excerpt

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'article' },
      ...(data.value.featuredImageUrl ? [{ property: 'og:image', content: data.value.featuredImageUrl }] : []),
      { name: 'twitter:card', content: 'summary_large_image' },
      ...(data.value.publishedAt ? [{ property: 'article:published_time', content: data.value.publishedAt }] : []),
      ...(data.value.updatedAt ? [{ property: 'article:modified_time', content: data.value.updatedAt }] : []),
    ],
  }
})

useSchemaOrg(() => {
  if (!data.value) return []

  const schemas: any[] = [
    defineArticle({
      headline: data.value.title,
      description: data.value.metaDesc || data.value.excerpt,
      image: data.value.featuredImageUrl || undefined,
      datePublished: data.value.publishedAt || undefined,
      dateModified: data.value.updatedAt || undefined,
    }),
    defineBreadcrumb({
      itemListElement: [
        { name: 'Home', item: '/' },
        { name: t('blog.title'), item: '/blog' },
        { name: data.value.title },
      ],
    }),
  ]

  if (data.value.faqs?.length) {
    schemas.push(
      {
        '@type': 'FAQPage',
        'mainEntity': (data.value.faqs as { question: string; answer: string }[]).map(faq => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer,
          },
        })),
      },
    )
  }

  return schemas
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString(getLocaleBcp47(locale.value), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
.article-content :deep(h1) { font-size: 1.875rem; font-weight: 700; margin-top: 2.5rem; margin-bottom: 0.75rem; color: #111827; letter-spacing: -0.01em; }
.article-content :deep(h2) { font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.75rem; color: #111827; letter-spacing: -0.01em; }
.article-content :deep(h3) { font-size: 1.25rem; font-weight: 600; margin-top: 1.75rem; margin-bottom: 0.5rem; color: #111827; }
.article-content :deep(p) { margin-bottom: 1.25rem; line-height: 1.8; color: #374151; font-size: 1.0625rem; }
.article-content :deep(ul),
.article-content :deep(ol) { margin-bottom: 1.25rem; padding-left: 1.5rem; color: #374151; }
.article-content :deep(li) { margin-bottom: 0.375rem; line-height: 1.8; font-size: 1.0625rem; }
.article-content :deep(ul) { list-style-type: disc; }
.article-content :deep(ol) { list-style-type: decimal; }
.article-content :deep(a) { color: #2A9D8F; text-decoration: underline; text-underline-offset: 2px; }
.article-content :deep(a:hover) { color: #1E7D72; }
.article-content :deep(blockquote) { border-left: 3px solid #2A9D8F; padding-left: 1.25rem; margin: 1.5rem 0; color: #6b7280; font-style: italic; background: #f9fafb; padding: 1rem 1.25rem; border-radius: 0 0.5rem 0.5rem 0; }
.article-content :deep(img) { max-width: 100%; height: auto; border-radius: 0.75rem; margin: 1.5rem 0; }
.article-content :deep(pre) { background: #0f172a; color: #e2e8f0; padding: 1.25rem; border-radius: 0.75rem; overflow-x: auto; margin-bottom: 1.25rem; font-size: 0.875rem; border: 1px solid #1e293b; }
.article-content :deep(code) { background: #f1f5f9; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.875rem; color: #0f172a; }
.article-content :deep(pre code) { background: transparent; padding: 0; color: inherit; }
.article-content :deep(hr) { border: none; border-top: 1px solid #e5e7eb; margin: 2.5rem 0; }
.article-content :deep(table) { width: 100%; border-collapse: collapse; margin-bottom: 1.25rem; border-radius: 0.5rem; overflow: hidden; }
.article-content :deep(th),
.article-content :deep(td) { border: 1px solid #e5e7eb; padding: 0.625rem 0.875rem; text-align: left; font-size: 0.9375rem; }
.article-content :deep(th) { background: #f8fafc; font-weight: 600; color: #111827; }
</style>
