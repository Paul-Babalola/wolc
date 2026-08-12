<script setup lang="ts">
const {data: ministries} = await useAsyncData('ministries-page', () =>
  queryCollection('ministries').order('order', 'ASC').all(),
)

const glowColors = ['#2563eb', '#38bdf8', '#818cf8']

useSiteSeo({
  title: 'Ministries',
  description:
    'Covenant Seed, Youth, Women of Grace, Men of Valor, Outreach, and Connect Groups at RCCG Word of Life Center.',
  image: '/images/site/about-church.jpeg',
})
</script>

<template>
  <div>
    <PageHeader
      title="Ministries"
      :crumbs="[{label: 'Home', href: '/'}, {label: 'Ministries'}]"
    />

    <section class="block block-tight">
      <div class="wrap">
        <p class="ministries-lead reveal">
          Covenant Seed, Youth, Women of Grace, Men of Valor, Outreach, and Connect Groups.
        </p>

        <div class="card-grid reveal">
          <ClientOnly>
            <BitsBorderGlow
              v-for="m in ministries"
              :key="m.slug"
              class-name="ministry-card-glow"
              background-color="#0f172a"
              :border-radius="22"
              :colors="glowColors"
              glow-color="217 91 60"
            >
              <NuxtLink
                :to="`/ministries/${m.slug}`"
                class="ministry-card"
                :style="m.imageUrl ? {backgroundImage: `url(${m.imageUrl})`} : undefined"
              >
                <div class="ministry-card__overlay" aria-hidden="true" />
                <div class="ministry-card__scrim" aria-hidden="true" />
                <div class="ministry-card__content">
                  <h3>{{ m.title }}</h3>
                  <p class="ministry-card__blurb">{{ m.blurb }}</p>
                </div>
              </NuxtLink>
            </BitsBorderGlow>
            <template #fallback>
              <NuxtLink
                v-for="m in ministries"
                :key="`${m.slug}-fallback`"
                :to="`/ministries/${m.slug}`"
                class="ministry-card"
                :style="m.imageUrl ? {backgroundImage: `url(${m.imageUrl})`} : undefined"
              >
                <div class="ministry-card__overlay" aria-hidden="true" />
                <div class="ministry-card__scrim" aria-hidden="true" />
                <div class="ministry-card__content">
                  <h3>{{ m.title }}</h3>
                  <p class="ministry-card__blurb">{{ m.blurb }}</p>
                </div>
              </NuxtLink>
            </template>
          </ClientOnly>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ministries-lead {
  color: var(--muted);
  font-size: 1.05rem;
  max-width: 640px;
  margin-bottom: 28px;
}

.ministry-card-glow {
  transition: transform 0.22s ease;
}

.ministry-card-glow:hover {
  transform: translateY(-4px);
}

.ministry-card-glow :deep(.border-glow-inner) {
  height: 100%;
}

.ministry-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 280px;
  overflow: hidden;
  border-radius: inherit;
  border: none;
  background-color: var(--ink);
  background-size: cover;
  background-position: center;
  box-shadow: none;
}

.ministry-card:hover {
  transform: none;
  box-shadow: none;
}

.ministry-card__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.5) 0%, rgba(15, 23, 42, 0.78) 50%, rgba(15, 23, 42, 0.96) 100%);
  transition: background 0.22s ease;
}

.ministry-card__overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.22);
}

.ministry-card__scrim {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 58%;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.55) 55%, rgba(0, 0, 0, 0.82) 100%);
  pointer-events: none;
}

.ministry-card:hover .ministry-card__overlay {
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.55) 0%, rgba(15, 23, 42, 0.84) 50%, rgba(15, 23, 42, 0.98) 100%);
}

.ministry-card__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  padding: 24px;
  color: var(--white);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45), 0 4px 18px rgba(0, 0, 0, 0.35);
}

.ministry-card h3 {
  font-family: var(--display);
  font-size: 1.28rem;
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 10px;
  color: var(--white);
}

.ministry-card__blurb {
  color: rgba(255, 255, 255, 0.96);
  font-size: 0.96rem;
  font-weight: 500;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
