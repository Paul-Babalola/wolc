import {serverSupabaseServiceRole} from '#supabase/server'
import {requireAdmin} from '~/server/utils/admin'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({statusCode: 400, statusMessage: 'Missing event id'})

  const client = serverSupabaseServiceRole(event)
  const {error} = await client.from('events').delete().eq('id', id)

  if (error) throw createError({statusCode: 500, statusMessage: error.message})

  return {ok: true}
})
