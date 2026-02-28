<template>
  <section v-if="data?.data?.length" class="bg-white rounded-xl shadow-sm p-6">
    <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
      <LucideBookOpen :size="20" class="text-primary-500" />
      {{ $t('blog.relatedArticles') }}
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <NuxtLink
        v-for="article in data.data"
        :key="article.slug"
        :to="localePath({ name: 'blog-slug', params: { slug: article.slug } })"
        class="group flex flex-col rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 transition-colors"
      >
        <div class="relative aspect-[3/2] overflow-hidden bg-gray-100">
          <img
            v-if="article.featuredImageUrl"
            :src="article.featuredImageUrl"
            :alt="localizedField(article, 'title')"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
        <div class="p-3 flex flex-col gap-1">
          <h3 class="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
            {{ localizedField(article, 'title') }}
          </h3>
          <span class="text-xs text-gray-400">
            {{ $t('blog.minRead', { min: article.readingTimeMinutes }) }}
          </span>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const localizedField = useLocalizedField()

const props = defineProps<{ citySlug: string }>()

const queryParams = ref({ citySlug: props.citySlug })

const { data } = await useArticlesByCity(queryParams, { lazy: true })
</script>
