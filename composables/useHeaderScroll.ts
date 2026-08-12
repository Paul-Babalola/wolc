export function useHeaderScroll(options?: {threshold?: number; hideAfter?: number; paused?: Ref<boolean>}) {
  const threshold = options?.threshold ?? 10
  const hideAfter = options?.hideAfter ?? 180

  const scrolled = ref(false)
  const hidden = ref(false)
  let lastY = 0

  function onScroll() {
    if (options?.paused?.value) return

    const y = window.scrollY
    scrolled.value = y > threshold
    hidden.value = y > lastY && y > hideAfter
    lastY = y
  }

  function resetHidden() {
    hidden.value = false
    lastY = window.scrollY
  }

  onMounted(() => {
    lastY = window.scrollY
    window.addEventListener('scroll', onScroll, {passive: true})
    onScroll()
  })
  onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

  return {scrolled, hidden, resetHidden}
}
