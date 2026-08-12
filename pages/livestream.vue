<script setup lang="ts">
type YouTubeVideo = {
  id: string
  title: string
  publishedAt: string
  thumbnailUrl: string
  url: string
}

const {data: settings} = await useAsyncData('livestream-settings', () =>
  queryCollection('settings').first(),
)

const {data: videos} = await useAsyncData('livestream-preview', () =>
  $fetch<YouTubeVideo[]>('/api/youtube/videos', {query: {limit: 1}}),
)

const streamUrl = computed(() => settings.value?.liveStreamUrl || 'https://www.youtube.com/@WolcNetwork/streams')
const facebookUrl = computed(() => settings.value?.facebookLiveUrl || 'https://www.facebook.com/rccg.wolc/live')
const youtubeThumb = computed(() => videos.value?.[0]?.thumbnailUrl || '')

useSiteSeo({
  title: 'Livestream',
  description: 'Watch RCCG Word of Life Center live online every Sunday at 10:00 AM.',
  image: () => youtubeThumb.value || '/images/site/livestream.jpeg',
})
</script>

<template>
  <div>
    <PageHeader
      title="Livestream"
      eyebrow="Watch online"
      :lead="settings?.serviceTimes || 'Join us online for worship and the Word every Sunday.'"
    />

    <section class="block block-tight">
      <div class="wrap live-grid">
        <div class="player reveal">
          <a :href="streamUrl" class="player-frame" target="_blank" rel="noopener noreferrer">
            <img
              v-if="youtubeThumb"
              class="player-frame__thumb"
              :src="youtubeThumb"
              alt=""
              loading="lazy"
            >
            <span class="player-frame__overlay" aria-hidden="true" />
            <span class="play-large" aria-hidden="true">▶</span>
            <span class="player-label">Watch on YouTube</span>
          </a>
          <p class="player-caption">Catch up on recent messages, or watch live when we're streaming.</p>
        </div>

        <aside class="live-aside reveal">
          <div class="schedule-card">
            <h2>When we gather</h2>
            <ul>
              <li>
                <span class="when-label">Sunday worship</span>
                <span class="when-time">10:00 AM</span>
              </li>
              <li>
                <span class="when-label">Wednesday Bible study</span>
                <span class="when-time">7:00 PM</span>
              </li>
            </ul>
          </div>

          <div class="live-actions">
            <a :href="facebookUrl" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
              Watch live on Facebook →
            </a>
          </div>

          <p class="live-tip">
            When we're live, a <strong>Live now</strong> badge appears in the site header during service times.
          </p>
        </aside>
      </div>
    </section>
  </div>
</template>

<style scoped>
.live-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 36px;
  align-items: start;
}
.player-frame {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--line);
  background: linear-gradient(145deg, #0f172a 0%, #1e3a8a 45%, var(--blue) 100%);
  aspect-ratio: 16 / 9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--white);
  text-decoration: none;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}
.player-frame:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(var(--blue-rgb), 0.25);
}
.player-frame__thumb {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.player-frame__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(15, 23, 42, 0.15) 0%,
    rgba(15, 23, 42, 0.5) 50%,
    rgba(15, 23, 42, 0.78) 100%
  );
}
.play-large,
.player-label {
  position: relative;
  z-index: 1;
}
.play-large {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  color: var(--blue);
  display: grid;
  place-items: center;
  padding-left: 5px;
  font-size: 1.1rem;
  margin-bottom: 14px;
}
.player-label {
  font-family: var(--display);
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: -0.01em;
}
.player-caption {
  margin-top: 14px;
  color: var(--muted);
  font-size: 0.94rem;
}
.schedule-card {
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 28px;
  margin-bottom: 24px;
}
.schedule-card h2 {
  font-family: var(--display);
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 18px;
}
.schedule-card ul {
  list-style: none;
  display: grid;
  gap: 16px;
}
.schedule-card li {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}
.schedule-card li:last-child {
  padding-bottom: 0;
  border-bottom: none;
}
.when-label { color: var(--ink-2); font-size: 0.96rem; }
.when-time { color: var(--blue); font-weight: 700; font-size: 0.96rem; }
.live-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}
.live-tip {
  margin-top: 24px;
  padding: 18px 20px;
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.55;
}
.live-tip strong { color: var(--ink-2); }
@media (max-width: 900px) {
  .live-grid { grid-template-columns: 1fr; }
}
</style>
