<script setup lang="ts">
const props = defineProps<{data: any}>()

const lines = computed(() =>
  (props.data?.heading || '')
    .split('/')
    .map((s: string) => s.trim())
    .filter(Boolean),
)

const highlights = [
  { label: 'Sunday worship', value: '10:00 AM' },
  { label: 'Bible study', value: 'Wed · 7:00 PM' },
  { label: 'Location', value: 'Silver Spring, MD' },
]

const isStandaloneWelcome = computed(() => !props.data?.scriptureQuote)

const highlightText = computed(() => {
  const text = props.data?.highlight?.trim()
  return text ? `\u00a0${text}` : ''
})
</script>

<template>
  <section class="about landing-section landing-section--paper">
    <div class="wrap">
      <div
        class="about-grid"
        :class="{ 'about-grid--standalone': isStandaloneWelcome }"
      >
        <div class="about-copy reveal">
          <header class="about-header">
            <span v-if="data.eyebrow" class="about-header__eyebrow">{{ data.eyebrow }}</span>
            <h2 class="about-header__title">
              <template v-for="(line, i) in lines" :key="i">
                {{ line }}<br v-if="i < lines.length - 1">
              </template><span v-if="highlightText" class="about-header__accent">{{ highlightText }}</span>
            </h2>
          </header>

          <div class="about-body">
            <p v-for="(para, i) in data.body" :key="i">{{ para }}</p>
          </div>

          <ul
            v-if="!isStandaloneWelcome"
            class="about-stats"
            aria-label="Service highlights"
          >
            <li v-for="item in highlights" :key="item.label">
              <span class="about-stats__label">{{ item.label }}</span>
              <span class="about-stats__value">{{ item.value }}</span>
            </li>
          </ul>

          <SectionCtaLink
            v-if="data.cta?.href"
            :link="data.cta"
            class="btn btn-primary"
            suffix=" →"
          />
        </div>

        <aside v-if="data.scriptureQuote || data.imageUrl" class="about-aside reveal">
          <div v-if="data.imageUrl" class="about-photo">
            <NuxtImg
              :src="data.imageUrl"
              alt="RCCG Word of Life Center congregation"
              width="640"
              height="480"
              format="webp"
              loading="lazy"
            />
          </div>
          <div v-if="data.scriptureQuote" class="vision-card">
            <span class="vision-card__tag">{{ data.scriptureRef || 'Our vision' }}</span>
            <blockquote class="vision-card__quote">
              “{{ data.scriptureQuote }}”
            </blockquote>
            <div class="vision-card__glow" aria-hidden="true" />
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
  gap: clamp(40px, 6vw, 80px);
  align-items: start;
}

.about-grid--standalone {
  grid-template-columns: 1fr;
}

.about-grid--standalone .about-copy {
  max-width: none;
  width: 100%;
}

.about-grid--standalone .about-header__title {
  max-width: none;
  font-size: clamp(1.95rem, 3.8vw, 2.85rem);
  line-height: 1.12;
}

.about-grid--standalone .about-body p {
  max-width: none;
}

.about-copy {
  max-width: min(100%, 40rem);
}

.about-header {
  margin-bottom: clamp(20px, 3vw, 28px);
}

.about-header__eyebrow {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--blue);
  margin-bottom: 14px;
}

.about-header__title {
  font-family: var(--display);
  font-weight: 800;
  font-size: clamp(2.1rem, 4.8vw, 3.35rem);
  line-height: 1.08;
  letter-spacing: -0.025em;
  color: var(--ink);
  max-width: 14em;
}

.about-header__accent {
  color: var(--blue);
}

.about-body {
  display: grid;
  gap: 18px;
  margin-bottom: 28px;
}

.about-body p {
  color: var(--muted);
  font-size: clamp(1rem, 1.6vw, 1.08rem);
  line-height: 1.65;
  max-width: 62ch;
}

.about-stats {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 32px;
}

.about-stats li {
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 16px 14px;
}

.about-stats__label {
  display: block;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 6px;
}

.about-stats__value {
  display: block;
  font-family: var(--display);
  font-weight: 700;
  font-size: 0.98rem;
  line-height: 1.25;
  color: var(--ink);
}

.about-copy .btn {
  margin-top: 4px;
}

.about-aside {
  display: grid;
  gap: 18px;
}

.about-photo {
  border-radius: calc(var(--radius-xl) + 4px);
  overflow: hidden;
  border: 1px solid var(--line);
  box-shadow: 0 20px 48px rgba(var(--blue-rgb), 0.12);
}

.about-photo :deep(img) {
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.vision-card {
  position: relative;
  overflow: hidden;
  border-radius: calc(var(--radius-xl) + 4px);
  padding: clamp(32px, 4vw, 44px);
  background:
    radial-gradient(circle at 100% 0%, rgba(255, 255, 255, 0.18), transparent 42%),
    linear-gradient(155deg, #1d4ed8 0%, var(--blue) 52%, #3b82f6 100%);
  color: var(--white);
  box-shadow: 0 28px 64px rgba(var(--blue-rgb), 0.28);
}

.vision-card__tag {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 22px;
}

.vision-card__quote {
  position: relative;
  z-index: 1;
  font-family: var(--display);
  font-weight: 700;
  font-size: clamp(1.45rem, 2.8vw, 2rem);
  line-height: 1.22;
  letter-spacing: -0.015em;
}

.vision-card__glow {
  position: absolute;
  inset: auto -20% -40% auto;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  filter: blur(8px);
}

@media (max-width: 980px) {
  .about-grid {
    grid-template-columns: 1fr;
  }

  .about-header__title {
    max-width: none;
  }

  .about-stats {
    grid-template-columns: 1fr;
  }
}
</style>
