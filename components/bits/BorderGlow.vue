<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import './BorderGlow.css'

const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%']
const GRADIENT_KEYS = [
  '--gradient-one',
  '--gradient-two',
  '--gradient-three',
  '--gradient-four',
  '--gradient-five',
  '--gradient-six',
  '--gradient-seven',
]
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1]

interface Props {
  className?: string
  edgeSensitivity?: number
  glowColor?: string
  backgroundColor?: string
  borderRadius?: number
  glowRadius?: number
  glowIntensity?: number
  coneSpread?: number
  animated?: boolean
  colors?: string[]
  fillOpacity?: number
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  edgeSensitivity: 30,
  glowColor: '217 91 60',
  backgroundColor: '#ffffff',
  borderRadius: 22,
  glowRadius: 32,
  glowIntensity: 1,
  coneSpread: 25,
  animated: false,
  colors: () => ['#2563eb', '#38bdf8', '#818cf8'],
  fillOpacity: 0.45,
})

const cardRef = ref<HTMLElement | null>(null)

const cardClass = computed(() =>
  ['border-glow-card', props.className].filter(Boolean).join(' '),
)

function parseHSL(hslStr: string) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/)
  if (!match) return { h: 217, s: 91, l: 60 }
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) }
}

function buildGlowVars(glowColor: string, intensity: number) {
  const { h, s, l } = parseHSL(glowColor)
  const base = `${h}deg ${s}% ${l}%`
  const opacities = [100, 60, 50, 40, 30, 20, 10]
  const keys = ['--glow-color', '--glow-color-60', '--glow-color-50', '--glow-color-40', '--glow-color-30', '--glow-color-20', '--glow-color-10']
  const vars: Record<string, string> = {}
  for (let i = 0; i < opacities.length; i++) {
    vars[keys[i]] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`
  }
  return vars
}

function buildGradientVars(colors: string[]) {
  const vars: Record<string, string> = {}
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)]
    vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`
  }
  vars['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`
  return vars
}

const cardStyle = computed(() => ({
  '--card-bg': props.backgroundColor,
  '--edge-sensitivity': props.edgeSensitivity,
  '--border-radius': `${props.borderRadius}px`,
  '--glow-padding': `${props.glowRadius}px`,
  '--cone-spread': props.coneSpread,
  '--fill-opacity': props.fillOpacity,
  ...buildGlowVars(props.glowColor, props.glowIntensity),
  ...buildGradientVars(props.colors),
}))

function easeOutCubic(x: number) {
  return 1 - (1 - x) ** 3
}

function easeInCubic(x: number) {
  return x * x * x
}

function animateValue(options: {
  start?: number
  end?: number
  duration?: number
  delay?: number
  ease?: (x: number) => number
  onUpdate: (value: number) => void
  onEnd?: () => void
}) {
  const {
    start = 0,
    end = 100,
    duration = 1000,
    delay = 0,
    ease = easeOutCubic,
    onUpdate,
    onEnd,
  } = options
  const t0 = performance.now() + delay
  let frame = 0

  function tick() {
    const elapsed = performance.now() - t0
    const t = Math.min(elapsed / duration, 1)
    onUpdate(start + (end - start) * ease(t))
    if (t < 1) {
      frame = requestAnimationFrame(tick)
    } else if (onEnd) {
      onEnd()
    }
  }

  const timer = window.setTimeout(() => {
    frame = requestAnimationFrame(tick)
  }, delay)

  return () => {
    window.clearTimeout(timer)
    cancelAnimationFrame(frame)
  }
}

function getCenterOfElement(el: HTMLElement) {
  const { width, height } = el.getBoundingClientRect()
  return [width / 2, height / 2] as const
}

function getEdgeProximity(el: HTMLElement, x: number, y: number) {
  const [cx, cy] = getCenterOfElement(el)
  const dx = x - cx
  const dy = y - cy
  let kx = Infinity
  let ky = Infinity
  if (dx !== 0) kx = cx / Math.abs(dx)
  if (dy !== 0) ky = cy / Math.abs(dy)
  return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1)
}

function getCursorAngle(el: HTMLElement, x: number, y: number) {
  const [cx, cy] = getCenterOfElement(el)
  const dx = x - cx
  const dy = y - cy
  if (dx === 0 && dy === 0) return 0
  const radians = Math.atan2(dy, dx)
  let degrees = radians * (180 / Math.PI) + 90
  if (degrees < 0) degrees += 360
  return degrees
}

function handlePointerMove(event: PointerEvent) {
  const card = cardRef.value
  if (!card) return

  const rect = card.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const edge = getEdgeProximity(card, x, y)
  const angle = getCursorAngle(card, x, y)

  card.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`)
  card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`)
}

let cancelIntro: (() => void) | undefined

onMounted(() => {
  if (!props.animated || !cardRef.value) return

  const card = cardRef.value
  const angleStart = 110
  const angleEnd = 465
  card.classList.add('sweep-active')
  card.style.setProperty('--cursor-angle', `${angleStart}deg`)

  const stops: Array<() => void> = []
  stops.push(animateValue({ duration: 500, onUpdate: (v) => card.style.setProperty('--edge-proximity', `${v}`) }))
  stops.push(animateValue({
    ease: easeInCubic,
    duration: 1500,
    end: 50,
    onUpdate: (v) => card.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`),
  }))
  stops.push(animateValue({
    ease: easeOutCubic,
    delay: 1500,
    duration: 2250,
    start: 50,
    end: 100,
    onUpdate: (v) => card.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`),
  }))
  stops.push(animateValue({
    ease: easeInCubic,
    delay: 2500,
    duration: 1500,
    start: 100,
    end: 0,
    onUpdate: (v) => card.style.setProperty('--edge-proximity', `${v}`),
    onEnd: () => card.classList.remove('sweep-active'),
  }))

  cancelIntro = () => stops.forEach((stop) => stop())
})

onBeforeUnmount(() => {
  cancelIntro?.()
})
</script>

<template>
  <div
    ref="cardRef"
    :class="cardClass"
    :style="cardStyle"
    @pointermove="handlePointerMove"
  >
    <span class="edge-light" aria-hidden="true" />
    <div class="border-glow-inner">
      <slot />
    </div>
  </div>
</template>
