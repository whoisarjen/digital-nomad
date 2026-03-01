import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session?.user) return { data: [] }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    select: { citySlug: true },
    orderBy: { createdAt: 'desc' },
  })

  return { data: favorites.map(f => f.citySlug) }
})
