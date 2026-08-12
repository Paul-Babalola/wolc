<script setup lang="ts">
defineProps<{data: any}>()

const {data: sermon} = await useAsyncData('featured-sermon', () =>
  queryCollection('sermons').order('preachedAt', 'DESC').first(),
)
</script>

<template>
  <section class="watch block">
    <div class="wrap watch-grid">
      <a class="player reveal" :href="sermon?.videoUrl || '/sermons'" :target="sermon?.videoUrl ? '_blank' : '_self'">
        <div class="play">▶</div>
      </a>
      <div class="watch-copy reveal">
        <span v-if="data.eyebrow" class="eyebrow-dark">{{ data.eyebrow }}</span>
        <h2 class="section-title">{{ data.heading }}</h2>
        <p v-if="sermon" class="latest">Latest: {{ sermon.title }}<span v-if="sermon.speaker"> · {{ sermon.speaker }}</span></p>
        <p v-if="data.body">{{ data.body }}</p>
        <div class="hero-actions">
          <SectionCtaLink v-if="data.primaryCta?.href" :link="data.primaryCta" class="btn btn-primary" suffix=" →" />
          <SectionCtaLink v-if="data.secondaryCta?.href" :link="data.secondaryCta" class="btn btn-ghost-dark" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.eyebrow-dark {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--blue);
  display: block;
  margin-bottom: 12px;
}
.watch { background: var(--paper-2); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.watch-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 56px; align-items: center; }
.player {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  background: var(--blue);
  display: grid;
  place-items: center;
}
.play {
  width: 82px;
  height: 82px;
  border-radius: 50%;
  background: var(--white);
  color: var(--blue);
  display: grid;
  place-items: center;
  font-size: 1.6rem;
  padding-left: 5px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s;
}
.player:hover .play { transform: scale(1.08); }
.watch-copy h2 { margin-bottom: 14px; }
.watch-copy .latest { color: var(--blue); font-weight: 600; margin-bottom: 10px; }
.watch-copy p { color: var(--muted); margin-bottom: 26px; }
.hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }
@media (max-width: 900px) { .watch-grid { grid-template-columns: 1fr; gap: 40px; } }
</style>
