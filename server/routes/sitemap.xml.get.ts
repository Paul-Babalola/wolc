import {serverSupabaseServiceRole} from '#supabase/server'

const STATIC_ROUTES = [
  '/',
  '/about',
  '/visit',
  '/give',
  '/contact',
  '/prayer',
  '/membership',
  '/livestream',
  '/ministries',
  '/sermons',
  '/events',
  '/privacy',
]

const MINISTRY_SLUGS = ['children', 'youth', 'women', 'men', 'outreach', 'connect-group']

function xmlEscape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const base = String(config.public.siteUrl || 'https://rccgwolc.org').replace(/\/$/, '')

  const urls = new Set<string>([
    ...STATIC_ROUTES,
    ...MINISTRY_SLUGS.map((slug) => `/ministries/${slug}`),
  ])

  try {
    const {generateRecurringEvents, mergeEvents} = await import('../utils/recurringEvents')
    const {isDemoEventSlug} = await import('../utils/demoEvents')
    const client = serverSupabaseServiceRole(event)
    const {data} = await client
      .from('events')
      .select('id, slug')
      .eq('published', true)

    const dbEvents = (data ?? []).filter((row) => !isDemoEventSlug(row.slug))
    const recurring = generateRecurringEvents(16, new Date(), 12)
    const merged = mergeEvents(
      dbEvents.map((row) => ({
        ...row,
        title: '',
        starts_at: '',
        ends_at: null,
        location: null,
        summary: null,
        description: null,
        image_url: null,
        register_url: null,
        recurring: false,
      })),
      recurring,
    )

    for (const item of merged) {
      urls.add(item.recurring ? `/events/${item.id}` : `/events/${item.slug}`)
    }
  } catch {
    urls.add('/events/bible-study')
    urls.add('/events/sunday-service')
  }

  const body = [...urls]
    .map(
      (path) =>
        `  <url><loc>${xmlEscape(`${base}${path}`)}</loc><changefreq>weekly</changefreq></url>`,
    )
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
})
