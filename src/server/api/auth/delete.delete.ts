export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  await prisma.user.delete({ where: { id: user.id } })

  clearSessionCookie(event)

  return { success: true }
})
