import {z} from 'zod'
import {serverSupabaseServiceRole} from '#supabase/server'
import {notifyStaff} from '~/server/utils/notify'
import {readValidatedJson} from '~/server/utils/validate'

const schema = z.object({
  kind: z.enum(['contact', 'connect']).default('contact'),
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  subject: z.string().max(200).optional(),
  message: z.string().max(4000).optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedJson(event, schema)
  const client = serverSupabaseServiceRole(event)

  const message = [
    body.subject ? `Subject: ${body.subject}` : '',
    body.message || '',
  ].filter(Boolean).join('\n\n')

  const {error} = await client.from('contact_messages').insert({
    kind: body.kind,
    name: body.name,
    email: body.email,
    phone: body.phone,
    message: message || null,
  })
  if (error) throw createError({statusCode: 500, statusMessage: error.message})

  await notifyStaff(event, {
    subject: body.kind === 'connect' ? 'New connect card' : 'New contact message',
    lines: [
      `Name: ${body.name}`,
      `Email: ${body.email}`,
      body.phone ? `Phone: ${body.phone}` : '',
      body.subject ? `Subject: ${body.subject}` : '',
      message ? `Message: ${message}` : '',
    ].filter(Boolean),
  })

  return {ok: true}
})
