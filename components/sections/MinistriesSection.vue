<script setup lang="ts">
defineProps<{data: any}>()

const {data: ministries} = await useAsyncData('ministries-grid', () =>
  queryCollection('ministries').order('order', 'ASC').all(),
)

const glowColors = ['#2563eb', '#38bdf8', '#818cf8']
</script>

<template>
  <section class="block" style="padding-top: 0">
    <div class="wrap">
      <div class="m-head reveal">
        <div>
          <span v-if="data.eyebrow" class="eyebrow-dark">{{ data.eyebrow }}</span>
          <h2 class="section-title">{{ data.heading }}</h2>
        </div>
        <p v-if="data.intro">{{ data.intro }}</p>
      </div>
      <div class="cards">
        <ClientOnly>
          <BitsBorderGlow
            v-for="m in ministries"
            :key="m.slug"
            class-name="card-glow reveal"
            background-color="#ffffff"
            :border-radius="22"
            :colors="glowColors"
            glow-color="217 91 60"
          >
            <NuxtLink :to="`/ministries/${m.slug}`" class="card">
              <h3>{{ m.title }}</h3>
              <p>{{ m.blurb }}</p>
            </NuxtLink>
          </BitsBorderGlow>
          <template #fallback>
            <NuxtLink
              v-for="m in ministries"
              :key="`${m.slug}-fallback`"
              :to="`/ministries/${m.slug}`"
              class="card reveal"
            >
              <h3>{{ m.title }}</h3>
              <p>{{ m.blurb }}</p>
            </NuxtLink>
          </template>
        </ClientOnly>
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
.m-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; margin-bottom: 52px; flex-wrap: wrap; }
.m-head p { color: var(--muted); max-width: 420px; }
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.card-glow {
  transition: transform 0.25s ease;
}
.card-glow:hover {
  transform: translateY(-6px);
}
.card-glow :deep(.border-glow-inner) {
  height: 100%;
}
.card {
  background: var(--white);
  border: none;
  border-radius: inherit;
  padding: 30px;
  display: block;
  height: 100%;
  box-shadow: none;
}
.card h3 { font-family: var(--display); font-weight: 600; font-size: 1.3rem; margin-bottom: 8px; }
.card p { color: var(--muted); font-size: 0.96rem; }
@media (max-width: 900px) { .cards { grid-template-columns: 1fr 1fr; } }
@media (max-width: 560px) { .cards { grid-template-columns: 1fr; } }
</style>
