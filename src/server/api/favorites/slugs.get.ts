export default defineEventHandler(async (event) => {
  const user = await getSessionUser(event)
  if (!user) return { data: [] }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    select: { citySlug: true },
    orderBy: { createdAt: 'desc' },
  })

  return { data: favorites.map(f => f.citySlug) }
})
