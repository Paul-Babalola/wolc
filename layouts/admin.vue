<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

async function signOut() {
  await supabase.auth.signOut()
  await navigateTo('/login')
}
</script>

<template>
  <div class="admin-shell">
    <header class="admin-bar">
      <div class="admin-bar-inner">
        <div>
          <p class="admin-eyebrow">Word of Life Center</p>
          <p class="admin-title">Admin</p>
        </div>

        <div class="admin-actions">
          <span v-if="user?.email" class="admin-user">{{ user.email }}</span>
          <NuxtLink class="admin-link" to="/events" target="_blank">View events</NuxtLink>
          <button class="admin-link admin-link-btn" type="button" @click="signOut">Sign out</button>
        </div>
      </div>
    </header>

    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.admin-shell {
  min-height: 100vh;
  background: var(--paper);
}

.admin-bar {
  border-bottom: 1px solid var(--line);
  background: var(--white);
}

.admin-bar-inner {
  max-width: var(--page-width);
  margin: 0 auto;
  padding: 16px var(--layout-shell-x);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.admin-eyebrow {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}

.admin-title {
  font-family: var(--display);
  font-weight: 700;
  font-size: 1.2rem;
}

.admin-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.admin-user {
  font-size: 0.88rem;
  color: var(--muted);
}

.admin-link {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--blue);
}

.admin-link-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.admin-main {
  max-width: var(--page-width);
  margin: 0 auto;
  padding: 28px var(--layout-shell-x) 48px;
}
</style>
