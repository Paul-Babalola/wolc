<script setup lang="ts">
const route = useRoute()
const videoId = computed(() => String(route.params.id || ''))

const {data: videos} = await useAsyncData(
  `sermon-video-${videoId.value}`,
  () => $fetch('/api/youtube/videos', {query: {limit: 10}}),
)

const video = computed(() => videos.value?.find((item) => item.id === videoId.value))

if (!videoId.value) {
  throw createError({statusCode: 404, statusMessage: 'Video not found', fatal: true})
}

const embedUrl = computed(() => `https://www.youtube.com/embed/${videoId.value}`)

useSeoMeta({
  title: () => video.value?.title || 'Sermon',
  description: 'Watch this message from RCCG Word of Life Center.',
})
</script>

<template>
  <div>
    <PageHeader
      :title="video?.title || 'Sermon'"
      eyebrow="Message"
      :lead="video?.publishedAt ? new Date(video.publishedAt).toLocaleDateString(undefined, {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}) : undefined"
    />

    <section class="block block-tight">
      <div class="wrap">
        <NuxtLink to="/sermons" class="back-link">← All sermons</NuxtLink>

        <div class="video-wrap reveal">
          <iframe
            :src="embedUrl"
            :title="video?.title || 'Sermon video'"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
          />
        </div>

        <div v-if="video" class="video-actions reveal">
          <a
            :href="video.url"
            class="btn btn-ghost-dark"
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch on YouTube →
          </a>
        </div>
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
  margin-bottom: 24px;
  background: var(--ink);
}
.video-wrap iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
.video-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
