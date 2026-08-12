<script setup lang="ts">
type Crumb = {label: string; href?: string}

const props = defineProps<{
  title: string
  eyebrow?: string
  lead?: string
  crumbs?: Crumb[]
  breadcrumb?: boolean
  accent?: 'blue' | 'green'
  image?: string
}>()

const displayCrumbs = computed(() =>
  props.crumbs?.length
    ? props.crumbs
    : [{label: 'Home', href: '/'}, {label: props.title}],
)
</script>

<template>
  <header
    class="page-header"
    :class="[
      accent && `page-header--${accent}`,
      { 'page-header--has-bg': image || $slots.background },
    ]"
  >
    <div v-if="image || $slots.background" class="page-header__bg" aria-hidden="true">
      <NuxtImg
        v-if="image"
        :src="image"
        alt=""
        class="page-header__bg-img"
        width="1920"
        height="640"
        format="webp"
        loading="lazy"
      />
      <slot v-else name="background" />
      <div class="page-header__bg-overlay" />
    </div>
    <div class="wrap page-header__inner">
      <nav v-if="breadcrumb !== false" class="page-crumb" aria-label="Breadcrumb">
        <template v-for="(crumb, i) in displayCrumbs" :key="`${crumb.label}-${i}`">
          <NuxtLink v-if="crumb.href" :to="crumb.href">{{ crumb.label }}</NuxtLink>
          <span v-else>{{ crumb.label }}</span>
          <span v-if="i < displayCrumbs.length - 1" aria-hidden="true">/</span>
        </template>
      </nav>
      <p v-if="eyebrow" class="eyebrow-dark">{{ eyebrow }}</p>
      <h1 class="page-header__title">{{ title }}</h1>
      <p v-if="lead" class="page-lead">{{ lead }}</p>
    </div>
  </header>
</template>

<style scoped>
.page-header--has-bg {
  position: relative;
  overflow: hidden;
  min-height: clamp(180px, 24vw, 240px);
  display: flex;
  align-items: flex-end;
  padding-bottom: 44px;
}

.page-header__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.page-header__bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.page-header__bg-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.88) 72%, var(--white) 100%),
    linear-gradient(90deg, var(--white) 0%, rgba(255, 255, 255, 0.35) 42%, rgba(255, 255, 255, 0.75) 100%);
}

.page-header--has-bg .page-header__inner {
  position: relative;
  z-index: 2;
  width: 100%;
}
</style>
