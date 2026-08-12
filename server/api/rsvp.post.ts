import {z} from 'zod'
import {serverSupabaseServiceRole} from '#supabase/server'
import {findRecurringEvent} from '~/server/utils/findRecurringEvent'
import {notifyStaff} from '~/server/utils/notify'
import {isRecurringEventId} from '~/server/utils/recurringEventId'
import {guardPublicForm} from '~/server/utils/spam'
import {parseValidatedJson} from '~/server/utils/validate'

const schema = z.object({
  eventId: z.string().min(1).max(120),
  name: z.string().min(1).max(120),
  email: z.string().email(),
  guests: z.number().int().min(1).max(20).default(1),
  website: z.string().max(200).optional(),
})

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))
}

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event)
  if (guardPublicForm(event, rawBody)) return {ok: true}
  const body = parseValidatedJson(rawBody, schema)
  const client = serverSupabaseServiceRole(event)

  if (isRecurringEventId(body.eventId)) {
    const recurringEvent = findRecurringEvent(body.eventId)
    if (!recurringEvent) {
      throw createError({statusCode: 404, statusMessage: 'Event not found'})
    }

    const {error} = await client.from('recurring_rsvps').insert({
      event_key: recurringEvent.id,
      slug: recurringEvent.slug,
      starts_at: recurringEvent.starts_at,
      name: body.name,
      email: body.email,
      guests: body.guests,
    })
    if (error) throw createError({statusCode: 500, statusMessage: error.message})

    await notifyStaff(event, {
      subject: `RSVP: ${recurringEvent.title}`,
      lines: [
        `New RSVP for ${recurringEvent.title}`,
        `When: ${formatWhen(recurringEvent.starts_at)}`,
        `Name: ${body.name}`,
        `Email: ${body.email}`,
        `Guests: ${body.guests}`,
      ],
    })

    return {ok: true}
  }

  const eventId = z.string().uuid().safeParse(body.eventId)
  if (!eventId.success) {
    throw createError({statusCode: 400, statusMessage: 'eventId: Invalid event id'})
  }

  const {data: dbEvent, error: lookupError} = await client
    .from('events')
    .select('id, title, starts_at')
    .eq('id', eventId.data)
    .single()

  if (lookupError || !dbEvent) {
    throw createError({statusCode: 404, statusMessage: 'Event not found'})
  }

  const {error} = await client.from('rsvps').insert({
    event_id: dbEvent.id,
    name: body.name,
    email: body.email,
    guests: body.guests,
  })
  if (error) throw createError({statusCode: 500, statusMessage: error.message})

  await notifyStaff(event, {
    subject: `RSVP: ${dbEvent.title}`,
    lines: [
      `New RSVP for ${dbEvent.title}`,
      `When: ${formatWhen(dbEvent.starts_at)}`,
      `Name: ${body.name}`,
      `Email: ${body.email}`,
      `Guests: ${body.guests}`,
    ],
  })

  return {ok: true}
})
