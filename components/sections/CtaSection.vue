<script setup lang="ts">
const props = defineProps<{data: any}>()

const lines = computed(() =>
  (props.data?.heading || '')
    .split('/')
    .map((s: string) => s.trim())
    .filter(Boolean),
)
</script>

<template>
  <section class="cta landing-section landing-section--flush-top">
    <div class="wrap">
      <div class="cta-panel reveal">
        <div class="cta-panel__glow cta-panel__glow--one" aria-hidden="true" />
        <div class="cta-panel__glow cta-panel__glow--two" aria-hidden="true" />

        <div class="cta-panel__content">
          <span class="cta-panel__eyebrow">You're invited</span>
          <h2>
            <template v-for="(line, i) in lines" :key="i">
              {{ line }}<br v-if="i < lines.length - 1">
            </template>
          </h2>
          <p v-if="data.body">{{ data.body }}</p>

          <div class="cta-panel__actions">
            <SectionCtaLink
              v-if="data.primaryCta?.href"
              :link="data.primaryCta"
              class="btn btn-light"
              suffix=" →"
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
  </section>
</template>

<style scoped>
.cta {
  padding-bottom: clamp(40px, 5vw, 56px);
}

.cta-panel {
  position: relative;
  overflow: hidden;
  border-radius: calc(var(--radius-xl) + 8px);
  padding: clamp(44px, 6vw, 64px) clamp(24px, 5vw, 56px);
  text-align: center;
  color: var(--white);
  background:
    radial-gradient(circle at 0% 0%, rgba(255, 255, 255, 0.16), transparent 42%),
    radial-gradient(circle at 100% 100%, rgba(56, 189, 248, 0.22), transparent 38%),
    linear-gradient(135deg, #1e40af 0%, var(--blue) 48%, #3b82f6 100%);
  box-shadow: 0 28px 72px rgba(var(--blue-rgb), 0.28);
}

.cta-panel__glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.cta-panel__glow--one {
  width: 320px;
  height: 320px;
  top: -120px;
  right: -80px;
  background: rgba(255, 255, 255, 0.08);
}

.cta-panel__glow--two {
  width: 260px;
  height: 260px;
  bottom: -120px;
  left: -60px;
  background: rgba(56, 189, 248, 0.12);
}

.cta-panel__content {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
}

.cta-panel__eyebrow {
  display: inline-block;
  margin-bottom: 16px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.78);
}

.cta-panel h2 {
  font-family: var(--display);
  font-weight: 800;
  font-size: clamp(2.1rem, 5vw, 3.5rem);
  line-height: 1.02;
  letter-spacing: -0.025em;
}

.cta-panel p {
  max-width: 42ch;
  margin: 18px auto 30px;
  font-size: clamp(1rem, 1.8vw, 1.12rem);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.88);
}

.cta-panel__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.btn-light {
  background: var(--white);
  color: var(--blue);
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.14);
}

.btn-light:hover {
  background: var(--paper);
  color: var(--blue-hover);
}
</style>
