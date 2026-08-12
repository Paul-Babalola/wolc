<script setup lang="ts">
defineProps<{data: any}>()

const iconPaths = [
  'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  'M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
  'M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 100-3m0-3a1.5 1.5 0 110-3m0 8.5h3m-3 0a1.5 1.5 0 103 0m-3 0h3',
]
</script>

<template>
  <section class="quick-info landing-section landing-section--flush-top">
    <div class="wrap">
      <div class="quick-info__panel landing-surface reveal">
        <article
          v-for="(item, i) in data.items"
          :key="i"
          class="quick-info__item"
        >
          <span class="quick-info__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[i as number] || iconPaths[0]" />
            </svg>
          </span>
          <div class="quick-info__copy">
            <h3>{{ item.heading }}</h3>
            <p>{{ item.body }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.quick-info {
  z-index: 5;
  margin-top: clamp(-64px, -7vw, -40px);
  padding-bottom: clamp(40px, 5vw, 56px);
}

.quick-info__panel {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  overflow: hidden;
}

.quick-info__item {
  display: flex;
  gap: 18px;
  align-items: flex-start;
  padding: clamp(24px, 3vw, 34px) clamp(22px, 3vw, 32px);
  border-right: 1px solid var(--line);
}

.quick-info__item:last-child {
  border-right: none;
}

.quick-info__icon {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(145deg, rgba(var(--blue-rgb), 0.14), rgba(var(--blue-rgb), 0.06));
  color: var(--blue);
}

.quick-info__icon svg {
  width: 22px;
  height: 22px;
}

.quick-info__copy h3 {
  font-family: var(--display);
  font-weight: 700;
  font-size: clamp(1.05rem, 1.8vw, 1.18rem);
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--ink);
  margin-bottom: 8px;
}

.quick-info__copy p {
  color: var(--muted);
  font-size: 0.94rem;
  line-height: 1.55;
}

@media (max-width: 900px) {
  .quick-info__panel {
    grid-template-columns: 1fr;
  }

  .quick-info__item {
    border-right: none;
    border-bottom: 1px solid var(--line);
  }

  .quick-info__item:last-child {
    border-bottom: none;
  }
}
</style>
