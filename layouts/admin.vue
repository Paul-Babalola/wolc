<script setup lang="ts">
import logoUrl from "~/assets/css/images/logo.png";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const route = useRoute();
const mobileOpen = ref(false);

const { items } = useAdminNav();

const userInitial = computed(() => {
  const email = user.value?.email || "";
  return email ? email.charAt(0).toUpperCase() : "?";
});

const displayName = computed(() => {
  const email = user.value?.email || "";
  if (!email) return "Staff";
  const local = email.split("@")[0] || "Staff";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
});

const activeLabel = computed(
  () => items.value.find((item) => item.active)?.label || "Admin",
);

const { confirm: confirmAction } = useAdminConfirm();

async function signOut() {
  const ok = await confirmAction({
    title: "Sign out",
    message: "Sign out of the admin dashboard?",
    confirmLabel: "Sign out",
  });
  if (!ok) return;

  await supabase.auth.signOut();
  await navigateTo("/login");
}

watch(
  () => route.path,
  () => {
    mobileOpen.value = false;
  },
);
</script>

<template>
  <div class="admin-root" :class="{ 'admin-nav-open': mobileOpen }">
    <aside class="admin-sidebar" aria-label="Admin navigation">
      <div class="admin-brand">
        <NuxtLink to="/admin" class="admin-brand-link">
          <img
            :src="logoUrl"
            alt="RCCG Word of Life Center"
            class="admin-brand-logo"
            width="140"
            height="28"
          />
        </NuxtLink>
      </div>

      <nav class="admin-nav">
        <NuxtLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="admin-nav-link"
          :class="{ active: item.active }"
        >
          <span class="admin-nav-icon">
            <AdminIcon :name="item.tone" />
          </span>
          <span class="admin-nav-text">
            <span class="admin-nav-label">{{ item.label }}</span>
            <span v-if="item.description" class="admin-nav-desc">{{
              item.description
            }}</span>
          </span>
        </NuxtLink>
      </nav>

      <div class="admin-sidebar-foot">
        <div v-if="user?.email" class="admin-user-card">
          <span class="admin-user-avatar">{{ userInitial }}</span>
          <span class="admin-user-info">
            <span class="admin-user-name">{{ displayName }}</span>
            <span class="admin-user-email">{{ user.email }}</span>
          </span>
        </div>

        <div class="admin-sidebar-actions">
          <NuxtLink class="admin-foot-link" to="/" target="_blank"
            >View public site</NuxtLink
          >
          <button
            class="admin-foot-link admin-foot-link--button"
            type="button"
            @click="signOut"
          >
            Sign out
          </button>
        </div>
      </div>
    </aside>

    <button
      v-if="mobileOpen"
      class="admin-sidebar-backdrop"
      type="button"
      aria-label="Close menu"
      @click="mobileOpen = false"
    />

    <div class="admin-main-wrap">
      <header class="admin-header">
        <div class="admin-header-start">
          <p class="admin-welcome">
            Welcome back, <strong>{{ displayName }}</strong>
          </p>
          <p class="admin-header-page">{{ activeLabel }}</p>
        </div>

        <div class="admin-header-end">
          <button
            class="admin-menu-btn btn btn-ghost-dark"
            type="button"
            @click="mobileOpen = !mobileOpen"
          >
            {{ mobileOpen ? "Close" : "Menu" }}
          </button>

          <div v-if="user?.email" class="admin-profile">
            <span class="admin-user-avatar">{{ userInitial }}</span>
            <span class="admin-profile-text">
              <span class="admin-profile-role">Staff admin</span>
              <span class="admin-profile-name">{{ displayName }}</span>
            </span>
          </div>
        </div>
      </header>

      <nav v-if="mobileOpen" class="admin-mobile-nav" aria-label="Admin mobile">
        <NuxtLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="admin-nav-link"
          :class="{ active: item.active }"
        >
          <span class="admin-nav-icon">
            <AdminIcon :name="item.tone" />
          </span>
          <span class="admin-nav-text">
            <span class="admin-nav-label">{{ item.label }}</span>
          </span>
        </NuxtLink>
      </nav>

      <main class="admin-main">
        <slot />
      </main>
    </div>

    <AdminConfirmModal />
  </div>
</template>

<style>
@import "~/assets/css/admin.css";
</style>
