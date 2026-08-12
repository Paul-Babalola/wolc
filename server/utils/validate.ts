import type {H3Event} from 'h3'
import {z} from 'zod'

export async function readValidatedJson<T extends z.ZodTypeAny>(
  event: H3Event,
  schema: T,
): Promise<z.infer<T>> {
  const body = await readBody(event)
  const result = schema.safeParse(body)
  if (!result.success) {
    const first = result.error.issues[0]
    throw createError({
      statusCode: 400,
      statusMessage: first ? `${first.path.join('.')}: ${first.message}` : 'Invalid request',
    })
  }
  return result.data
}
