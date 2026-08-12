<script setup lang="ts">
const props = defineProps<{data: any}>()

const defaultImage = '/images/site/homepage-hero.jpeg'

const headlineLines = computed(() =>
  (props.data?.headline || '')
    .split('/')
    .map((s: string) => s.trim())
    .filter(Boolean),
)

const contentVisible = ref(false)

function onHeadlineComplete() {
  contentVisible.value = true
}

onMounted(() => {
  // Fallback if animation event doesn't fire (e.g. reduced motion)
  setTimeout(() => {
    contentVisible.value = true
  }, 4500)
})
</script>

<template>
  <section class="hero">
    <div class="hero-bg">
      <NuxtImg
        :src="data.imageUrl || defaultImage"
        alt=""
        class="hero-img"
        width="1920"
        height="1080"
        loading="eager"
        format="webp"
      />

      <ClientOnly>
        <BitsFerrofluid
          class-name="hero-ferrofluid"
          :colors="['#2563EB', '#38bdf8', '#E0F2FE']"
          :speed="0.5"
          :scale="1.2"
          :turbulence="1"
          :fluidity="0.1"
          :rim-width="0.2"
          :sharpness="3"
          :shimmer="1"
          :glow="2"
          flow-direction="down"
          :opacity="0.9"
          :mouse-interaction="true"
          :mouse-strength="1"
          :mouse-radius="0.3"
          mix-blend-mode="screen"
        />
      </ClientOnly>

      <div class="hero-overlay" />
    </div>

    <div class="hero-inner-shell">
      <div class="hero-inner">
        <div class="hero-copy">
          <div class="hero-kicker">
            <p v-if="data.eyebrow" class="eyebrow">
              {{ data.eyebrow }}
            </p>
            <span v-else-if="data.badge" class="badge">
              {{ data.badge }}
            </span>
          </div>

          <div class="hero-headline">
            <ClientOnly>
              <BitsTextType
                v-if="headlineLines.length"
                :text="headlineLines"
                as="h1"
                class-name="hero-title"
                sequential
                :typing-speed="75"
                :pause-duration="400"
                :loop="false"
                show-cursor
                cursor-character="|"
                @animation-complete="onHeadlineComplete"
              />
              <template #fallback>
                <h1 class="hero-title">
                  <template v-for="(line, i) in headlineLines" :key="i">
                    {{ line }}<br v-if="i < headlineLines.length - 1">
                  </template>
                </h1>
              </template>
            </ClientOnly>
          </div>

          <div
            class="hero-body hero-fade"
            :class="{ 'is-visible': contentVisible }"
          >
            <p
              v-if="data.highlight"
              class="hero-highlight"
            >
              {{ data.highlight }}
            </p>

            <p v-if="data.subtext" class="hero-sub">
              {{ data.subtext }}
            </p>

            <div
              v-if="data.primaryCta?.href || data.secondaryCta?.href"
              class="hero-actions"
            >
              <SectionCtaLink
                v-if="data.primaryCta?.href"
                :link="data.primaryCta"
                class="btn btn-primary"
              />
              <SectionCtaLink
                v-if="data.secondaryCta?.href"
                :link="data.secondaryCta"
                class="btn btn-ghost"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: clamp(560px, 82vh, 760px);
  display: flex;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 32%;
}

.hero-ferrofluid {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background:
    linear-gradient(90deg, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.52) 52%, rgba(0, 0, 0, 0.22) 100%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.18) 0%, rgba(0, 0, 0, 0.58) 100%);
}

.hero-inner-shell {
  position: relative;
  z-index: 3;
  flex: 1;
  display: flex;
  align-items: center;
  width: 100%;
  padding:
    calc(var(--nav-offset) + clamp(28px, 5vh, 56px))
    var(--layout-shell-x)
    clamp(56px, 8vh, 96px);
}

.hero-inner {
  width: 100%;
  max-width: min(var(--page-width), calc(100% - var(--layout-bar-inset)));
  margin: 0 auto;
  padding: 0 var(--layout-bar-pad-x);
}

.hero-copy {
  max-width: 44rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.hero-kicker {
  margin-bottom: clamp(1rem, 2.2vw, 1.35rem);
}

.badge {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
}

.hero-kicker .eyebrow {
  max-width: 36rem;
  line-height: 1.5;
}

.hero-headline {
  width: 100%;
  margin-bottom: clamp(1.35rem, 3vw, 2rem);
}

:deep(.hero-title),
:deep(.hero-title.text-type) {
  display: block;
  width: 100%;
  font-family: var(--display);
  font-weight: 800;
  font-size: clamp(2.5rem, 6.8vw, 4.75rem);
  line-height: 1.06;
  letter-spacing: -0.02em;
  white-space: pre-wrap;
  color: var(--white);
  margin: 0;
}

.hero-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(1.25rem, 2.5vw, 1.75rem);
  max-width: 38rem;
}

.hero-highlight {
  font-family: var(--display);
  font-weight: 700;
  font-size: clamp(1.55rem, 3.5vw, 2.25rem);
  line-height: 1.12;
  color: rgba(255, 255, 255, 0.92);
  margin: 0;
}

.hero-sub {
  font-size: clamp(1rem, 1.8vw, 1.125rem);
  color: rgba(255, 255, 255, 0.84);
  line-height: 1.6;
  margin: 0;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: clamp(0.25rem, 1vw, 0.75rem);
}

.hero-fade {
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}

.hero-fade.is-visible {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .hero-fade {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

@media (max-width: 980px) {
  .hero-inner-shell {
    padding-top: calc(var(--nav-offset) + 20px);
    align-items: flex-end;
    padding-bottom: clamp(48px, 10vh, 72px);
  }
}

@media (max-width: 560px) {
  .hero-inner-shell {
    padding-bottom: 56px;
  }

  .hero-actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .hero-actions :deep(.btn) {
    justify-content: center;
  }
}
</style>
