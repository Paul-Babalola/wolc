import {serverSupabaseServiceRole} from '#supabase/server'
import {isDemoEventSlug} from '../../utils/demoEvents'
import {generateRecurringEvents, mergeEvents, type SiteEvent} from '../../utils/recurringEvents'

export default defineEventHandler(async (event) => {
  const {limit, includePast} = getQuery(event)
  const now = new Date()
  let dbEvents: SiteEvent[] = []

  try {
    const client = serverSupabaseServiceRole(event)
    let query = client
      .from('events')
      .select('id, slug, title, starts_at, ends_at, location, summary, description, image_url, register_url')
      .eq('published', true)
      .order('starts_at', {ascending: true})

    if (!includePast) {
      query = query.gte('starts_at', now.toISOString())
    }

    const {data, error} = await query
    if (error) throw error

    dbEvents = (data ?? [])
      .filter((row) => !isDemoEventSlug(row.slug))
      .map((row) => ({
        ...row,
        description: row.description ?? row.summary ?? null,
        recurring: false,
      }))
  } catch {
    dbEvents = []
  }

  const weeksBack = includePast ? 12 : 0
  const recurring = generateRecurringEvents(16, now, weeksBack)
  let events = mergeEvents(dbEvents, recurring)

  if (!includePast) {
    events = events.filter((item) => new Date(item.starts_at) >= now)
  }

  if (limit) {
    events = events.slice(0, Number(limit))
  }

  return events
})
