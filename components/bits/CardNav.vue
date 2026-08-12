<script setup lang="ts">
import { gsap } from 'gsap'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import './CardNav.css'

export interface CardNavLink {
  label: string
  href: string
  ariaLabel?: string
}

export interface CardNavItem {
  label: string
  bgColor: string
  textColor: string
  links: CardNavLink[]
}

const props = withDefaults(
  defineProps<{
    logo: string
    logoAlt?: string
    items?: CardNavItem[]
    className?: string
    ease?: string
    baseColor?: string
    menuColor?: string
    buttonBgColor?: string
    buttonTextColor?: string
    ctaLabel?: string
    ctaHref?: string
  }>(),
  {
    logoAlt: 'Logo',
    items: () => [],
    className: '',
    ease: 'power3.out',
    baseColor: '#ffffff',
    menuColor: undefined,
    buttonBgColor: '#2563EB',
    buttonTextColor: '#ffffff',
    ctaLabel: 'Plan a visit',
    ctaHref: '/visit',
  },
)

const expanded = defineModel<boolean>('expanded', { default: false })

const route = useRoute()
const isHamburgerOpen = ref(false)
const navRef = ref<HTMLElement | null>(null)
const cardsRef = ref<(HTMLElement | null)[]>([])
const tlRef = ref<gsap.core.Timeline | null>(null)
const prefersReducedMotion = ref(false)

const TOP_BAR_HEIGHT = 54
const MOBILE_QUERY = '(max-width: 980px)'
const NAV_SHELL_OFFSET = 24

const displayItems = computed(() => props.items)

let lockedScrollY = 0
let resizeHandler: (() => void) | undefined

function setCardRef(index: number) {
  return (el: Element | null) => {
    cardsRef.value[index] = el as HTMLElement | null
  }
}

function getCards() {
  return cardsRef.value.filter((el): el is HTMLElement => Boolean(el))
}

function getMaxNavHeight() {
  return Math.max(TOP_BAR_HEIGHT + 120, window.innerHeight - NAV_SHELL_OFFSET)
}

function measureContentHeight(contentEl: HTMLElement) {
  const wasVisible = contentEl.style.visibility
  const wasPointerEvents = contentEl.style.pointerEvents
  const wasPosition = contentEl.style.position
  const wasHeight = contentEl.style.height

  contentEl.style.visibility = 'visible'
  contentEl.style.pointerEvents = 'auto'
  contentEl.style.position = 'static'
  contentEl.style.height = 'auto'

  void contentEl.offsetHeight

  const contentHeight = contentEl.scrollHeight

  contentEl.style.visibility = wasVisible
  contentEl.style.pointerEvents = wasPointerEvents
  contentEl.style.position = wasPosition
  contentEl.style.height = wasHeight

  return contentHeight
}

function calculateHeight() {
  const navEl = navRef.value
  if (!navEl) return 260

  const isMobile = window.matchMedia(MOBILE_QUERY).matches
  if (isMobile) {
    const contentEl = navEl.querySelector('.card-nav-content') as HTMLElement | null
    if (contentEl) {
      const padding = 16
      const natural = TOP_BAR_HEIGHT + measureContentHeight(contentEl) + padding
      return Math.min(natural, getMaxNavHeight())
    }
  }

  return 260
}

function applyOpenHeight() {
  if (!navRef.value) return
  navRef.value.style.height = `${calculateHeight()}px`
}

function createTimeline() {
  const navEl = navRef.value
  if (!navEl || prefersReducedMotion.value) return null

  const cards = getCards()
  gsap.set(navEl, { height: TOP_BAR_HEIGHT, overflow: 'hidden' })
  if (cards.length) gsap.set(cards, { y: 50, opacity: 0 })

  const tl = gsap.timeline({ paused: true })

  tl.to(navEl, {
    height: calculateHeight,
    duration: 0.4,
    ease: props.ease,
  })

  if (cards.length) {
    tl.to(
      cards,
      { y: 0, opacity: 1, duration: 0.4, ease: props.ease, stagger: 0.08 },
      '-=0.1',
    )
  }

  return tl
}

function rebuildTimeline(progress: number | null = null) {
  tlRef.value?.kill()
  const tl = createTimeline()
  tlRef.value = tl
  if (tl && progress === 1) tl.progress(1)
}

function lockPageScroll() {
  lockedScrollY = window.scrollY
  document.body.style.position = 'fixed'
  document.body.style.top = `-${lockedScrollY}px`
  document.body.style.left = '0'
  document.body.style.right = '0'
  document.body.style.width = '100%'
  document.documentElement.classList.add('nav-open')
}

function unlockPageScroll() {
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.left = ''
  document.body.style.right = ''
  document.body.style.width = ''
  document.documentElement.classList.remove('nav-open')
  window.scrollTo(0, lockedScrollY)
}

function openMenu() {
  if (expanded.value) return

  if (prefersReducedMotion.value) {
    isHamburgerOpen.value = true
    expanded.value = true
    nextTick(() => applyOpenHeight())
    return
  }

  const tl = tlRef.value
  if (!tl) return

  isHamburgerOpen.value = true
  expanded.value = true
  tl.play(0)
}

function closeMenu() {
  if (!expanded.value) return

  if (prefersReducedMotion.value) {
    isHamburgerOpen.value = false
    expanded.value = false
    if (navRef.value) navRef.value.style.height = `${TOP_BAR_HEIGHT}px`
    return
  }

  const tl = tlRef.value
  if (!tl) {
    isHamburgerOpen.value = false
    expanded.value = false
    return
  }

  isHamburgerOpen.value = false
  tl.eventCallback('onReverseComplete', () => {
    expanded.value = false
  })
  tl.reverse()
}

function toggleMenu() {
  expanded.value ? closeMenu() : openMenu()
}

function onLinkNavigate() {
  closeMenu()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && expanded.value) closeMenu()
}

watch(expanded, (open) => {
  if (!import.meta.client) return
  if (open) lockPageScroll()
  else unlockPageScroll()
})

watch(
  () => props.items,
  () => nextTick(() => rebuildTimeline(expanded.value ? 1 : null)),
  { deep: true },
)

watch(() => route.path, () => closeMenu())

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  nextTick(() => rebuildTimeline())
  window.addEventListener('keydown', onKeydown)

  resizeHandler = () => {
    if (!tlRef.value && !prefersReducedMotion.value) return
    if (expanded.value) {
      if (prefersReducedMotion.value) {
        applyOpenHeight()
        return
      }
      gsap.set(navRef.value, { height: calculateHeight() })
      rebuildTimeline(1)
    } else {
      rebuildTimeline()
    }
  }

  window.addEventListener('resize', resizeHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  tlRef.value?.kill()
  if (expanded.value) unlockPageScroll()
  else document.documentElement.classList.remove('nav-open')
})
</script>

<template>
  <div class="card-nav-container" :class="className">
    <nav
      ref="navRef"
      class="card-nav"
      :class="{ open: expanded, 'card-nav--reduced': prefersReducedMotion }"
      :style="{ backgroundColor: baseColor }"
    >
      <div class="card-nav-top">
        <button
          type="button"
          class="hamburger-menu"
          :class="{ open: isHamburgerOpen }"
          :aria-label="expanded ? 'Close menu' : 'Open menu'"
          :aria-expanded="expanded"
          :style="{ color: menuColor || 'var(--ink)' }"
          @click="toggleMenu"
        >
          <span class="hamburger-line" />
          <span class="hamburger-line" />
        </button>

        <NuxtLink
          :to="ctaHref"
          class="card-nav-cta-button"
          :style="{ backgroundColor: buttonBgColor, color: buttonTextColor }"
          @click="onLinkNavigate"
        >
          {{ ctaLabel }}
        </NuxtLink>

        <NuxtLink
          to="/"
          class="logo-container"
          aria-label="Word of Life Center — home"
          @click="onLinkNavigate"
        >
          <img :src="logo" :alt="logoAlt" class="logo" width="140" height="28">
        </NuxtLink>
      </div>

      <div class="card-nav-content" :aria-hidden="!expanded">
        <div
          v-for="(item, idx) in displayItems"
          :key="`${item.label}-${idx}`"
          :ref="setCardRef(idx)"
          class="nav-card"
          :style="{ backgroundColor: item.bgColor, color: item.textColor }"
        >
          <div class="nav-card-label">{{ item.label }}</div>
          <div class="nav-card-links">
            <NuxtLink
              v-for="(link, i) in item.links"
              :key="`${link.label}-${i}`"
              :to="link.href"
              class="nav-card-link"
              :aria-label="link.ariaLabel || link.label"
              @click="onLinkNavigate"
            >
              <svg class="nav-card-link-icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M7 17 17 7M17 7H9M17 7v8"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="nav-card-link-text">{{ link.label }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>
