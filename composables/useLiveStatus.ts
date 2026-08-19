const DEFAULT_WINDOWS = [
  { day: 0, startHour: 10, startMin: 0, durationMin: 150 },  // Sunday worship 10:00 AM – 12:30 PM
  { day: 3, startHour: 19, startMin: 0, durationMin: 120 },  // Wednesday Bible study 7:00 PM – 9:00 PM
]

export function useLiveStatus(windows = DEFAULT_WINDOWS) {
  const isLive = ref(false)
  let timer: ReturnType<typeof setInterval> | undefined

  function check() {
    const now = new Date()
    const day = now.getDay()
    isLive.value = windows.some(w => {
      if (day !== w.day) return false
      const start = new Date(now)
      start.setHours(w.startHour, w.startMin, 0, 0)
      const end = new Date(start.getTime() + w.durationMin * 60_000)
      return now >= start && now <= end
    })
  }

  onMounted(() => {
    check()
    timer = setInterval(check, 60_000)
  })
  onBeforeUnmount(() => timer && clearInterval(timer))

  return { isLive }
}
