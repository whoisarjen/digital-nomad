import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const userId = session?.user?.id

  const features = await prisma.feature.findMany({
    orderBy: [{ order: 'asc' }],
    include: {
      _count: { select: { votes: true } },
      ...(userId ? { votes: { where: { userId }, select: { userId: true } } } : {}),
    },
  })

  return {
    data: features.map((f) => ({
      id: f.id,
      name: f.name,
      description: f.description,
      status: f.status,
      voteCount: f._count.votes,
      hasVoted: userId ? (f as any).votes?.length > 0 : false,
    })),
  }
})
