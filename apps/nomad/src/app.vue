<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const i18nHead = useLocaleHead({ seo: true })

useHead({
  htmlAttrs: {
    lang: () => i18nHead.value.htmlAttrs?.lang,
    dir: () => getHtmlDir(i18nHead.value.htmlAttrs?.lang ?? 'en'),
  },
  link: () => i18nHead.value.link ?? [],
  meta: () => i18nHead.value.meta ?? [],
})

useSchemaOrg([
  defineWebSite({
    name: 'Digital Nomad',
    description: 'Compare 500+ cities by cost, weather, internet, safety & more. Find the perfect city for your digital nomad lifestyle.',
  }),
  defineWebPage(),
])
</script>
