<script setup lang="ts">
import { gsap } from 'gsap'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import './TextType.css'

type TagName = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'

interface Props {
  text: string | string[]
  as?: TagName
  typingSpeed?: number
  initialDelay?: number
  pauseDuration?: number
  deletingSpeed?: number
  loop?: boolean
  sequential?: boolean
  className?: string
  showCursor?: boolean
  hideCursorWhileTyping?: boolean
  cursorCharacter?: string
  cursorClassName?: string
  cursorBlinkDuration?: number
  textColors?: string[]
  variableSpeed?: { min: number; max: number }
  startOnVisible?: boolean
  reverseMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  typingSpeed: 50,
  initialDelay: 0,
  pauseDuration: 2000,
  deletingSpeed: 30,
  loop: true,
  sequential: false,
  className: '',
  showCursor: true,
  hideCursorWhileTyping: false,
  cursorCharacter: '|',
  cursorClassName: '',
  cursorBlinkDuration: 0.5,
  textColors: () => [],
  startOnVisible: false,
  reverseMode: false,
})

const emit = defineEmits<{
  'sentence-complete': [sentence: string, index: number]
  'animation-complete': []
}>()

const displayedText = ref('')
const completedLines = ref<string[]>([])
const activeLineText = ref('')
const currentCharIndex = ref(0)
const isDeleting = ref(false)
const currentTextIndex = ref(0)
const isVisible = ref(!props.startOnVisible)
const isTyping = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const cursorRef = ref<HTMLElement | null>(null)
const animationCompleted = ref(false)
const reducedMotion = ref(false)

const textArray = computed(() =>
  Array.isArray(props.text) ? props.text : [props.text],
)

const elClass = computed(() =>
  ['text-type', props.className].filter(Boolean).join(' '),
)

const cursorClass = computed(() =>
  [
    'text-type__cursor',
    props.cursorClassName,
    shouldHideCursor.value ? 'text-type__cursor--hidden' : '',
  ].filter(Boolean).join(' '),
)

const currentTextColor = computed(() => {
  if (props.textColors.length === 0) return undefined
  return props.textColors[currentTextIndex.value % props.textColors.length]
})

const shouldHideCursor = computed(() => {
  if (!props.hideCursorWhileTyping) return false
  if (props.sequential) {
    const currentText = textArray.value[currentTextIndex.value] ?? ''
    return isTyping.value && currentCharIndex.value < currentText.length
  }
  const currentText = textArray.value[currentTextIndex.value] ?? ''
  return currentCharIndex.value < currentText.length || isDeleting.value
})

const showActiveCursor = computed(() =>
  props.showCursor && isTyping.value && !animationCompleted.value,
)

const showFinalCursor = computed(() =>
  props.showCursor && props.sequential && animationCompleted.value,
)

function getRandomSpeed() {
  if (!props.variableSpeed) return props.typingSpeed
  const { min, max } = props.variableSpeed
  return Math.random() * (max - min) + min
}

let cursorTween: gsap.core.Tween | null = null
let observer: IntersectionObserver | null = null
let timeout: ReturnType<typeof setTimeout> | undefined

function setupCursorBlink() {
  if (!props.showCursor || !cursorRef.value || reducedMotion.value) return
  cursorTween?.kill()
  gsap.set(cursorRef.value, { opacity: 1 })
  cursorTween = gsap.to(cursorRef.value, {
    opacity: 0,
    duration: props.cursorBlinkDuration,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut',
  })
}

function markAnimationComplete() {
  if (animationCompleted.value) return
  animationCompleted.value = true
  isTyping.value = false
  emit('animation-complete')
}

function resetTypingState() {
  clearTimeout(timeout)
  displayedText.value = ''
  completedLines.value = []
  activeLineText.value = ''
  currentCharIndex.value = 0
  isDeleting.value = false
  currentTextIndex.value = 0
  isTyping.value = false
  animationCompleted.value = false
}

function getProcessedText(index: number) {
  const currentText = textArray.value[index] ?? ''
  return props.reverseMode ? currentText.split('').reverse().join('') : currentText
}

function runSequentialTyping() {
  if (!isVisible.value || reducedMotion.value) return

  clearTimeout(timeout)

  if (currentTextIndex.value >= textArray.value.length) {
    markAnimationComplete()
    return
  }

  const processedText = getProcessedText(currentTextIndex.value)
  isTyping.value = true

  if (currentCharIndex.value < processedText.length) {
    timeout = setTimeout(() => {
      activeLineText.value += processedText[currentCharIndex.value]
      currentCharIndex.value += 1
      runSequentialTyping()
    }, props.variableSpeed ? getRandomSpeed() : props.typingSpeed)
    return
  }

  completedLines.value = [...completedLines.value, processedText]
  activeLineText.value = ''
  emit('sentence-complete', processedText, currentTextIndex.value)

  if (currentTextIndex.value === textArray.value.length - 1) {
    isTyping.value = false
    markAnimationComplete()
    nextTick(setupCursorBlink)
    return
  }

  currentTextIndex.value += 1
  currentCharIndex.value = 0
  timeout = setTimeout(runSequentialTyping, props.pauseDuration)
}

function runTypingAnimation() {
  if (!isVisible.value || reducedMotion.value) return

  if (props.sequential) {
    runSequentialTyping()
    return
  }

  clearTimeout(timeout)

  const processedText = getProcessedText(currentTextIndex.value)

  if (isDeleting.value) {
    if (displayedText.value === '') {
      isDeleting.value = false
      if (currentTextIndex.value === textArray.value.length - 1 && !props.loop) {
        return
      }

      emit('sentence-complete', textArray.value[currentTextIndex.value], currentTextIndex.value)

      currentTextIndex.value = (currentTextIndex.value + 1) % textArray.value.length
      currentCharIndex.value = 0
      timeout = setTimeout(runTypingAnimation, props.pauseDuration)
      return
    }

    timeout = setTimeout(() => {
      displayedText.value = displayedText.value.slice(0, -1)
      runTypingAnimation()
    }, props.deletingSpeed)
    return
  }

  if (currentCharIndex.value < processedText.length) {
    timeout = setTimeout(() => {
      displayedText.value += processedText[currentCharIndex.value]
      currentCharIndex.value += 1
      runTypingAnimation()
    }, props.variableSpeed ? getRandomSpeed() : props.typingSpeed)
    return
  }

  if (textArray.value.length >= 1) {
    if (!props.loop && currentTextIndex.value === textArray.value.length - 1) {
      markAnimationComplete()
      return
    }
    timeout = setTimeout(() => {
      isDeleting.value = true
      runTypingAnimation()
    }, props.pauseDuration)
  }
}

function startTyping() {
  if (props.sequential) {
    runSequentialTyping()
    return
  }
  if (currentCharIndex.value === 0 && !isDeleting.value && displayedText.value === '') {
    timeout = setTimeout(runTypingAnimation, props.initialDelay)
  } else {
    runTypingAnimation()
  }
}

onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reducedMotion.value) {
    if (props.sequential) {
      completedLines.value = [...textArray.value]
      activeLineText.value = ''
    } else {
      displayedText.value = textArray.value.join('\n')
    }
    isVisible.value = true
    markAnimationComplete()
    return
  }

  if (props.startOnVisible && containerRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) isVisible.value = true
        })
      },
      { threshold: 0.1 },
    )
    observer.observe(containerRef.value)
  }

  timeout = setTimeout(startTyping, props.initialDelay)
  nextTick(setupCursorBlink)
})

watch(
  () => [props.showCursor, props.cursorBlinkDuration, isTyping.value, animationCompleted.value],
  () => nextTick(setupCursorBlink),
)

watch(isVisible, (visible) => {
  if (!visible || reducedMotion.value) return
  timeout = setTimeout(startTyping, props.initialDelay)
})

watch(
  () => props.text,
  () => {
    if (reducedMotion.value) {
      if (props.sequential) {
        completedLines.value = [...textArray.value]
      } else {
        displayedText.value = textArray.value.join('\n')
      }
      return
    }
    resetTypingState()
    timeout = setTimeout(startTyping, props.initialDelay)
  },
)

onBeforeUnmount(() => {
  clearTimeout(timeout)
  observer?.disconnect()
  cursorTween?.kill()
})
</script>

<template>
  <component :is="as" ref="containerRef" :class="elClass">
    <template v-if="sequential">
      <span
        v-for="(line, index) in completedLines"
        :key="`line-${index}`"
        class="text-type__line"
        :style="textColors.length ? { color: textColors[index % textColors.length] } : undefined"
      >
        {{ line }}<span
          v-if="showFinalCursor && index === completedLines.length - 1"
          ref="cursorRef"
          :class="cursorClass"
          aria-hidden="true"
        >{{ cursorCharacter }}</span>
      </span>

      <span
        v-if="activeLineText || (isTyping && !animationCompleted)"
        class="text-type__line text-type__line--active"
        :style="currentTextColor ? { color: currentTextColor } : undefined"
      >
        <span class="text-type__content">{{ activeLineText }}</span>
        <span
          v-if="showActiveCursor"
          ref="cursorRef"
          :class="cursorClass"
          aria-hidden="true"
        >
          {{ cursorCharacter }}
        </span>
      </span>
    </template>

    <template v-else>
      <span
        class="text-type__content"
        :style="currentTextColor ? { color: currentTextColor } : undefined"
      >
        {{ displayedText }}
      </span>
      <span
        v-if="showCursor"
        ref="cursorRef"
        :class="cursorClass"
        aria-hidden="true"
      >
        {{ cursorCharacter }}
      </span>
    </template>
  </component>
</template>
