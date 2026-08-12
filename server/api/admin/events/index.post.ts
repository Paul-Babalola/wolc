import {serverSupabaseServiceRole} from '#supabase/server'
import {requireAdmin} from '~/server/utils/admin'
import {adminEventSchema} from '~/server/utils/eventSchema'
import {slugify} from '~/server/utils/slug'
import {readValidatedJson} from '~/server/utils/validate'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readValidatedJson(event, adminEventSchema)
  const slug = body.slug || slugify(body.title)

  if (!slug) {
    throw createError({statusCode: 400, statusMessage: 'title: Could not generate a slug'})
  }

  const client = serverSupabaseServiceRole(event)
  const {data, error} = await client
    .from('events')
    .insert({
      slug,
      title: body.title,
      starts_at: body.starts_at,
      ends_at: body.ends_at ?? null,
      location: body.location ?? null,
      summary: body.summary ?? null,
      description: body.description ?? null,
      image_url: body.image_url ?? null,
      register_url: body.register_url ?? null,
      capacity: body.capacity ?? null,
      published: body.published,
    })
    .select(
      'id, slug, title, starts_at, ends_at, location, summary, description, image_url, register_url, capacity, published, created_at',
    )
    .single()

  if (error) {
    const statusCode = error.code === '23505' ? 409 : 500
    throw createError({statusCode, statusMessage: error.message})
  }

  return data
})
