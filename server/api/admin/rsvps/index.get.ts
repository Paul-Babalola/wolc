import {serverSupabaseServiceRole} from '#supabase/server'
import {requireAdmin} from '~/server/utils/admin'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const client = serverSupabaseServiceRole(event)
  const {data, error} = await client
    .from('rsvps')
    .select('id, event_id, name, email, guests, created_at, events(title, starts_at, slug)')
    .order('created_at', {ascending: false})
    .limit(200)

  if (error) throw createError({statusCode: 500, statusMessage: error.message})

  return data ?? []
})
