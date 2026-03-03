export default defineEventHandler(async () => {
  const memberCount = await prisma.user.count()

  return { memberCount }
})
