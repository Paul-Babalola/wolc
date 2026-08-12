<script setup lang="ts">
type CtaLink = { label?: string; href?: string; external?: boolean }

const props = defineProps<{
  link?: CtaLink
  class?: string
  suffix?: string
}>()

const external = computed(() => {
  const href = props.link?.href
  if (!href) return false
  return props.link?.external ?? /^https?:\/\//.test(href)
})
</script>

<template>
  <a
    v-if="link?.href && external"
    :href="link.href"
    :class="class"
    target="_blank"
    rel="noopener noreferrer"
  >
    {{ link.label }}{{ suffix }}
  </a>
  <NuxtLink v-else-if="link?.href" :to="link.href" :class="class">
    {{ link.label }}{{ suffix }}
  </NuxtLink>
</template>
