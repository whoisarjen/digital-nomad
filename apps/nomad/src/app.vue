<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useSchemaOrg([
  defineWebSite({
    name: 'Digital Nomad',
    description: 'Compare 500+ cities by cost, weather, internet, safety & more. Find the perfect city for your digital nomad lifestyle.',
  }),
  defineWebPage(),
])
</script>
