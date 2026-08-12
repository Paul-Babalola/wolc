export type SiteEvent = {
  id: string
  slug: string
  title: string
  starts_at: string
  ends_at: string | null
  location: string | null
  summary: string | null
  description: string | null
  image_url: string | null
  register_url: string | null
  recurring: boolean
}

type RecurringTemplate = {
  slug: string
  title: string
  summary: string
  location: string | null
  image_url: string | null
  dayOfWeek: number
  startHour: number
  startMinute: number
  endHour: number
  endMinute: number
}

const TEMPLATES: RecurringTemplate[] = [
  {
    slug: 'bible-study',
    title: 'Bible Study',
    summary: 'Bible study services are held weekly at 7 p.m. primarily on YouTube and Facebook. Join us every Wednesday for a refreshing bible study experience.',
    location: null,
    image_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    dayOfWeek: 3,
    startHour: 19,
    startMinute: 0,
    endHour: 20,
    endMinute: 0,
  },
  {
    slug: 'sunday-service',
    title: 'Sunday Service',
    summary: 'Sunday worship services are held weekly at 10 a.m. at the church auditorium. Join us this Sunday and experience an amazing worship experience.',
    location: 'RCCG WOLC, 11313 Lockwood Dr, Silver Spring, MD, United States',
    image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    dayOfWeek: 0,
    startHour: 10,
    startMinute: 0,
    endHour: 11,
    endMinute: 30,
  },
]

function atLocalTime(date: Date, hour: number, minute: number) {
  const next = new Date(date)
  next.setHours(hour, minute, 0, 0)
  return next
}

function nextOccurrence(template: RecurringTemplate, from: Date) {
  const cursor = new Date(from)
  cursor.setHours(0, 0, 0, 0)

  for (let i = 0; i < 14; i++) {
    const day = new Date(cursor)
    day.setDate(cursor.getDate() + i)
    if (day.getDay() !== template.dayOfWeek) continue

    const starts = atLocalTime(day, template.startHour, template.startMinute)
    const ends = atLocalTime(day, template.endHour, template.endMinute)
    if (starts >= from) {
      return {starts, ends}
    }
  }

  return null
}

export function generateRecurringEvents(weeksForward = 12, from = new Date(), weeksBack = 0): SiteEvent[] {
  const events: SiteEvent[] = []
  const start = new Date(from)
  start.setDate(start.getDate() - weeksBack * 7)
  start.setHours(0, 0, 0, 0)

  const horizon = new Date(from)
  horizon.setDate(horizon.getDate() + weeksForward * 7)

  for (const template of TEMPLATES) {
    let cursor = new Date(start)
    while (cursor <= horizon) {
      const occurrence = nextOccurrence(template, cursor)
      if (!occurrence) break

      const {starts, ends} = occurrence
      const dateKey = starts.toISOString().slice(0, 10)

      events.push({
        id: `${template.slug}-${dateKey}`,
        slug: template.slug,
        title: template.title,
        starts_at: starts.toISOString(),
        ends_at: ends.toISOString(),
        location: template.location,
        summary: template.summary,
        description: template.summary,
        image_url: template.image_url,
        register_url: null,
        recurring: true,
      })

      cursor = new Date(starts)
      cursor.setDate(cursor.getDate() + 1)
    }
  }

  return events
}

export function mergeEvents(dbEvents: SiteEvent[], recurring: SiteEvent[]) {
  const merged = [...recurring, ...dbEvents.map((event) => ({...event, recurring: false}))]
  return merged.sort(
    (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
  )
}
