import {serverSupabaseServiceRole} from '#supabase/server'
import {requireAdmin} from '~/server/utils/admin'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const client = serverSupabaseServiceRole(event)
  const {data, error} = await client
    .from('events')
    .select(
      'id, slug, title, starts_at, ends_at, location, summary, description, image_url, register_url, capacity, published, created_at',
    )
    .order('starts_at', {ascending: false})

  if (error) throw createError({statusCode: 500, statusMessage: error.message})

  return data ?? []
})
