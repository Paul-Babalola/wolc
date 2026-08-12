import {generateRecurringEvents} from '../../utils/recurringEvents'

function formatIcsDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
}

export default defineEventHandler((event) => {
  const events = generateRecurringEvents(26)
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//RCCG Word of Life Center//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:RCCG Word of Life Center',
  ]

  for (const item of events) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${item.id}@rccgwolc.org`,
      `DTSTAMP:${formatIcsDate(new Date())}`,
      `DTSTART:${formatIcsDate(new Date(item.starts_at))}`,
      item.ends_at ? `DTEND:${formatIcsDate(new Date(item.ends_at))}` : '',
      `SUMMARY:${item.title.replace(/\n/g, ' ')}`,
      item.location ? `LOCATION:${item.location.replace(/\n/g, ' ')}` : '',
      item.summary ? `DESCRIPTION:${item.summary.replace(/\n/g, ' ')}` : '',
      'END:VEVENT',
    )
  }

  lines.push('END:VCALENDAR')

  setHeader(event, 'Content-Type', 'text/calendar; charset=utf-8')
  setHeader(event, 'Content-Disposition', 'attachment; filename="wolc-events.ics"')

  return lines.filter(Boolean).join('\r\n')
})
