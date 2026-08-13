import {serverSupabaseServiceRole} from '#supabase/server'
import {requireAdmin} from '~/server/utils/admin'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const {kind} = getQuery(event)
  const client = serverSupabaseServiceRole(event)

  let query = client
    .from('contact_messages')
    .select('id, kind, name, email, phone, message, handled_at, created_at')
    .order('created_at', {ascending: false})
    .limit(200)

  if (kind === 'contact' || kind === 'connect') {
    query = query.eq('kind', kind)
  }

  const {data, error} = await query

  if (error) throw createError({statusCode: 500, statusMessage: error.message})

  return data ?? []
})
