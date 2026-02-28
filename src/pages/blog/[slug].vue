<template>
  <div class="min-h-screen bg-gray-100 text-gray-900">
    <!-- Loading -->
    <template v-if="!data || status !== 'success'">
      <div class="h-[400px] bg-gray-200 animate-pulse" />
      <div class="max-w-screen-md mx-auto p-6 flex flex-col gap-4 animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-3/4" />
        <div class="h-4 bg-gray-100 rounded w-1/3" />
        <div class="h-4 bg-gray-100 rounded w-full mt-4" />
        <div class="h-4 bg-gray-100 rounded w-full" />
        <div class="h-4 bg-gray-100 rounded w-2/3" />
      </div>
    </template>

    <!-- Article -->
    <template v-else>
      <!-- Hero image -->
      <section v-if="data.featuredImageUrl" class="relative h-[400px] overflow-hidden bg-gray-200">
        <img
          :src="data.featuredImageUrl"
          :alt="localizedField(data, 'title')"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </section>

      <article class="max-w-screen-md mx-auto px-6 pb-12" :class="data.featuredImageUrl ? '-mt-20 relative z-10' : 'pt-20'">
        <!-- Back link -->
        <NuxtLink
          :to="localePath({ name: 'blog' })"
          class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
          :class="data.featuredImageUrl ? 'text-white/80 hover:text-white' : ''"
        >
          <LucideArrowLeft :size="14" />
          {{ $t('blog.backToBlog') }}
        </NuxtLink>

        <!-- Title card -->
        <div class="bg-white rounded-xl shadow-sm p-6 sm:p-8 border border-gray-200">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            {{ localizedField(data, 'title') }}
          </h1>

          <!-- Meta -->
          <div class="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
            <time v-if="data.publishedAt" :datetime="data.publishedAt" class="flex items-center gap-1">
              <LucideCalendar :size="14" />
              {{ formatDate(data.publishedAt) }}
            </time>
            <span class="flex items-center gap-1">
              <LucideClock :size="14" />
              {{ $t('blog.minRead', { min: data.readingTimeMinutes }) }}
            </span>
          </div>

          <!-- City tags -->
          <div v-if="data.cities?.length" class="flex flex-wrap gap-2 mt-4">
            <NuxtLink
              v-for="mapping in data.cities"
              :key="mapping.city.slug"
              :to="localePath({ name: 'cities-slug', params: { slug: mapping.city.slug } })"
              class="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 text-xs font-medium text-gray-600 transition-colors"
            >
              <LucideMapPin :size="12" />
              {{ mapping.city.name }}, {{ mapping.city.country }}
            </NuxtLink>
          </div>
        </div>

        <!-- Content -->
        <div
          class="bg-white rounded-xl shadow-sm p-6 sm:p-8 border border-gray-200 mt-6 article-content"
          v-html="localizedField(data, 'content')"
        />

        <!-- FAQ -->
        <div class="mt-6">
          <ArticleFaq v-if="data.faqs?.length" :faqs="data.faqs" />
        </div>
      </article>
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

const { locale } = useCustomI18n()
const localePath = useLocalePath()
const localizedField = useLocalizedField()

const route = useRoute()

const queryParams = ref({ slug: route.params.slug as string })

watch(
  () => route.params.slug as string,
  (slug) => {
    if (slug) queryParams.value.slug = slug
  },
)

const { data, status } = await useArticleBySlug(queryParams, { lazy: true })

const BASE_URL = 'https://nomad.whoisarjen.com'

useHead(() => {
  if (!data.value) return {}

  const title = localizedField(data.value, 'metaTitle') || localizedField(data.value, 'title')
  const description = localizedField(data.value, 'metaDesc') || localizedField(data.value, 'excerpt')
  const slug = data.value.slug
  const enUrl = `${BASE_URL}/blog/${slug}`
  const plUrl = `${BASE_URL}/pl/blog/${slug}`
  const currentUrl = locale.value === 'pl' ? plUrl : enUrl

  const jsonLd: any[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': localizedField(data.value, 'title'),
      'description': description,
      'image': data.value.featuredImageUrl || undefined,
      'datePublished': data.value.publishedAt,
      'dateModified': data.value.updatedAt,
      'url': currentUrl,
      'inLanguage': locale.value,
      'publisher': {
        '@type': 'Organization',
        'name': 'Digital Nomad',
        'url': BASE_URL,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE_URL },
        { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': `${BASE_URL}${locale.value === 'pl' ? '/pl' : ''}/blog` },
        { '@type': 'ListItem', 'position': 3, 'name': localizedField(data.value, 'title'), 'item': currentUrl },
      ],
    },
  ]

  if (data.value.faqs?.length) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': data.value.faqs.map(faq => ({
        '@type': 'Question',
        'name': localizedField(faq, 'question'),
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': localizedField(faq, 'answer'),
        },
      })),
    })
  }

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: currentUrl },
      { property: 'og:type', content: 'article' },
      ...(data.value.featuredImageUrl ? [{ property: 'og:image', content: data.value.featuredImageUrl }] : []),
    ],
    link: [
      { rel: 'canonical', href: currentUrl },
      { rel: 'alternate', hreflang: 'en', href: enUrl },
      { rel: 'alternate', hreflang: 'pl', href: plUrl },
      { rel: 'alternate', hreflang: 'x-default', href: enUrl },
    ],
    script: jsonLd.map(ld => ({
      type: 'application/ld+json',
      innerHTML: JSON.stringify(ld),
    })),
  }
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString(locale.value === 'pl' ? 'pl-PL' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
.article-content :deep(h1) { font-size: 1.75rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.75rem; color: #111827; }
.article-content :deep(h2) { font-size: 1.375rem; font-weight: 700; margin-top: 1.75rem; margin-bottom: 0.5rem; color: #111827; }
.article-content :deep(h3) { font-size: 1.125rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #111827; }
.article-content :deep(p) { margin-bottom: 1rem; line-height: 1.75; color: #374151; }
.article-content :deep(ul),
.article-content :deep(ol) { margin-bottom: 1rem; padding-left: 1.5rem; color: #374151; }
.article-content :deep(li) { margin-bottom: 0.25rem; line-height: 1.75; }
.article-content :deep(ul) { list-style-type: disc; }
.article-content :deep(ol) { list-style-type: decimal; }
.article-content :deep(a) { color: #2A9D8F; text-decoration: underline; }
.article-content :deep(a:hover) { color: #1E7D72; }
.article-content :deep(blockquote) { border-left: 3px solid #d1d5db; padding-left: 1rem; margin-bottom: 1rem; color: #6b7280; font-style: italic; }
.article-content :deep(img) { max-width: 100%; height: auto; border-radius: 0.75rem; margin: 1.5rem 0; }
.article-content :deep(pre) { background: #1f2937; color: #e5e7eb; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin-bottom: 1rem; font-size: 0.875rem; }
.article-content :deep(code) { background: #f3f4f6; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.875rem; }
.article-content :deep(pre code) { background: transparent; padding: 0; }
.article-content :deep(hr) { border: none; border-top: 1px solid #e5e7eb; margin: 2rem 0; }
.article-content :deep(table) { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
.article-content :deep(th),
.article-content :deep(td) { border: 1px solid #e5e7eb; padding: 0.5rem 0.75rem; text-align: left; }
.article-content :deep(th) { background: #f9fafb; font-weight: 600; }
</style>
