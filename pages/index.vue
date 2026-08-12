<script setup lang="ts">
const {data: page} = await useAsyncData('page-home', () =>
  queryCollection('pages').where('slug', '=', 'home').first(),
)

if (!page.value) {
  throw createError({statusCode: 404, statusMessage: 'Home page not found', fatal: true})
}

useSiteSeo({
  title: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description,
  image: '/images/site/homepage-hero.jpeg',
})
</script>

<template>
  <PageBuilder :sections="page?.sections" />
</template>
