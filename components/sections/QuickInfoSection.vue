<script setup lang="ts">
const props = defineProps<{data: any}>()

const isCards = computed(() => props.data?.layout === 'cards')
</script>

<template>
  <section v-if="isCards" class="block block-tight quick-info-cards">
    <div class="wrap">
      <div class="cards-grid">
        <article
          v-for="(item, i) in data.items"
          :key="i"
          class="info-card reveal"
        >
          <span class="info-card__icon">{{ item.icon }}</span>
          <h3 class="info-card__title">{{ item.heading }}</h3>
          <p class="info-card__body">{{ item.body }}</p>
        </article>
      </div>
    </div>
  </section>

  <div v-else class="strip" :class="{'strip--green': data.tone === 'green'}">
    <div class="wrap">
      <div class="strip-grid">
        <div v-for="(item, i) in data.items" :key="i" class="strip-item">
          <span class="ico">{{ item.icon }}</span>
          <div>
            <h4>{{ item.heading }}</h4>
            <p>{{ item.body }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.strip { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); background: var(--white); }
.strip-grid { display: grid; grid-template-columns: repeat(3, 1fr); }
.strip-item {
  padding: 34px 30px;
  border-right: 1px solid var(--line);
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.strip-item:last-child { border-right: none; }
.strip-item .ico { font-size: 1.5rem; line-height: 1; }
.strip-item h4 { font-family: var(--display); font-weight: 600; font-size: 1.1rem; margin-bottom: 3px; color: var(--ink); }
.strip--green .strip-item .ico {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--green-soft);
  font-size: 1.25rem;
  flex-shrink: 0;
}
.strip--green .strip-item h4 { color: var(--green); }
.strip-item p { color: var(--muted); font-size: 0.95rem; line-height: 1.45; }

.cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
  max-width: var(--content-wide);
}
.info-card {
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 28px 30px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px 20px;
  align-items: start;
}
.info-card__icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: var(--blue-soft);
  font-size: 1.45rem;
  grid-row: span 2;
}
.info-card__title {
  font-family: var(--display);
  font-weight: 700;
  font-size: clamp(1.12rem, 2vw, 1.28rem);
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--ink);
  align-self: end;
}
.info-card__body {
  color: var(--muted);
  font-size: 0.98rem;
  line-height: 1.6;
  grid-column: 2;
}

@media (max-width: 900px) {
  .strip-grid { grid-template-columns: 1fr; }
  .strip-item { border-right: none; border-bottom: 1px solid var(--line); }
  .strip-item:last-child { border-bottom: none; }
}

@media (max-width: 560px) {
  .info-card {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 24px 22px;
  }
  .info-card__icon { grid-row: auto; }
  .info-card__body { grid-column: auto; }
}
</style>
