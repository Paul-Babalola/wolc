export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = useSupabaseClient()
  const {data: {session}} = await supabase.auth.getSession()

  if (!session?.user) return

  try {
    await $fetch('/api/admin/me')
    const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : '/admin'
    return navigateTo(redirect)
  } catch {
    await supabase.auth.signOut()
  }
})
