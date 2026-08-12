<script setup lang="ts">
const props = defineProps<{item: any}>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const btn = ref<HTMLElement | null>(null)
const route = useRoute()
let hoverTimer: ReturnType<typeof setTimeout> | undefined

const isActive = computed(() => {
  const paths = [props.item.href, ...(props.item.children?.map((c: any) => c.href) || [])]
  return paths.some((p) => p && (route.path === p || route.path.startsWith(p + '/')))
})

function openNow() {
  clearTimeout(hoverTimer)
  open.value = true
}
function closeSoon() {
  hoverTimer = setTimeout(() => (open.value = false), 120)
}
function toggle() {
  open.value = !open.value
}
function close() {
  open.value = false
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) {
    close()
    ;(btn.value as HTMLElement | null)?.focus()
  }
}
function onDocClick(e: MouseEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) close()
}

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))

watch(() => route.path, close)
</script>

<template>
  <div
    ref="root"
    class="dd"
    @mouseenter="openNow"
    @mouseleave="closeSoon"
    @keydown="onKeydown"
    @focusin="openNow"
    @focusout="closeSoon"
  >
    <button
      ref="btn"
      class="dd-trigger"
      :class="{active: isActive}"
      :aria-expanded="open"
      aria-haspopup="true"
      @click="toggle"
    >
      {{ item.label }}
      <svg class="chev" :class="{flip: open}" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <Transition name="dd-fade">
      <div v-show="open" class="dd-menu-wrap">
        <div class="dd-menu" role="menu">
          <p class="dd-heading">{{ item.label }}</p>
          <NuxtLink
            v-for="child in item.children"
            :key="child.href"
            :to="child.href"
            role="menuitem"
            class="dd-item"
            @click="close"
          >
            <span class="dd-label">{{ child.label }}</span>
            <span v-if="child.description" class="dd-desc">{{ child.description }}</span>
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dd { position: relative; }

.dd-trigger {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--ink-2);
  font-family: var(--body);
  font-size: 0.84rem;
  font-weight: 500;
  padding: 6px 11px;
  border-radius: 999px;
  transition: color 0.2s, background 0.2s, box-shadow 0.2s;
}
.dd-trigger:hover,
.dd-trigger.active {
  color: var(--blue);
  background: var(--blue-soft);
}
.chev { transition: transform 0.2s ease; opacity: 0.65; }
.chev.flip { transform: rotate(180deg); }

.dd-menu-wrap {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}
.dd-menu-wrap::before {
  content: "";
  position: absolute;
  top: -14px;
  left: 0;
  right: 0;
  height: 14px;
}

.dd-menu {
  min-width: 260px;
  padding: 12px;
  border-radius: 18px;
  background: var(--white);
  border: 1px solid var(--line);
  box-shadow: 0 16px 48px rgba(var(--blue-rgb), 0.14);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.dd-heading {
  width: 100%;
  text-align: center;
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--blue);
  padding: 2px 8px 8px;
  border-bottom: 1px solid rgba(var(--blue-rgb), 0.08);
  margin-bottom: 2px;
}

.dd-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 3px;
  width: 100%;
  padding: 10px 14px;
  border-radius: 12px;
  transition: background 0.18s ease, transform 0.18s ease;
}
.dd-item:hover {
  background: var(--blue-soft);
  transform: translateY(-1px);
}
.dd-label {
  font-weight: 600;
  font-size: 0.88rem;
  color: var(--ink);
}
.dd-desc {
  font-size: 0.78rem;
  color: var(--muted);
  line-height: 1.4;
  max-width: 210px;
}

.dd-fade-enter-active,
.dd-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.dd-fade-enter-from,
.dd-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}

@media (prefers-reduced-motion: reduce) {
  .dd-fade-enter-active,
  .dd-fade-leave-active { transition: none; }
  .chev { transition: none; }
  .dd-item:hover { transform: none; }
}
</style>
