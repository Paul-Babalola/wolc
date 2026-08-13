import {serverSupabaseServiceRole} from '#supabase/server'
import {requireAdmin} from '~/server/utils/admin'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const client = serverSupabaseServiceRole(event)
  const {data, error} = await client
    .from('recurring_rsvps')
    .select('id, event_key, slug, starts_at, name, email, guests, created_at')
    .order('created_at', {ascending: false})
    .limit(200)

  if (error) throw createError({statusCode: 500, statusMessage: error.message})

  return data ?? []
})
