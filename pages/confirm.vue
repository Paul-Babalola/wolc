<script setup lang="ts">
definePageMeta({layout: 'admin'})

const user = useSupabaseUser()

watchEffect(() => {
  if (user.value) navigateTo('/admin/events')
})
</script>

<template>
  <div class="confirm-page">
    <p>Completing sign in…</p>
  </div>
</template>

<style scoped>
.confirm-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  color: var(--muted);
}
</style>
