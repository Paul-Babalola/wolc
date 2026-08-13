<script setup lang="ts">
definePageMeta({layout: 'auth'})

const user = useSupabaseUser()

watchEffect(() => {
  if (user.value) navigateTo('/admin')
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
  background:
    radial-gradient(circle at 12% 0%, rgba(var(--blue-rgb), 0.07), transparent 34%),
    linear-gradient(180deg, #f3f6fb 0%, var(--paper) 100%);
}
</style>
