<template>
  <div class="min-h-screen bg-gray-100 text-gray-900">
    <Hero :image="data?.image" />
    <section class="p-6 flex flex-col gap-6">
      <section class="flex max-md:flex-col gap-6 max-md:items-center">
        <aside class="rounded-2xl flex flex-col gap-3 w-full md:max-w-[268px]">
          <NuxtLink
            to="/"
            class="px-4 py-2 rounded-xl border transition-all duration-500 text-center text-sm text-white bg-red-600 hover:bg-red-700 cursor-pointer"
          >
            Main page
          </NuxtLink>
          <MonthsPicker />
        </aside>
        <CityPageMainContent :city="data" class="flex-1" />
      </section>
    </section>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()

const queryParams = ref({
  slug: route.params.slug as string,
})

watch(
  () => route.params.slug as string,
  (slug) => {
    if (slug) {
      queryParams.value.slug = slug
    }
  },
  { immediate: true }
)

const { data } = await useCitiesBySlug(queryParams)
</script>
