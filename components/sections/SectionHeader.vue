<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  intro?: string
  align?: 'left' | 'center'
  actionLabel?: string
  actionHref?: string
  actionExternal?: boolean
}>()
</script>

<template>
  <header
    class="section-header"
    :class="[
      align === 'center' && 'section-header--center',
    ]"
  >
    <div class="section-header__main">
      <span v-if="eyebrow" class="section-header__eyebrow">{{ eyebrow }}</span>
      <h2 class="section-header__title">{{ title }}</h2>
      <p v-if="intro" class="section-header__intro">{{ intro }}</p>
    </div>

    <SectionCtaLink
      v-if="actionHref && actionLabel"
      :link="{ label: actionLabel, href: actionHref, external: actionExternal }"
      class="section-header__action"
      suffix=" →"
    />
  </header>
</template>

<style scoped>
.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: clamp(20px, 4vw, 40px);
  margin-bottom: clamp(28px, 4vw, 40px);
  flex-wrap: wrap;
}

.section-header--center {
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.section-header__eyebrow {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--blue);
  margin-bottom: 14px;
}

.section-header__title {
  font-family: var(--display);
  font-weight: 800;
  font-size: clamp(2rem, 4.2vw, 3.15rem);
  line-height: 1.04;
  letter-spacing: -0.025em;
  color: var(--ink);
  max-width: 16ch;
}

.section-header--center .section-header__title {
  max-width: none;
}

.section-header__intro {
  margin-top: 16px;
  max-width: 42ch;
  color: var(--muted);
  font-size: clamp(1rem, 1.6vw, 1.08rem);
  line-height: 1.6;
}

.section-header--center .section-header__intro {
  margin-left: auto;
  margin-right: auto;
}

.section-header__action {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  padding: 11px 18px;
  border-radius: 999px;
  border: 1px solid rgba(var(--blue-rgb), 0.18);
  background: var(--white);
  color: var(--blue);
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.section-header__action:hover {
  background: var(--blue-soft);
  border-color: rgba(var(--blue-rgb), 0.28);
  transform: translateY(-1px);
}
</style>
