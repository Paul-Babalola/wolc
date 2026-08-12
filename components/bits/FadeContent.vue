<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onBeforeUnmount, onMounted, ref } from 'vue'

if (import.meta.client) {
  gsap.registerPlugin(ScrollTrigger)
}

interface Props {
  className?: string
  container?: string | HTMLElement
  blur?: boolean
  duration?: number
  ease?: string
  delay?: number
  threshold?: number
  initialOpacity?: number
  disappearAfter?: number
  disappearDuration?: number
  disappearEase?: string
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  blur: false,
  duration: 1000,
  ease: 'power2.out',
  delay: 0,
  threshold: 0.1,
  initialOpacity: 0,
  disappearAfter: 0,
  disappearDuration: 0.5,
  disappearEase: 'power2.in',
})

const emit = defineEmits<{
  complete: []
  disappearanceComplete: []
}>()

const rootRef = ref<HTMLElement | null>(null)

let scrollTrigger: ScrollTrigger | null = null
let timeline: gsap.core.Timeline | null = null

function getSeconds(val: number) {
  return val > 10 ? val / 1000 : val
}

onMounted(() => {
  const el = rootRef.value
  if (!el || !import.meta.client) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set(el, { autoAlpha: 1, filter: 'blur(0px)' })
    emit('complete')
    return
  }

  let scrollerTarget: HTMLElement | Window | null = null
  if (props.container) {
    scrollerTarget = typeof props.container === 'string'
      ? document.querySelector(props.container)
      : props.container
  } else {
    scrollerTarget = document.getElementById('snap-main-container')
  }

  const startPct = (1 - props.threshold) * 100

  gsap.set(el, {
    autoAlpha: props.initialOpacity,
    filter: props.blur ? 'blur(10px)' : 'blur(0px)',
    willChange: 'opacity, filter, transform',
  })

  timeline = gsap.timeline({
    paused: true,
    delay: getSeconds(props.delay),
    onComplete: () => {
      emit('complete')
      if (props.disappearAfter > 0) {
        gsap.to(el, {
          autoAlpha: props.initialOpacity,
          filter: props.blur ? 'blur(10px)' : 'blur(0px)',
          delay: getSeconds(props.disappearAfter),
          duration: getSeconds(props.disappearDuration),
          ease: props.disappearEase,
          onComplete: () => emit('disappearanceComplete'),
        })
      }
    },
  })

  timeline.to(el, {
    autoAlpha: 1,
    filter: 'blur(0px)',
    duration: getSeconds(props.duration),
    ease: props.ease,
  })

  scrollTrigger = ScrollTrigger.create({
    trigger: el,
    scroller: scrollerTarget || window,
    start: `top ${startPct}%`,
    once: true,
    onEnter: () => timeline?.play(),
  })

  ScrollTrigger.refresh()
})

onBeforeUnmount(() => {
  scrollTrigger?.kill()
  timeline?.kill()
  if (rootRef.value) {
    gsap.killTweensOf(rootRef.value)
  }
})
</script>

<template>
  <div ref="rootRef" :class="['fade-content', className]">
    <slot />
  </div>
</template>

<style scoped>
.fade-content {
  opacity: 0;
}
</style>
