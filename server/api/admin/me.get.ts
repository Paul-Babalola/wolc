import {requireAdmin} from '~/server/utils/admin'

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event)
  return {
    email: user.email,
  }
})
