import {serverSupabaseServiceRole} from '#supabase/server'
import {requireAdmin} from '~/server/utils/admin'
import {weekAgoIso} from '~/server/utils/adminFormat'

async function countRows(
  client: ReturnType<typeof serverSupabaseServiceRole>,
  table: string,
  filter?: (query: ReturnType<typeof client.from>) => ReturnType<typeof client.from>,
) {
  let query = client.from(table).select('id', {count: 'exact', head: true})
  if (filter) query = filter(query)
  const {count, error} = await query
  if (error) return 0
  return count ?? 0
}

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const client = serverSupabaseServiceRole(event)
  const weekAgo = weekAgoIso()
  const now = new Date().toISOString()

  const [
    eventsTotal,
    eventsUpcoming,
    rsvpsWeek,
    rsvpsTotal,
    recurringWeek,
    contactUnhandled,
    contactWeek,
    prayerUnhandled,
    prayerWeek,
    newsletterTotal,
    newsletterWeek,
  ] = await Promise.all([
    countRows(client, 'events'),
    countRows(client, 'events', (query) => query.gte('starts_at', now)),
    countRows(client, 'rsvps', (query) => query.gte('created_at', weekAgo)),
    countRows(client, 'rsvps'),
    countRows(client, 'recurring_rsvps', (query) => query.gte('created_at', weekAgo)),
    countRows(client, 'contact_messages', (query) => query.is('handled_at', null)),
    countRows(client, 'contact_messages', (query) => query.gte('created_at', weekAgo)),
    countRows(client, 'prayer_requests', (query) => query.is('handled_at', null)),
    countRows(client, 'prayer_requests', (query) => query.gte('created_at', weekAgo)),
    countRows(client, 'newsletter_subscribers'),
    countRows(client, 'newsletter_subscribers', (query) => query.gte('created_at', weekAgo)),
  ])

  return {
    events: {total: eventsTotal, upcoming: eventsUpcoming},
    rsvps: {week: rsvpsWeek + recurringWeek, total: rsvpsTotal, recurringWeek},
    inbox: {unhandled: contactUnhandled, week: contactWeek},
    prayer: {unhandled: prayerUnhandled, week: prayerWeek},
    newsletter: {total: newsletterTotal, week: newsletterWeek},
  }
})
