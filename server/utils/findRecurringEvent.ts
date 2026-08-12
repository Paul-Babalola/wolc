import {generateRecurringEvents, type SiteEvent} from './recurringEvents'
import {parseRecurringEventId} from './recurringEventId'

export function findRecurringEvent(eventKey: string): SiteEvent | null {
  if (!parseRecurringEventId(eventKey)) return null

  const now = new Date()
  const events = generateRecurringEvents(52, now, 52)
  return events.find((item) => item.id === eventKey) ?? null
}
