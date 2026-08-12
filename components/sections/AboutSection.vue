<script setup lang="ts">
const props = defineProps<{data: any}>()
const lines = computed(() => (props.data?.heading || '').split('/').map((s: string) => s.trim()))
</script>

<template>
  <section class="block">
    <div class="wrap lead-grid" :class="{ 'lead-grid--single': !data.scriptureQuote }">
      <div class="lead-copy reveal">
        <span v-if="data.eyebrow" class="eyebrow-dark">{{ data.eyebrow }}</span>
        <h2 class="section-title">
          <template v-for="(line, i) in lines" :key="i">{{ line }}<br v-if="i < lines.length - 1"></template>
          <span v-if="data.highlight" class="highlight"> {{ data.highlight }}</span>
        </h2>
        <p v-for="(para, i) in data.body" :key="i">{{ para }}</p>
        <SectionCtaLink v-if="data.cta?.href" :link="data.cta" class="btn btn-primary" suffix=" →" />
      </div>
      <div v-if="data.scriptureQuote" class="verse-card reveal">
        <div class="q">"{{ data.scriptureQuote }}"</div>
        <div class="ref">{{ data.scriptureRef }}</div>
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
.highlight { color: var(--blue); }
.lead-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 70px; align-items: center; }
.lead-grid--single { grid-template-columns: 1fr; }
.lead-copy p { color: var(--muted); margin-top: 22px; font-size: 1.08rem; }
.lead-copy .btn { margin-top: 32px; }
.verse-card {
  background: var(--blue);
  border-radius: 26px;
  padding: 44px;
  color: var(--white);
}
.verse-card .q {
  font-family: var(--display);
  font-weight: 700;
  font-size: 1.9rem;
  line-height: 1.2;
  letter-spacing: -0.01em;
}
.verse-card .ref {
  margin-top: 22px;
  opacity: 0.75;
  font-weight: 600;
  letter-spacing: 0.04em;
}
@media (max-width: 900px) { .lead-grid { grid-template-columns: 1fr; gap: 40px; } }
</style>
