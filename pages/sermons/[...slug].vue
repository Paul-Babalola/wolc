<script setup lang="ts">
const route = useRoute()
const {data: sermon} = await useAsyncData(`sermon-${route.path}`, () =>
  queryCollection('sermons').path(route.path).first(),
)

if (!sermon.value) {
  throw createError({statusCode: 404, statusMessage: 'Sermon not found', fatal: true})
}

const embedUrl = computed(() => {
  const url = sermon.value?.videoUrl
  if (!url) return ''
  if (url.includes('embed/')) return url
  const match = url.match(/[?&]v=([^&]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : url
})

useSeoMeta({
  title: sermon.value?.title,
  description: sermon.value?.scripture,
})
</script>

<template>
  <div>
    <PageHeader
      :title="sermon?.title || 'Sermon'"
      eyebrow="Message"
      :lead="[sermon?.speaker, sermon?.scripture, sermon?.preachedAt].filter(Boolean).join(' · ')"
    />

    <section class="block block-tight">
      <div class="wrap">
        <NuxtLink to="/sermons" class="back-link">← All sermons</NuxtLink>

        <div v-if="sermon?.videoUrl" class="video-wrap reveal">
          <iframe
            :src="embedUrl"
            title="Sermon video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
          />
        </div>

        <article v-if="sermon" class="notes reveal">
          <ContentRenderer :value="sermon" />
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.video-wrap {
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--line);
  margin-bottom: 32px;
  background: var(--ink);
}
.video-wrap iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
.notes :deep(p) {
  color: var(--muted);
  margin-top: 18px;
  line-height: 1.65;
  font-size: 1.02rem;
}
.notes :deep(h2) {
  font-family: var(--display);
  margin-top: 36px;
  font-size: 1.35rem;
}
</style>
