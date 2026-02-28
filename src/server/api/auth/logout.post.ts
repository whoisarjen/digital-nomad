export default defineEventHandler(async (event) => {
  const token = getCookie(event, getSessionCookieName())

  if (token) {
    await prisma.session.deleteMany({ where: { token } })
  }

  clearSessionCookie(event)

  return { success: true }
})
