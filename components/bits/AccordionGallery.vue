<script setup lang="ts">
import { gsap } from 'gsap'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import './AccordionGallery.css'

export type AccordionGalleryItem = {
  image: string
  label?: string
  description?: string
  link?: string
  alt?: string
}

interface Props {
  items?: AccordionGalleryItem[]
  defaultIndex?: number
  accentColor?: string
  overlayColor?: string
  textColor?: string
  height?: number
  gap?: number
  radius?: number
  expandRatio?: number
  orientation?: 'horizontal' | 'vertical'
  duration?: number
  ease?: string
  parallax?: number
  tilt?: number
  stagger?: number
  trigger?: 'hover' | 'click'
  showLabels?: boolean
  grayscale?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [
    { image: 'https://picsum.photos/id/1015/900/1200', label: 'Canyon', link: '#' },
    { image: 'https://picsum.photos/id/1018/900/1200', label: 'Ridgeline', link: '#' },
    { image: 'https://picsum.photos/id/1039/900/1200', label: 'Falls', link: '#' },
    { image: 'https://picsum.photos/id/1043/900/1200', label: 'Harbour', link: '#' },
    { image: 'https://picsum.photos/id/1044/900/1200', label: 'Skyline', link: '#' },
  ],
  defaultIndex: 2,
  accentColor: '#ffffff',
  overlayColor: '#060010',
  textColor: '#ffffff',
  height: 460,
  gap: 10,
  radius: 16,
  expandRatio: 0.52,
  orientation: 'horizontal',
  duration: 0.6,
  ease: 'power3.out',
  parallax: 0.5,
  tilt: 8,
  stagger: 0.06,
  trigger: 'hover',
  showLabels: true,
  grayscale: true,
  className: '',
})

const rootRef = ref<HTMLElement | null>(null)
const panelRefs = ref<(HTMLElement | null)[]>([])
const mediaRefs = ref<(HTMLElement | null)[]>([])
const barRefs = ref<(HTMLElement | null)[]>([])
const textRefs = ref<(HTMLElement | null)[]>([])
const descRefs = ref<(HTMLElement | null)[]>([])

const count = computed(() => props.items.length)
const vertical = computed(() => props.orientation === 'vertical')
const rootClass = computed(() =>
  [
    'accordion-gallery',
    vertical.value ? 'accordion-gallery--vertical' : '',
    props.className,
  ].filter(Boolean).join(' '),
)

const rootStyle = computed(() => ({
  '--ag-accent': props.accentColor,
  '--ag-overlay': props.overlayColor,
  '--ag-text': props.textColor,
  '--ag-gap': `${props.gap}px`,
  '--ag-radius': `${props.radius}px`,
  height: vertical.value ? `${Math.round(props.height * 1.6)}px` : `${props.height}px`,
}))

const active = ref(
  Math.min(Math.max(props.defaultIndex, 0), Math.max(props.items.length - 1, 0)),
)

const prefersReduced = ref(false)
const firstRun = ref(true)
const mediaSize = ref(320)

let timeline: gsap.core.Timeline | null = null
let resizeObserver: ResizeObserver | null = null

function setPanelRef(el: Element | null, index: number) {
  panelRefs.value[index] = el as HTMLElement | null
}

function setMediaRef(el: Element | null, index: number) {
  mediaRefs.value[index] = el as HTMLElement | null
}

function setBarRef(el: Element | null, index: number) {
  barRefs.value[index] = el as HTMLElement | null
}

function setTextRef(el: Element | null, index: number) {
  textRefs.value[index] = el as HTMLElement | null
}

function setDescRef(el: Element | null, index: number) {
  descRefs.value[index] = el as HTMLElement | null
}

function applyLayout(animate: boolean) {
  const panels = panelRefs.value.filter(Boolean) as HTMLElement[]
  if (!panels.length) return

  const r = Math.min(Math.max(props.expandRatio, 0.2), 0.9)
  const grow = count.value > 1 ? (r * (count.value - 1)) / (1 - r) : 1
  const dur = animate && !prefersReduced.value ? props.duration : 0

  timeline?.kill()
  timeline = gsap.timeline()

  panels.forEach((panel, i) => {
    const isActive = i === active.value
    const media = mediaRefs.value[i]
    const bar = barRefs.value[i]
    const text = textRefs.value[i]
    const desc = descRefs.value[i]

    const rot = isActive ? 0 : i < active.value ? props.tilt : -props.tilt
    const rotProp = vertical.value ? { rotateX: -rot } : { rotateY: rot }

    timeline!.to(
      panel,
      { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease: props.ease },
      0,
    )

    if (media) {
      const drift = Math.max(-1.5, Math.min(1.5, active.value - i))
      const shift = drift * props.parallax * mediaSize.value * 0.06
      const gray = props.grayscale ? (isActive ? 0 : 1) : 0
      timeline!.to(
        media,
        {
          xPercent: -50,
          yPercent: -50,
          x: vertical.value ? 0 : isActive ? 0 : shift,
          y: vertical.value ? (isActive ? 0 : shift) : 0,
          '--ag-gray': gray,
          '--ag-dim': isActive ? 0 : 0.35,
          duration: dur,
          ease: props.ease,
        },
        0,
      )
    }

    if (props.showLabels && bar && text) {
      const labelTargets = desc ? [bar, text, desc] : [bar, text]
      if (isActive) {
        timeline!.to(
          labelTargets,
          {
            opacity: 1,
            x: 0,
            duration: dur,
            ease: props.ease,
            stagger: prefersReduced.value ? 0 : props.stagger,
          },
          0,
        )
      } else {
        timeline!.to(
          labelTargets,
          { opacity: 0, x: -14, duration: dur * 0.6, ease: props.ease },
          0,
        )
      }
    }
  })
}

function measure() {
  const el = rootRef.value
  if (!el) return

  const rect = el.getBoundingClientRect()
  const total = vertical.value ? rect.height : rect.width
  const usable = Math.max(total - props.gap * (count.value - 1), 120)
  const size = Math.max(
    140,
    usable * Math.min(Math.max(props.expandRatio, 0.2), 0.9) * 1.22,
  )
  mediaSize.value = size
  el.style.setProperty('--ag-media-size', `${size}px`)
  applyLayout(!firstRun.value)
}

function handleEnter(index: number) {
  if (props.trigger === 'hover') active.value = index
}

function handleClick(index: number, event: MouseEvent) {
  if (index !== active.value) {
    event.preventDefault()
    active.value = index
  }
}

function handleKeyDown(index: number, event: KeyboardEvent) {
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault()
    active.value = (index + 1) % count.value
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault()
    active.value = (index - 1 + count.value) % count.value
  }
}

onMounted(() => {
  prefersReduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  nextTick(() => {
    measure()
    if (rootRef.value) {
      resizeObserver = new ResizeObserver(measure)
      resizeObserver.observe(rootRef.value)
    }
    applyLayout(false)
    firstRun.value = false
  })
})

watch(active, () => applyLayout(true))

watch(
  () => [
    props.items,
    props.expandRatio,
    props.gap,
    props.orientation,
    props.duration,
    props.ease,
    props.parallax,
    props.tilt,
    props.grayscale,
    props.showLabels,
    props.stagger,
  ],
  () => nextTick(measure),
)

onBeforeUnmount(() => {
  timeline?.kill()
  resizeObserver?.disconnect()
})
</script>

<template>
  <div
    ref="rootRef"
    :class="rootClass"
    :style="rootStyle"
    role="list"
    aria-label="Image accordion gallery"
  >
    <component
      :is="item.link ? 'a' : 'div'"
      v-for="(item, i) in items"
      :key="`${item.label || item.image}-${i}`"
      :ref="(el) => setPanelRef(el as Element | null, i)"
      class="ag-panel"
      :class="{ 'ag-panel--active': i === active }"
      :style="{ borderRadius: `${radius}px` }"
      :href="item.link || undefined"
      role="listitem"
      tabindex="0"
      :aria-current="i === active ? 'true' : undefined"
      :aria-label="item.label"
      @click="handleClick(i, $event)"
      @mouseenter="handleEnter(i)"
      @focus="active = i"
      @keydown="handleKeyDown(i, $event)"
    >
      <span class="ag-panel__frame">
        <span
          class="ag-panel__media"
          :ref="(el) => setMediaRef(el as Element | null, i)"
        >
          <img
            :src="item.image"
            :alt="item.alt || item.label || ''"
            draggable="false"
          >
        </span>
        <span class="ag-panel__overlay" aria-hidden="true" />
      </span>

      <span v-if="showLabels" class="ag-panel__label" aria-hidden="true">
        <span
          class="ag-panel__bar"
          :ref="(el) => setBarRef(el as Element | null, i)"
        />
        <span class="ag-panel__copy">
          <span
            class="ag-panel__text"
            :ref="(el) => setTextRef(el as Element | null, i)"
          >
            {{ item.label }}
          </span>
          <span
            v-if="item.description"
            class="ag-panel__desc"
            :ref="(el) => setDescRef(el as Element | null, i)"
          >
            {{ item.description }}
          </span>
        </span>
      </span>
    </component>
  </div>
</template>
