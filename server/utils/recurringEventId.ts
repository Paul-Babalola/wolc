const RECURRING_EVENT_ID = /^([a-z0-9-]+)-(\d{4}-\d{2}-\d{2})$/

export function isRecurringEventId(id: string) {
  return RECURRING_EVENT_ID.test(id)
}

export function parseRecurringEventId(id: string) {
  const match = id.match(RECURRING_EVENT_ID)
  if (!match) return null
  return {
    slug: match[1],
    dateKey: match[2],
  }
}
