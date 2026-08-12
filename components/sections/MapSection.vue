<script setup lang="ts">
const props = defineProps<{data: any}>()

const embedSrc = computed(() => {
  if (props.data?.embedUrl) return props.data.embedUrl
  const q = encodeURIComponent(props.data?.address || '11313 Lockwood Dr, Silver Spring MD 20904')
  return `https://maps.google.com/maps?q=${q}&output=embed`
})
</script>

<template>
  <section class="block map-block">
    <div class="wrap map-grid">
      <div class="map-copy reveal">
        <span v-if="data.eyebrow" class="eyebrow-dark">{{ data.eyebrow }}</span>
        <h2 class="section-title">{{ data.heading || 'Find us' }}</h2>
        <p v-if="data.address" class="address">{{ data.address }}</p>
        <p v-if="data.serviceTimes" class="times">{{ data.serviceTimes }}</p>
        <a
          v-if="data.directionsUrl"
          :href="data.directionsUrl"
          class="btn btn-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get directions
        </a>
      </div>
      <div class="map-frame reveal">
        <iframe
          :src="embedSrc"
          title="Church location map"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.map-block { padding-top: 0; }
.eyebrow-dark {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--blue);
  display: block;
  margin-bottom: 12px;
}
.map-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 40px;
  align-items: center;
}
.address, .times {
  color: var(--muted);
  margin-top: 14px;
  line-height: 1.55;
}
.times { font-weight: 600; color: var(--ink-3); }
.map-copy .btn { margin-top: 24px; }
.map-frame {
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid var(--line);
  min-height: 320px;
  background: var(--paper);
}
.map-frame iframe {
  width: 100%;
  height: 100%;
  min-height: 320px;
  border: 0;
  display: block;
}
@media (max-width: 900px) {
  .map-grid { grid-template-columns: 1fr; }
}
</style>
