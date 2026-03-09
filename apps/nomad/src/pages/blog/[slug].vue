<template>
  <div class="min-h-screen">
    <!-- Loading skeleton — 1:1 match of article layout -->
    <template v-if="!data || status !== 'success'">
      <!-- Header zone: pt-24 pb-16, max-w-screen-md -->
      <section class="pt-24 pb-16 px-6">
        <div class="max-w-screen-md mx-auto">
          <!-- Breadcrumb: Home / Blog / Title -->
          <div class="flex items-center gap-3 mb-6">
            <div class="h-3 skeleton w-20" />
            <div class="h-3 skeleton w-2" />
            <div class="h-3 skeleton w-12" />
            <div class="h-3 skeleton w-2" />
            <div class="h-3 skeleton w-32" />
          </div>
          <!-- Title: text-3xl sm:text-4xl, 2 lines -->
          <div class="h-10 skeleton w-[90%] mb-2" />
          <div class="h-10 skeleton w-[65%]" />
          <!-- Meta: date + read time -->
          <div class="flex items-center gap-4 mt-4">
            <div class="h-4 skeleton w-28" />
            <div class="h-4 skeleton w-20" />
          </div>
          <!-- City tags -->
          <div class="flex flex-wrap gap-2 mt-5">
            <div class="h-7 skeleton w-28 rounded-full" />
            <div class="h-7 skeleton w-24 rounded-full" />
            <div class="h-7 skeleton w-32 rounded-full" />
          </div>
        </div>
      </section>

      <!-- Content zone: max-w-screen-md px-6 py-12 -->
      <div class="relative z-10">
        <div class="max-w-screen-md mx-auto px-6 pb-12">
          <!-- Hero image: aspect-[2/1], -mt-20, rounded-2xl -->
          <div class="aspect-[2/1] skeleton rounded-2xl -mt-20 mb-10 shadow-xl" />

          <!-- Article body: paragraphs + heading + more paragraphs -->
          <div class="flex flex-col gap-3">
            <div class="h-4 skeleton w-full" />
            <div class="h-4 skeleton w-full" />
            <div class="h-4 skeleton w-[85%]" />
            <div class="h-4 skeleton w-full" />
            <div class="h-4 skeleton w-[70%]" />

            <div class="h-7 skeleton w-[55%] mt-5 mb-1" />

            <div class="h-4 skeleton w-full" />
            <div class="h-4 skeleton w-full" />
            <div class="h-4 skeleton w-[90%]" />
            <div class="h-4 skeleton w-full" />
            <div class="h-4 skeleton w-[60%]" />

            <div class="h-7 skeleton w-[45%] mt-5 mb-1" />

            <div class="h-4 skeleton w-full" />
            <div class="h-4 skeleton w-[95%]" />
            <div class="h-4 skeleton w-full" />
            <div class="h-4 skeleton w-[75%]" />
          </div>

          <!-- Connected cities: 3 × aspect-[16/7] rounded-2xl -->
          <div class="mt-12 pt-10 border-t border-white/[0.1]">
            <div class="h-3 skeleton w-32 mb-5" />
            <div class="flex flex-col gap-4">
              <div class="aspect-[16/7] skeleton rounded-2xl" />
              <div class="aspect-[16/7] skeleton rounded-2xl" />
              <div class="aspect-[16/7] skeleton rounded-2xl" />
            </div>
          </div>

          <!-- Back link -->
          <div class="mt-12 pt-8 border-t border-white/[0.1]">
            <div class="h-4 skeleton w-28" />
          </div>
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
      <div class="relative z-10">
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
          <div v-if="validFaqs.length" class="mt-12 pt-10 border-t border-white/[0.1]">
            <ArticleFaq :faqs="validFaqs" />
          </div>

          <!-- Connected Cities -->
          <div v-if="data.cities?.length" class="mt-12 pt-10 border-t border-white/[0.1]">
            <p class="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">
              {{ $t('blog.exploreCities') }}
            </p>

            <div class="flex flex-col gap-4">
              <NuxtLink
                v-for="mapping in sortedCities.slice(0, 3)"
                :key="mapping.city.slug"
                :to="localePath({ name: 'cities-slug', params: { slug: mapping.city.slug } })"
                class="group relative block overflow-hidden rounded-2xl aspect-[16/7]"
              >
                <CustomNuxtImg
                  v-if="mapping.city.image"
                  :src="mapping.city.image.url"
                  :alt="mapping.city.name"
                  width="800"
                  height="350"
                  loading="lazy"
                  class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div v-else class="absolute inset-0 bg-white/[0.06]" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div class="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                  <div>
                    <p class="text-xs font-medium text-white/60 mb-1">{{ mapping.city.country }}</p>
                    <h3 class="text-2xl font-bold text-white">{{ mapping.city.name }}</h3>
                  </div>
                  <span class="flex items-center gap-1.5 text-xs font-semibold text-primary-300 bg-black/40 border border-primary-500/40 px-3 py-1.5 rounded-full backdrop-blur-sm group-hover:border-primary-400/60 transition-colors">
                    Explore <LucideArrowRight :size="11" />
                  </span>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Back to blog -->
          <div class="mt-12 pt-8 border-t border-white/[0.1]">
            <NuxtLink
              :to="localePath({ name: 'blog' })"
              class="inline-flex items-center gap-2 text-sm font-medium text-white/40 hover:text-primary-400 transition-colors"
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

const sortedCities = computed(() =>
  data.value?.cities
    ? [...data.value.cities].sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
    : [],
)

const validFaqs = computed(() =>
  (data.value?.faqs ?? []).filter(faq => faq.question && faq.answer),
)

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

  if (validFaqs.value.length) {
    schemas.push(
      {
        '@type': 'FAQPage',
        'mainEntity': (validFaqs.value as { question: string; answer: string }[]).map(faq => ({
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
.article-content :deep(h1) { font-size: 1.875rem; font-weight: 700; margin-top: 2.5rem; margin-bottom: 0.75rem; color: #f9fafb; letter-spacing: -0.01em; }
.article-content :deep(h2) { font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.75rem; color: #f9fafb; letter-spacing: -0.01em; }
.article-content :deep(h3) { font-size: 1.25rem; font-weight: 600; margin-top: 1.75rem; margin-bottom: 0.5rem; color: #f3f4f6; }
.article-content :deep(p) { margin-bottom: 1.25rem; line-height: 1.8; color: rgba(255,255,255,0.7); font-size: 1.0625rem; }
.article-content :deep(ul),
.article-content :deep(ol) { margin-bottom: 1.25rem; padding-left: 1.5rem; color: rgba(255,255,255,0.7); }
.article-content :deep(li) { margin-bottom: 0.375rem; line-height: 1.8; font-size: 1.0625rem; }
.article-content :deep(ul) { list-style-type: disc; }
.article-content :deep(ol) { list-style-type: decimal; }
.article-content :deep(a) { color: #2A9D8F; text-decoration: underline; text-underline-offset: 2px; }
.article-content :deep(a:hover) { color: #3BBDAF; }
.article-content :deep(blockquote) { border-left: 3px solid #2A9D8F; margin: 1.5rem 0; color: rgba(255,255,255,0.5); font-style: italic; background: rgba(255,255,255,0.04); padding: 1rem 1.25rem; border-radius: 0 0.5rem 0.5rem 0; }
.article-content :deep(img) { max-width: 100%; height: auto; border-radius: 0.75rem; margin: 1.5rem 0; }
.article-content :deep(pre) { background: rgba(0,0,0,0.4); color: #e2e8f0; padding: 1.25rem; border-radius: 0.75rem; overflow-x: auto; margin-bottom: 1.25rem; font-size: 0.875rem; border: 1px solid rgba(255,255,255,0.08); }
.article-content :deep(code) { background: rgba(255,255,255,0.08); padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.875rem; color: #e2e8f0; }
.article-content :deep(pre code) { background: transparent; padding: 0; color: inherit; }
.article-content :deep(hr) { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 2.5rem 0; }
.article-content :deep(table) { width: 100%; border-collapse: collapse; margin-bottom: 1.25rem; border-radius: 0.5rem; overflow: hidden; background-color: #060E1B !important; }
.article-content :deep(tr) { background-color: #060E1B !important; }
.article-content :deep(th),
.article-content :deep(td) { border: 1px solid rgba(255,255,255,0.1) !important; padding: 0.625rem 0.875rem; text-align: left; font-size: 0.9375rem; color: rgba(255,255,255,0.7) !important; background-color: #060E1B !important; }
.article-content :deep(th) { background-color: rgba(255,255,255,0.06) !important; font-weight: 600; color: #f9fafb !important; }
</style>
