<script setup lang="ts">
const {data: settings} = await useAsyncData('settings', () =>
  queryCollection('settings').first(),
)

const route = useRoute()
const isBareShell = computed(
  () =>
    route.path.startsWith('/admin') ||
    route.path === '/login' ||
    route.path === '/confirm',
)

useHead({
  titleTemplate: (t) => (t ? `${t} · Word of Life Center` : 'RCCG Word of Life Center'),
})
</script>

<template>
  <div>
    <a href="#main" class="skip-link">Skip to content</a>
    <TheHeader v-if="!isBareShell" :settings="settings" />
    <main id="main">
      <NuxtPage />
    </main>
    <TheFooter v-if="!isBareShell" :settings="settings" />
  </div>
</template>
