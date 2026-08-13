import {z} from 'zod'
import {serverSupabaseServiceRole} from '#supabase/server'
import {requireAdmin} from '~/server/utils/admin'
import {readValidatedJson} from '~/server/utils/validate'

const schema = z.object({
  handled: z.boolean(),
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({statusCode: 400, statusMessage: 'Missing id'})

  const body = await readValidatedJson(event, schema)
  const client = serverSupabaseServiceRole(event)

  const {data, error} = await client
    .from('prayer_requests')
    .update({handled_at: body.handled ? new Date().toISOString() : null})
    .eq('id', id)
    .select('id, handled_at')
    .single()

  if (error) throw createError({statusCode: 500, statusMessage: error.message})

  return data
})
