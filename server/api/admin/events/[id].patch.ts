import {serverSupabaseServiceRole} from '#supabase/server'
import {requireAdmin} from '~/server/utils/admin'
import {adminEventUpdateSchema} from '~/server/utils/eventSchema'
import {slugify} from '~/server/utils/slug'
import {readValidatedJson} from '~/server/utils/validate'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({statusCode: 400, statusMessage: 'Missing event id'})

  const body = await readValidatedJson(event, adminEventUpdateSchema)

  const updates: Record<string, unknown> = {}

  if (body.title !== undefined) updates.title = body.title
  if (body.slug !== undefined) updates.slug = body.slug
  else if (body.title !== undefined) updates.slug = slugify(body.title)
  if (body.starts_at !== undefined) updates.starts_at = body.starts_at
  if (body.ends_at !== undefined) updates.ends_at = body.ends_at
  if (body.location !== undefined) updates.location = body.location
  if (body.summary !== undefined) updates.summary = body.summary
  if (body.description !== undefined) updates.description = body.description
  if (body.image_url !== undefined) updates.image_url = body.image_url
  if (body.register_url !== undefined) updates.register_url = body.register_url
  if (body.capacity !== undefined) updates.capacity = body.capacity
  if (body.published !== undefined) updates.published = body.published

  if (!Object.keys(updates).length) {
    throw createError({statusCode: 400, statusMessage: 'No fields to update'})
  }

  const client = serverSupabaseServiceRole(event)
  const {data, error} = await client
    .from('events')
    .update(updates)
    .eq('id', id)
    .select(
      'id, slug, title, starts_at, ends_at, location, summary, description, image_url, register_url, capacity, published, created_at',
    )
    .single()

  if (error) {
    const statusCode = error.code === '23505' ? 409 : error.code === 'PGRST116' ? 404 : 500
    throw createError({statusCode, statusMessage: error.message})
  }

  return data
})
