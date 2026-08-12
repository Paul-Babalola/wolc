import {legacyGonePrefixes} from '../../config/wordpress-redirects'

export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname

  if (path === '/events' || path.startsWith('/events/')) {
    const query = getQuery(event)
    if (query.ical === '1' || query.ical === 1) {
      return sendRedirect(event, '/api/events/calendar.ics', 301)
    }
  }

  const isGone = legacyGonePrefixes.some(
    (prefix) => path === prefix.replace(/\/$/, '') || path.startsWith(prefix),
  )

  if (isGone) {
    throw createError({statusCode: 410, statusMessage: 'This URL is no longer available.'})
  }
})
