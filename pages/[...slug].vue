<script setup lang="ts">
const route = useRoute()
const slug = (Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug) || 'home'

const {data: page} = await useAsyncData(`page-${slug}`, () =>
  queryCollection('pages').where('slug', '=', slug).first(),
)

if (!page.value) {
  throw createError({statusCode: 404, statusMessage: 'Page not found', fatal: true})
}

const pageAccent = computed(() => (slug === 'give' ? 'green' : 'blue') as 'blue' | 'green')

useSiteSeo({
  title: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description,
})
</script>

<template>
  <div>
    <PageHeader
      v-if="page?.title && slug !== 'about'"
      :title="page.title"
      :lead="page.seo?.description"
      :accent="pageAccent"
    />
    <div v-else-if="page?.title" class="page-crumb-only">
      <div class="wrap">
        <nav class="page-crumb" aria-label="Breadcrumb">
          <NuxtLink to="/">Home</NuxtLink>
          <span aria-hidden="true">/</span>
          <span>{{ page.title }}</span>
        </nav>
      </div>
    </div>
    <PageBuilder :sections="page?.sections" />
  </div>
</template>

<style scoped>
.page-crumb-only {
  margin-top: var(--nav-offset);
  padding: 20px 0 0;
}
</style>
