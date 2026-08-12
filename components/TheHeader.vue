<script setup lang="ts">
import logoUrl from '~/assets/css/images/logo.png'
import type { CardNavItem } from '~/components/bits/CardNav.vue'

const props = defineProps<{ settings?: any }>()

const route = useRoute()
const mobileOpen = ref(false)
const { scrolled, resetHidden } = useHeaderScroll({ paused: mobileOpen })
const { isLive } = useLiveStatus()

const showSearch = false
const showAccount = false

const CARD_STYLES = [
  { bg: '#1e3a8a', text: '#ffffff' },
  { bg: '#2563eb', text: '#ffffff' },
  { bg: '#1d4ed8', text: '#ffffff' },
  { bg: '#312e81', text: '#ffffff' },
  { bg: '#1e40af', text: '#ffffff' },
]

const cardNavItems = computed<CardNavItem[]>(() => {
  const nav = props.settings?.primaryNav ?? []
  return nav.map((item: any, index: number) => {
    const style = CARD_STYLES[index % CARD_STYLES.length]
    const links = item.children?.length
      ? item.children.map((child: any) => ({
          label: child.label,
          href: child.href,
          ariaLabel: child.description || child.label,
        }))
      : [{
          label: item.label,
          href: item.href,
          ariaLabel: item.label,
        }]

    return {
      label: item.label,
      bgColor: style.bg,
      textColor: style.text,
      links,
    }
  })
})

watch(mobileOpen, (open: boolean) => {
  if (open) resetHidden()
})
watch(() => route.path, () => {
  mobileOpen.value = false
})
</script>

<template>
  <header class="nav-shell">
    <div class="nav-bar nav-bar--desktop" :class="{ scrolled }">
      <div class="nav-inner">
        <NuxtLink to="/" class="brand" aria-label="Word of Life Center — home">
          <img :src="logoUrl" alt="RCCG Word of Life Center" class="brand-logo" width="180" height="32">
        </NuxtLink>

        <nav class="nav-links" aria-label="Primary">
          <template v-for="item in settings?.primaryNav" :key="item.label">
            <NavDropdown v-if="item.children?.length" :item="item" />
            <NuxtLink
              v-else
              :to="item.href"
              class="nav-link"
              :class="{ highlight: item.highlight }"
            >
              {{ item.label }}
            </NuxtLink>
          </template>
        </nav>

        <div class="nav-actions">
          <a
            v-if="isLive && settings?.liveStreamUrl"
            class="live-pill"
            :href="settings.liveStreamUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="live-dot" /> Live now
          </a>

          <button v-if="showSearch" class="icon-btn" type="button" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" stroke-width="1.7" />
              <path d="m14 14 4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
            </svg>
          </button>

          <NuxtLink v-if="showAccount" to="/account" class="icon-btn" aria-label="My account">
            <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="7" r="3.2" fill="none" stroke="currentColor" stroke-width="1.6" />
              <path d="M4 17c0-3 2.7-5 6-5s6 2 6 5" fill="none" stroke="currentColor" stroke-width="1.6" />
            </svg>
          </NuxtLink>

          <NuxtLink class="btn btn-primary cta" to="/visit">Plan a visit</NuxtLink>
        </div>
      </div>
    </div>

    <BitsCardNav
      v-if="settings?.primaryNav?.length"
      v-model:expanded="mobileOpen"
      class="nav-bar--mobile"
      :logo="logoUrl"
      logo-alt="RCCG Word of Life Center"
      :items="cardNavItems"
      base-color="#ffffff"
      menu-color="var(--ink)"
      button-bg-color="#2563EB"
      button-text-color="#ffffff"
      cta-label="Plan a visit"
      cta-href="/visit"
    />
  </header>
</template>

<style scoped>
.nav-shell {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 60;
  padding: 12px var(--layout-shell-x) 0;
  pointer-events: none;
}

.nav-bar--desktop {
  pointer-events: auto;
  max-width: min(var(--page-width), calc(100% - var(--layout-bar-inset)));
  margin: 0 auto;
  padding: 0 var(--layout-bar-pad-x);
  border-radius: 999px;
  background: var(--white);
  border: 1px solid var(--line);
  box-shadow: 0 8px 32px rgba(var(--blue-rgb), 0.08);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  overflow: visible;
}

.nav-bar--desktop.scrolled {
  border-color: rgba(var(--blue-rgb), 0.1);
  box-shadow: 0 12px 40px rgba(var(--blue-rgb), 0.12);
}

.nav-bar--mobile {
  display: none;
}

.nav-inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  height: 60px;
  gap: 16px;
}

.brand {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  justify-self: start;
  transition: opacity 0.2s;
}

.brand:hover { opacity: 0.88; }

.brand-logo {
  height: 32px;
  width: auto;
  max-width: min(180px, 38vw);
  object-fit: contain;
  object-position: left center;
}

.nav-links {
  display: flex;
  gap: 2px;
  align-items: center;
  justify-content: center;
  justify-self: center;
}

.nav-link {
  color: var(--ink-2);
  font-size: 0.84rem;
  font-weight: 500;
  padding: 6px 11px;
  border-radius: 999px;
  transition: color 0.2s, background 0.2s, box-shadow 0.2s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--blue);
  background: var(--blue-soft);
}

.nav-link.highlight {
  background: transparent;
  color: var(--blue);
  font-weight: 600;
  border: 1px solid rgba(var(--blue-rgb), 0.32);
}

.nav-link.highlight:hover,
.nav-link.highlight.router-link-active:hover {
  background: var(--blue-soft);
  border-color: rgba(var(--blue-rgb), 0.45);
}

.nav-link.highlight.router-link-active {
  background: transparent;
  border-color: var(--blue);
}

@media (max-width: 1200px) {
  .nav-inner {
    gap: 8px;
  }

  .brand-logo {
    height: 28px;
    max-width: min(150px, 32vw);
  }

  .live-pill {
    display: none;
  }

  .cta {
    padding: 8px 12px;
    font-size: 0.76rem;
  }
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-self: end;
}

.icon-btn {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--white);
  color: var(--ink-2);
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, box-shadow 0.2s, background 0.2s;
}

.icon-btn:hover {
  color: var(--blue);
  border-color: rgba(var(--blue-rgb), 0.2);
  box-shadow: 0 2px 10px rgba(var(--blue-rgb), 0.08);
}

.cta {
  padding: 8px 16px;
  font-size: 0.8rem;
}

.live-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 11px;
  border-radius: 999px;
  border: 1px solid rgba(220, 53, 69, 0.35);
  background: rgba(220, 53, 69, 0.08);
  color: #c0392b;
  font-size: 0.76rem;
  font-weight: 600;
  white-space: nowrap;
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e74c3c;
  animation: livepulse 1.6s infinite;
}

@keyframes livepulse {
  0% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.6); }
  70% { box-shadow: 0 0 0 8px rgba(231, 76, 60, 0); }
  100% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
}

@media (max-width: 980px) {
  .nav-shell { padding: 10px var(--layout-shell-x) 0; }
  .nav-bar--desktop { display: none; }
  .nav-bar--mobile { display: block; }
}

@media (prefers-reduced-motion: reduce) {
  .live-dot { animation: none; }
}
</style>
