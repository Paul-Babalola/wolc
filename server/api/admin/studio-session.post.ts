import {setStudioUserSession} from '#imports'
import {requireAdmin} from '~/server/utils/admin'

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event)
  const email = user.email

  if (!email) {
    throw createError({statusCode: 401, statusMessage: 'Sign in required'})
  }

  const token = process.env.STUDIO_GITHUB_TOKEN
  if (!token) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Studio git token not configured. Sign in with GitHub instead.',
    })
  }

  const localPart = email.split('@')[0] || 'Staff'
  const name = localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

  await setStudioUserSession(event, {
    name,
    email,
    providerId: user.id,
  })

  return {ok: true}
})
