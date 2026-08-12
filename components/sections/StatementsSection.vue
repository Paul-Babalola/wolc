<script setup lang="ts">
defineProps<{data: any}>()
</script>

<template>
  <section class="block block-tight statements">
    <div class="wrap">
      <div class="statements-grid">
        <article
          v-for="(item, i) in data.items"
          :key="i"
          class="statement-card reveal"
        >
          <span v-if="item.eyebrow" class="eyebrow-dark">{{ item.eyebrow }}</span>
          <h2 class="statement-title">{{ item.heading }}</h2>
          <p v-for="(para, j) in item.body" :key="j" class="statement-body">{{ para }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.statements-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
}
.statement-card {
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 32px 34px;
  min-height: 100%;
}
.statement-title {
  font-family: var(--display);
  font-weight: 700;
  font-size: clamp(1.35rem, 2.5vw, 1.65rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 10px 0 16px;
}
.statement-body {
  color: var(--muted);
  font-size: 1.02rem;
  line-height: 1.65;
}
.statement-body + .statement-body { margin-top: 14px; }
@media (max-width: 760px) {
  .statements-grid { grid-template-columns: 1fr; }
}
</style>
