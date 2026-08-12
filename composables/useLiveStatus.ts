export function useLiveStatus(schedule?: {
  day?: number
  startHour?: number
  startMin?: number
  durationMin?: number
}) {
  const day = schedule?.day ?? 0
  const startHour = schedule?.startHour ?? 10
  const startMin = schedule?.startMin ?? 0
  const durationMin = schedule?.durationMin ?? 135

  const isLive = ref(false)
  let timer: ReturnType<typeof setInterval> | undefined

  function check() {
    const now = new Date()
    if (now.getDay() !== day) {
      isLive.value = false
      return
    }
    const start = new Date(now)
    start.setHours(startHour, startMin, 0, 0)
    const end = new Date(start.getTime() + durationMin * 60_000)
    isLive.value = now >= start && now <= end
  }

  onMounted(() => {
    check()
    timer = setInterval(check, 60_000)
  })
  onBeforeUnmount(() => timer && clearInterval(timer))

  return {isLive}
}
