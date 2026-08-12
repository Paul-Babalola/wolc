<script setup lang="ts">
defineProps<{data: any}>()

const {data: ministries} = await useAsyncData('ministries-grid', () =>
  queryCollection('ministries').order('order', 'ASC').all(),
)

const glowColors = ['#2563eb', '#38bdf8', '#818cf8']
</script>

<template>
  <section class="ministries landing-section landing-section--white">
    <div class="wrap">
      <SectionsSectionHeader
        class="reveal"
        :eyebrow="data.eyebrow"
        :title="data.heading"
        :intro="data.intro"
        action-label="View all ministries"
        action-href="/ministries"
      />

      <div class="ministries-grid">
        <ClientOnly>
          <BitsBorderGlow
            v-for="m in ministries"
            :key="m.slug"
            class-name="ministry-glow reveal"
            background-color="#ffffff"
            :border-radius="22"
            :colors="glowColors"
            glow-color="217 91 60"
          >
            <NuxtLink :to="`/ministries/${m.slug}`" class="ministry-card">
              <div
                v-if="m.imageUrl"
                class="ministry-card__media"
              >
                <NuxtImg
                  :src="m.imageUrl"
                  :alt="m.title"
                  width="640"
                  height="420"
                  loading="lazy"
                  format="webp"
                />
              </div>
              <div v-else class="ministry-card__media ministry-card__media--fallback" />
              <div class="ministry-card__body">
                <h3>{{ m.title }}</h3>
                <p>{{ m.blurb }}</p>
                <span class="landing-link-arrow">Explore ministry</span>
              </div>
            </NuxtLink>
          </BitsBorderGlow>

          <template #fallback>
            <NuxtLink
              v-for="m in ministries"
              :key="`${m.slug}-fallback`"
              :to="`/ministries/${m.slug}`"
              class="ministry-card ministry-card--plain reveal"
            >
              <div
                v-if="m.imageUrl"
                class="ministry-card__media"
              >
                <img :src="m.imageUrl" :alt="m.title" loading="lazy">
              </div>
              <div class="ministry-card__body">
                <h3>{{ m.title }}</h3>
                <p>{{ m.blurb }}</p>
              </div>
            </NuxtLink>
          </template>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ministries :deep(.section-header) {
  margin-bottom: clamp(24px, 3.5vw, 36px);
}

.ministries-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.ministry-glow {
  transition: transform 0.24s ease;
}

.ministry-glow:hover {
  transform: translateY(-5px);
}

.ministry-glow :deep(.border-glow-inner) {
  height: 100%;
}

.ministry-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
  background: var(--white);
}

.ministry-card--plain {
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
}

.ministry-card__media {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: linear-gradient(145deg, #0f172a, var(--blue));
}

.ministry-card__media img,
.ministry-card__media :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.ministry-card:hover .ministry-card__media img,
.ministry-card:hover .ministry-card__media :deep(img) {
  transform: scale(1.04);
}

.ministry-card__media--fallback {
  background:
    radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.18), transparent 45%),
    linear-gradient(145deg, #1e3a8a, var(--blue));
}

.ministry-card__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 22px 24px 24px;
}

.ministry-card__body h3 {
  font-family: var(--display);
  font-weight: 700;
  font-size: 1.18rem;
  line-height: 1.2;
  margin-bottom: 8px;
}

.ministry-card__body p {
  color: var(--muted);
  font-size: 0.94rem;
  line-height: 1.55;
  margin-bottom: 16px;
}

@media (max-width: 980px) {
  .ministries-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .ministries-grid {
    grid-template-columns: 1fr;
  }
}
</style>
