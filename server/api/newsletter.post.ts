import {z} from 'zod'
import {serverSupabaseServiceRole} from '#supabase/server'
import {notifyStaff} from '~/server/utils/notify'
import {readValidatedJson} from '~/server/utils/validate'

const schema = z.object({email: z.string().email()})

export default defineEventHandler(async (event) => {
  const body = await readValidatedJson(event, schema)
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
