<script setup lang="ts">
const {data: page} = await useAsyncData('page-home', () =>
  queryCollection('pages').where('slug', '=', 'home').first(),
)

if (!page.value) {
  throw createError({statusCode: 404, statusMessage: 'Home page not found', fatal: true})
}

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description,
})
</script>

<template>
  <PageBuilder :sections="page?.sections" />
</template>
