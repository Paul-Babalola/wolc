export function useHeaderScroll(options?: {threshold?: number; hideAfter?: number}) {
  const threshold = options?.threshold ?? 10
  const hideAfter = options?.hideAfter ?? 180

  const scrolled = ref(false)
  const hidden = ref(false)
  let lastY = 0

  function onScroll() {
    const y = window.scrollY
    scrolled.value = y > threshold
    hidden.value = y > lastY && y > hideAfter
    lastY = y
  }

  onMounted(() => {
    lastY = window.scrollY
    window.addEventListener('scroll', onScroll, {passive: true})
    onScroll()
  })
  onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

  return {scrolled, hidden}
}
