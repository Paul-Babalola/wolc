export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) return

  const supabase = useSupabaseClient()
  const {data: {session}} = await supabase.auth.getSession()

  if (!session?.user) {
    return navigateTo({
      path: '/login',
      query: {redirect: to.fullPath},
    })
  }

  try {
    await $fetch('/api/admin/me')
  } catch (error: unknown) {
    const status = (error as {statusCode?: number})?.statusCode

    if (status === 403) {
      await supabase.auth.signOut()
      return navigateTo({
        path: '/login',
        query: {error: 'forbidden'},
      })
    }

    return navigateTo({
      path: '/login',
      query: {redirect: to.fullPath},
    })
  }
})
