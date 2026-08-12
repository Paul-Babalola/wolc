export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in')
          observer.unobserve(entry.target)
        }
      })
    },
    {threshold: 0.01, rootMargin: '0px 0px -40px 0px'},
  )

  function revealIfVisible(el: Element) {
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) return false

    const viewHeight = window.innerHeight || document.documentElement.clientHeight
    if (rect.top < viewHeight && rect.bottom > 0) {
      el.classList.add('in')
      return true
    }

    return false
  }

  const scan = () => {
    document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
      if (revealIfVisible(el)) return
      observer.observe(el)
    })
  }

  let scanTimer: ReturnType<typeof setTimeout> | undefined
  const scheduleScan = () => {
    clearTimeout(scanTimer)
    scanTimer = setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(scan)
      })
    }, 50)
  }

  const router = useRouter()
  router.afterEach(() => nextTick(scheduleScan))

  onNuxtReady(() => {
    scheduleScan()

    const mutationObserver = new MutationObserver((mutations) => {
      const hasRevealChange = mutations.some((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') return false
        return true
      })
      if (hasRevealChange) scheduleScan()
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })

    window.addEventListener('load', scheduleScan, {passive: true})
    window.addEventListener('resize', scheduleScan, {passive: true})
  })
})
