<script setup lang="ts">
import logoUrl from '~/assets/css/images/logo.png'

defineProps<{settings?: any}>()

const route = useRoute()
const {scrolled, hidden} = useHeaderScroll()
const {isLive} = useLiveStatus()

const showSearch = false
const showAccount = false

const mobileOpen = ref(false)
const openGroups = ref<Set<string>>(new Set())

function toggleGroup(label: string) {
  const next = new Set(openGroups.value)
  next.has(label) ? next.delete(label) : next.add(label)
  openGroups.value = next
}
function closeMobile() {
  mobileOpen.value = false
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeMobile()
}

watch(mobileOpen, (open: boolean) => {
  if (import.meta.client) {
    document.documentElement.classList.toggle('nav-open', open)
  }
})
watch(() => route.path, closeMobile)

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.documentElement.classList.remove('nav-open')
})
</script>

<template>
  <header class="nav-shell" :class="{ hidden: hidden && !mobileOpen }">
    <div class="nav-bar" :class="{ scrolled }">
      <div class="nav-inner">
      <NuxtLink to="/" class="brand" aria-label="Word of Life Center — home" @click="closeMobile">
        <img :src="logoUrl" alt="RCCG Word of Life Center" class="brand-logo" width="180" height="32">
      </NuxtLink>

      <nav class="nav-links" aria-label="Primary">
        <template v-for="item in settings?.primaryNav" :key="item.label">
          <NavDropdown v-if="item.children?.length" :item="item" />
          <NuxtLink
            v-else
            :to="item.href"
            class="nav-link"
            :class="{highlight: item.highlight}"
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

        <button
          class="burger"
          :class="{open: mobileOpen}"
          :aria-expanded="mobileOpen"
          aria-controls="mobile-drawer"
          aria-label="Menu"
          type="button"
          @click="mobileOpen = !mobileOpen"
        >
          <span /><span /><span />
        </button>
      </div>
    </div>
    </div>

    <Transition name="drawer">
      <div
        v-show="mobileOpen"
        id="mobile-drawer"
        class="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <nav class="drawer-nav" aria-label="Mobile">
          <template v-for="item in settings?.primaryNav" :key="item.label">
            <div v-if="item.children?.length" class="acc">
              <button
                class="acc-head"
                type="button"
                :aria-expanded="openGroups.has(item.label)"
                @click="toggleGroup(item.label)"
              >
                {{ item.label }}
                <svg class="chev" :class="{flip: openGroups.has(item.label)}" width="14" height="14" viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <div v-show="openGroups.has(item.label)" class="acc-body">
                <NuxtLink
                  v-for="child in item.children"
                  :key="child.href"
                  :to="child.href"
                  class="acc-link"
                  @click="closeMobile"
                >
                  <span class="acc-label">{{ child.label }}</span>
                  <span v-if="child.description" class="acc-desc">{{ child.description }}</span>
                </NuxtLink>
              </div>
            </div>
            <NuxtLink
              v-else
              :to="item.href"
              class="drawer-link"
              :class="{highlight: item.highlight}"
              @click="closeMobile"
            >
              {{ item.label }}
            </NuxtLink>
          </template>
        </nav>

        <div class="drawer-foot">
          <a
            v-if="isLive && settings?.liveStreamUrl"
            class="live-pill wide"
            :href="settings.liveStreamUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="live-dot" /> Watch live now
          </a>
          <NuxtLink class="btn btn-primary wide" to="/visit" @click="closeMobile">Plan a visit →</NuxtLink>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-show="mobileOpen" class="scrim" @click="closeMobile" />
    </Transition>
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
  transition: transform 0.35s ease;
}
.nav-shell.hidden {
  transform: translateY(calc(-100% - 16px));
}

.nav-bar {
  pointer-events: auto;
  max-width: min(var(--page-width), calc(100% - var(--layout-bar-inset)));
  margin: 0 auto;
  padding: 0 var(--layout-bar-pad-x);
  border-radius: 999px;
  background: var(--white);
  border: 1px solid var(--line);
  box-shadow: 0 8px 32px rgba(var(--blue-rgb), 0.08);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.nav-bar.scrolled {
  border-color: rgba(var(--blue-rgb), 0.1);
  box-shadow: 0 12px 40px rgba(var(--blue-rgb), 0.12);
}

.nav-inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
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
  background: var(--blue-soft);
  color: var(--blue);
  font-weight: 600;
  border: 1px solid rgba(var(--blue-rgb), 0.12);
}
.nav-link.highlight:hover {
  background: rgba(var(--blue-rgb), 0.14);
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

.burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 38px;
  height: 38px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--white);
  cursor: pointer;
  padding: 0 10px;
}
.burger span {
  display: block;
  height: 2px;
  background: var(--ink);
  border-radius: 2px;
  transition: transform 0.28s ease, opacity 0.2s ease;
}
.burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.burger.open span:nth-child(2) { opacity: 0; }
.burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(88vw, 400px);
  z-index: 70;
  background: var(--paper);
  border-left: 1px solid var(--line);
  padding: 92px 24px 28px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  box-shadow: -8px 0 40px rgba(var(--blue-rgb), 0.12);
}
.drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.drawer-link {
  padding: 15px 6px;
  font-size: 1.1rem;
  font-family: var(--display);
  font-weight: 600;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
}
.drawer-link.highlight {
  color: var(--blue);
}

.acc { border-bottom: 1px solid var(--line); }
.acc-head {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: none;
  border: none;
  color: var(--ink);
  cursor: pointer;
  padding: 15px 6px;
  font-family: var(--display);
  font-weight: 600;
  font-size: 1.1rem;
}
.chev { transition: transform 0.2s ease; opacity: 0.65; }
.chev.flip { transform: rotate(180deg); }
.acc-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 8px 14px;
  gap: 4px;
  margin-bottom: 8px;
  border-radius: 16px;
  background: var(--white);
  border: 1px solid var(--line);
}
.acc-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2px;
  width: 100%;
  padding: 11px 12px;
  border-radius: 10px;
  transition: background 0.2s;
}
.acc-link:hover { background: var(--blue-soft); }
.acc-label { font-weight: 500; color: var(--ink); }
.acc-desc { font-size: 0.85rem; color: var(--muted); }

.drawer-foot {
  margin-top: auto;
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.wide { width: 100%; justify-content: center; }

.scrim {
  position: fixed;
  inset: 0;
  z-index: 65;
  background: rgba(26, 26, 26, 0.35);
  backdrop-filter: blur(4px);
}

.drawer-enter-active,
.drawer-leave-active { transition: transform 0.32s ease; }
.drawer-enter-from,
.drawer-leave-to { transform: translateX(100%); }
.fade-enter-active,
.fade-leave-active { transition: opacity 0.28s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

@media (max-width: 980px) {
  .nav-shell { padding: 10px var(--layout-shell-x) 0; }
  .nav-bar {
    border-radius: 18px;
  }
  .nav-links { display: none; }
  .icon-btn { display: none; }
  .cta { display: none; }
  .live-pill:not(.wide) { display: none; }
  .burger { display: flex; }
  .nav-inner {
    grid-template-columns: 1fr auto;
    height: 54px;
    gap: 12px;
  }
  .nav-actions { justify-self: end; }
  .brand-logo {
    height: 28px;
    max-width: min(140px, 34vw);
  }
}
@media (max-width: 400px) {
  .brand-logo {
    height: 26px;
    max-width: min(120px, 40vw);
  }
}
@media (prefers-reduced-motion: reduce) {
  .nav-shell, .burger span, .drawer-enter-active, .drawer-leave-active,
  .fade-enter-active, .fade-leave-active, .chev { transition: none; }
  .live-dot { animation: none; }
}
</style>
