export default defineProtectedEventHandler(async (_event, session) => {
  await prisma.user.delete({ where: { id: session.user.id } })
  return { success: true }
})
