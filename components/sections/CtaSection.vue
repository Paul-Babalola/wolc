<script setup lang="ts">
const props = defineProps<{data: any}>()
const lines = computed(() => (props.data?.heading || '').split('/').map((s: string) => s.trim()))
</script>

<template>
  <section class="cta-band">
    <div class="wrap">
      <div class="cta-inner reveal">
        <h2>
          <template v-for="(line, i) in lines" :key="i">{{ line }}<br v-if="i < lines.length - 1"></template>
        </h2>
        <p v-if="data.body">{{ data.body }}</p>
        <div class="hero-actions">
          <SectionCtaLink v-if="data.primaryCta?.href" :link="data.primaryCta" class="btn btn-primary btn-light" suffix=" →" />
          <SectionCtaLink v-if="data.secondaryCta?.href" :link="data.secondaryCta" class="btn btn-ghost" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-band { padding: 80px 0 64px; }
.cta-inner {
  position: relative;
  border-radius: 34px;
  overflow: hidden;
  padding: 80px 60px;
  text-align: center;
  background: var(--blue);
  color: var(--white);
}
.cta-inner h2 {
  font-family: var(--display);
  font-weight: 800;
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  line-height: 1;
  letter-spacing: -0.02em;
}
.cta-inner p {
  max-width: 480px;
  margin: 20px auto 34px;
  font-size: 1.1rem;
  opacity: 0.85;
}
.hero-actions { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
.btn-light {
  background: var(--white);
  color: var(--blue);
  box-shadow: none;
}
.btn-light:hover {
  background: var(--paper);
  color: var(--blue-hover);
}
@media (max-width: 560px) { .cta-inner { padding: 56px 26px; } }
</style>
