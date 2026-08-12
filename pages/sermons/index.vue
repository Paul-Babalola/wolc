<script setup lang="ts">
type YouTubeVideo = {
  id: string
  title: string
  publishedAt: string
  thumbnailUrl: string
  url: string
}

const {data: videos, error} = await useAsyncData('youtube-sermons', () =>
  $fetch<YouTubeVideo[]>('/api/youtube/videos', {query: {limit: 10}}),
)

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const glowColors = ['#2563eb', '#38bdf8', '#818cf8']

useSiteSeo({
  title: 'Sermons',
  description: 'Watch recent messages from RCCG Word of Life Center on YouTube.',
  image: () => videos.value?.[0]?.thumbnailUrl,
})
</script>

<template>
  <div>
    <PageHeader
      title="Sermons"
      eyebrow="Messages"
      lead="Teaching from Sunday worship and Bible study — watch online anytime."
    />

    <section class="block block-tight">
      <div class="wrap">
        <div v-if="videos?.length" class="card-grid">
          <ClientOnly>
            <BitsBorderGlow
              v-for="video in videos"
              :key="video.id"
              class-name="sermon-card-glow reveal"
              background-color="#ffffff"
              :border-radius="22"
              :colors="glowColors"
              glow-color="217 91 60"
            >
              <NuxtLink
                :to="`/sermons/watch/${video.id}`"
                class="surface-card sermon-card"
              >
                <div class="sermon-thumb">
                  <img
                    :src="video.thumbnailUrl"
                    :alt="video.title"
                    loading="lazy"
                    width="480"
                    height="360"
                  >
                  <span class="play" aria-hidden="true">▶</span>
                </div>
                <h3>{{ video.title }}</h3>
                <p class="sermon-meta">{{ formatDate(video.publishedAt) }}</p>
                <span class="card-go">Watch message →</span>
              </NuxtLink>
            </BitsBorderGlow>
            <template #fallback>
              <NuxtLink
                v-for="video in videos"
                :key="`${video.id}-fallback`"
                :to="`/sermons/watch/${video.id}`"
                class="surface-card sermon-card reveal"
              >
                <div class="sermon-thumb">
                  <img
                    :src="video.thumbnailUrl"
                    :alt="video.title"
                    loading="lazy"
                    width="480"
                    height="360"
                  >
                  <span class="play" aria-hidden="true">▶</span>
                </div>
                <h3>{{ video.title }}</h3>
                <p class="sermon-meta">{{ formatDate(video.publishedAt) }}</p>
                <span class="card-go">Watch message →</span>
              </NuxtLink>
            </template>
          </ClientOnly>
        </div>

        <div v-else class="empty-state reveal">
          <p v-if="error">We couldn't load videos right now. You can still watch on YouTube.</p>
          <p v-else>New messages will appear here after each upload.</p>
          <a href="https://www.youtube.com/@WolcNetwork" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
            Watch on YouTube →
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.sermon-card-glow {
  transition: transform 0.22s ease;
}

.sermon-card-glow:hover {
  transform: translateY(-4px);
}

.sermon-card-glow :deep(.border-glow-inner) {
  height: 100%;
}

.sermon-card {
  padding: 0;
  overflow: hidden;
  border: none;
  box-shadow: none;
  height: 100%;
}

.sermon-card:hover {
  transform: none;
  border-color: transparent;
  box-shadow: none;
}
.sermon-card h3,
.sermon-card .sermon-meta,
.sermon-card .card-go {
  padding-left: 24px;
  padding-right: 24px;
}
.sermon-card h3 {
  padding-top: 20px;
  font-size: 1.05rem;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.sermon-card .card-go { padding-bottom: 24px; display: block; }
.sermon-thumb {
  position: relative;
  aspect-ratio: 16 / 10;
  background: var(--ink);
  overflow: hidden;
}
.sermon-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.25s ease;
}
.sermon-card:hover .sermon-thumb img {
  transform: scale(1.03);
}
.play {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  color: var(--blue);
  display: grid;
  place-items: center;
  padding-left: 4px;
  font-size: 0.9rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}
.sermon-meta { color: var(--muted); font-size: 0.92rem; margin-top: 4px; }
</style>
