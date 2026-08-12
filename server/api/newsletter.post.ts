import {z} from 'zod'
import {serverSupabaseServiceRole} from '#supabase/server'
import {notifyStaff} from '~/server/utils/notify'
import {guardPublicForm} from '~/server/utils/spam'
import {parseValidatedJson} from '~/server/utils/validate'

const schema = z.object({
  email: z.string().email(),
  website: z.string().max(200).optional(),
})

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event)
  if (guardPublicForm(event, rawBody)) return {ok: true}
  const body = parseValidatedJson(rawBody, schema)
  const client = serverSupabaseServiceRole(event)

  const {error} = await client
    .from('newsletter_subscribers')
    .upsert({email: body.email}, {onConflict: 'email', ignoreDuplicates: true})
  if (error) throw createError({statusCode: 500, statusMessage: error.message})

  await notifyStaff(event, {
    subject: 'New newsletter signup',
    lines: [`Email: ${body.email}`],
  })

  return {ok: true}
})
