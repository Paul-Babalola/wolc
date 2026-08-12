<script setup lang="ts">
defineProps<{ data: any }>();

const { data: sermon } = await useAsyncData("featured-sermon", () =>
  queryCollection("sermons").order("preachedAt", "DESC").first(),
);

const { data: videos } = await useFetch("/api/youtube/videos", {
  key: "home-featured-video",
  query: { limit: 1 },
  default: () => [],
});

const featuredVideo = computed(() => videos.value?.[0]);
const watchHref = computed(() =>
  featuredVideo.value
    ? `/sermons/watch/${featuredVideo.value.id}`
    : sermon.value?.videoUrl || "/sermons",
);
</script>

<template>
  <section class="watch landing-section landing-section--muted">
    <div class="wrap">
      <div class="watch-grid">
        <NuxtLink
          :to="watchHref"
          class="watch-player reveal"
          :target="featuredVideo || sermon?.videoUrl ? undefined : undefined"
        >
          <NuxtImg
            v-if="featuredVideo?.thumbnailUrl"
            :src="featuredVideo.thumbnailUrl"
            :alt="featuredVideo.title"
            class="watch-player__thumb"
            width="960"
            height="540"
            loading="lazy"
            format="webp"
          />
          <div v-else class="watch-player__fallback" aria-hidden="true" />

          <div class="watch-player__overlay" aria-hidden="true" />
          <span class="watch-player__badge">Live</span>
          <span class="watch-player__play" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </NuxtLink>

        <div class="watch-copy reveal">
          <SectionsSectionHeader
            :eyebrow="data.eyebrow"
            :title="data.heading"
          />

          <p v-if="featuredVideo" class="watch-latest">
            Latest message: <strong>{{ featuredVideo.title }}</strong>
          </p>
          <p v-else-if="sermon" class="watch-latest">
            Latest: <strong>{{ sermon.title }}</strong
            ><span v-if="sermon.speaker"> · {{ sermon.speaker }}</span>
          </p>

          <p v-if="data.body" class="watch-body">{{ data.body }}</p>

          <ul class="watch-schedule">
            <li>
              <span>Sunday worship</span>
              <strong>10:00 AM</strong>
            </li>
            <li>
              <span>Bible study stream</span>
              <strong>Wed · 7:00 PM</strong>
            </li>
          </ul>

          <div class="watch-actions">
            <SectionCtaLink
              v-if="data.primaryCta?.href"
              :link="data.primaryCta"
              class="btn btn-primary"
              suffix=" →"
            />
            <SectionCtaLink
              v-if="data.secondaryCta?.href"
              :link="data.secondaryCta"
              class="btn btn-ghost-dark"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.watch-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: clamp(36px, 5vw, 64px);
  align-items: center;
}

.watch-player {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: calc(var(--radius-xl) + 2px);
  aspect-ratio: 16 / 10;
  background: var(--ink);
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.18);
}

.watch-player__thumb,
.watch-player__thumb :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.watch-player:hover .watch-player__thumb,
.watch-player:hover .watch-player__thumb :deep(img) {
  transform: scale(1.03);
}

.watch-player__fallback {
  width: 100%;
  height: 100%;
  background:
    radial-gradient(
      circle at 20% 20%,
      rgba(255, 255, 255, 0.12),
      transparent 40%
    ),
    linear-gradient(145deg, #0f172a 0%, var(--blue) 100%);
}

.watch-player__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(15, 23, 42, 0.08),
    rgba(15, 23, 42, 0.55)
  );
}

.watch-player__badge {
  position: absolute;
  top: 18px;
  left: 18px;
  z-index: 1;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--blue);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.watch-player__play {
  position: absolute;
  inset: 0;
  z-index: 1;
  margin: auto;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.95);
  color: var(--blue);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.24);
  transition: transform 0.22s ease;
}

.watch-player:hover .watch-player__play {
  transform: scale(1.06);
}

.watch-copy :deep(.section-header) {
  margin-bottom: 18px;
}

.watch-copy :deep(.section-header__title) {
  max-width: none;
}

.watch-latest {
  color: var(--blue);
  font-size: 0.96rem;
  margin-bottom: 14px;
}

.watch-latest strong {
  font-weight: 700;
}

.watch-body {
  color: var(--muted);
  font-size: 1.02rem;
  line-height: 1.65;
  margin-bottom: 22px;
  max-width: 46ch;
}

.watch-schedule {
  list-style: none;
  display: grid;
  gap: 10px;
  margin-bottom: 28px;
}

.watch-schedule li {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  background: var(--white);
  border: 1px solid var(--line);
  font-size: 0.92rem;
}

.watch-schedule span {
  color: var(--muted);
}

.watch-schedule strong {
  color: var(--ink);
  font-family: var(--display);
}

.watch-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

@media (max-width: 980px) {
  .watch-grid {
    grid-template-columns: 1fr;
  }
}
</style>
