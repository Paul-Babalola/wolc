<script setup lang="ts">
defineProps<{sections?: any[]}>()

const componentMap: Record<string, any> = {
  hero: resolveComponent('SectionsHeroSection'),
  quickInfo: resolveComponent('SectionsQuickInfoSection'),
  about: resolveComponent('SectionsAboutSection'),
  ministries: resolveComponent('SectionsMinistriesSection'),
  sermonFeature: resolveComponent('SectionsSermonFeatureSection'),
  events: resolveComponent('SectionsEventsSection'),
  cta: resolveComponent('SectionsCtaSection'),
  beliefs: resolveComponent('SectionsBeliefsSection'),
  pastors: resolveComponent('SectionsPastorsSection'),
  statements: resolveComponent('SectionsStatementsSection'),
  map: resolveComponent('SectionsMapSection'),
}
</script>

<template>
  <template v-for="(sec, i) in sections" :key="i">
    <component :is="componentMap[sec.component]" v-if="componentMap[sec.component]" :data="sec" />
  </template>
</template>
