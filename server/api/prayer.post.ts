import {z} from 'zod'
import {serverSupabaseServiceRole} from '#supabase/server'
import {notifyStaff} from '~/server/utils/notify'
import {guardPublicForm} from '~/server/utils/spam'
import {parseValidatedJson} from '~/server/utils/validate'

const schema = z.object({
  name: z.string().max(120).optional(),
  email: z.string().email().optional(),
  message: z.string().min(1).max(4000),
  isPrivate: z.boolean().default(false),
  website: z.string().max(200).optional(),
})

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event)
  if (guardPublicForm(event, rawBody)) return {ok: true}
  const body = parseValidatedJson(rawBody, schema)
  const client = serverSupabaseServiceRole(event)

  const {error} = await client.from('prayer_requests').insert({
    name: body.name,
    email: body.email,
    message: body.message,
    is_private: body.isPrivate,
  })
  if (error) throw createError({statusCode: 500, statusMessage: error.message})

  await notifyStaff(event, {
    subject: body.isPrivate ? 'Private prayer request' : 'New prayer request',
    lines: [
      body.name ? `Name: ${body.name}` : 'Name: (not provided)',
      body.email ? `Email: ${body.email}` : 'Email: (not provided)',
      `Private: ${body.isPrivate ? 'Yes' : 'No'}`,
      `Request: ${body.message}`,
    ],
  })

  return {ok: true}
})
