<template>
  <ClientOnly>
    <slot :user="data?.user" />
    <template #fallback>
      <slot name="fallback" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const { data } = useAuth()
</script>
