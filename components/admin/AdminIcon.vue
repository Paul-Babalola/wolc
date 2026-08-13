<script setup lang="ts">
defineProps<{
  name: 'dashboard' | 'events' | 'rsvps' | 'inbox' | 'prayer' | 'newsletter' | 'content'
}>()
</script>

<template>
  <svg class="admin-icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <template v-if="name === 'dashboard'">
      <rect x="3" y="3" width="8" height="8" rx="2" fill="none" stroke="currentColor" stroke-width="2" />
      <rect x="13" y="3" width="8" height="5" rx="2" fill="none" stroke="currentColor" stroke-width="2" />
      <rect x="13" y="10" width="8" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" fill="none" stroke="currentColor" stroke-width="2" />
    </template>

    <template v-else-if="name === 'events'">
      <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2" />
      <path d="M8 3v4M16 3v4M3 10h18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </template>

    <template v-else-if="name === 'rsvps'">
      <path d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3Z" fill="none" stroke="currentColor" stroke-width="2" />
      <path d="M8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Z" fill="none" stroke="currentColor" stroke-width="2" />
      <path d="M8.5 13.5C6.01 14.57 4 16.39 4 19v1h7v-1c0-1.12.37-2.17 1-3.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <path d="M15.5 13.5c2.49 1.07 4.5 2.89 4.5 5.5v1h-7v-1c0-1.12-.37-2.17-1-3.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </template>

    <template v-else-if="name === 'inbox'">
      <path d="M4 6h16v12H4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
      <path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <template v-else-if="name === 'prayer'">
      <path d="M12 4c-2.5 2.8-6 4.6-6 8.2 0 2.8 2.2 4.8 6 7.8 3.8-3 6-5 6-7.8C18 8.6 14.5 6.8 12 4Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
    </template>

    <template v-else-if="name === 'newsletter'">
      <path d="M12 21s7-4.5 7-10V6l-7-3-7 3v5c0 5.5 7 10 7 10Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
      <path d="m9.5 12 2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <template v-else-if="name === 'content'">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </template>
  </svg>
</template>

<style scoped>
.admin-icon {
  flex-shrink: 0;
}
</style>
