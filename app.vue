<script setup lang="ts">
const {data: settings} = await useAsyncData('settings', () =>
  queryCollection('settings').first(),
)

const route = useRoute()
const config = useRuntimeConfig()
const isBareShell = computed(
  () =>
    route.path.startsWith('/admin') ||
    route.path === '/login' ||
    route.path === '/confirm',
)

const siteUrl = String(config.public.siteUrl || 'https://rccgwolc.org').replace(/\/$/, '')

const organizationSchema = computed(() =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Church',
    name: 'RCCG Word of Life Center',
    alternateName: 'RCCG WOLC',
    url: siteUrl,
    logo: `${siteUrl}/rccglogo.png`,
    telephone: settings.value?.phone || '301-637-0122',
    email: settings.value?.email || 'admin@rccgwordoflifecenter.org',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '11313 Lockwood Dr',
      addressLocality: 'Silver Spring',
      addressRegion: 'MD',
      postalCode: '20904',
      addressCountry: 'US',
    },
    sameAs: (settings.value?.socials || []).map((s: {url: string}) => s.url),
  }),
)

useHead({
  titleTemplate: (t) => (t ? `${t} · Word of Life Center` : 'RCCG Word of Life Center'),
  script: () => [
    {
      type: 'application/ld+json',
      children: organizationSchema.value,
    },
  ],
})
</script>

<template>
  <div>
    <a href="#main" class="skip-link">Skip to content</a>
    <TheHeader v-if="!isBareShell" :settings="settings" />
    <main id="main" :class="{'main--bare': isBareShell}">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </main>
    <TheFooter v-if="!isBareShell" :settings="settings" />
  </div>
</template>
