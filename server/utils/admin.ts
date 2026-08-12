import type {H3Event} from 'h3'
import {serverSupabaseUser} from '#supabase/server'

function parseAdminEmails(raw: string) {
  return raw
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export async function requireAdmin(event: H3Event) {
  const config = useRuntimeConfig(event)
  const allowlist = parseAdminEmails(config.adminEmails || '')

  if (!allowlist.length) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Admin access is not configured. Set ADMIN_EMAILS in your environment.',
    })
  }

  const user = await serverSupabaseUser(event)
  const email = user?.email?.toLowerCase()

  if (!email) {
    throw createError({statusCode: 401, statusMessage: 'Sign in required'})
  }

  if (!allowlist.includes(email)) {
    throw createError({statusCode: 403, statusMessage: 'Not authorized for admin access'})
  }

  return user
}
