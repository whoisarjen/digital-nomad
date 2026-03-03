import { voteSchema } from '~/shared/global.schema'

const MAX_VOTES = 3

export default defineProtectedEventHandler(async (event, session) => {
  const { featureId } = await readValidatedBody(event, voteSchema.parse)
  const userId = session.user.id

  const feature = await prisma.feature.findUnique({ where: { id: featureId } })
  if (!feature) {
    throw createError({ statusCode: 404, message: 'Feature not found' })
  }

  const existingVote = await prisma.vote.findUnique({
    where: { userId_featureId: { userId, featureId } },
  })

  if (existingVote) {
    await prisma.vote.delete({
      where: { userId_featureId: { userId, featureId } },
    })
    return { voted: false }
  }

  const voteCount = await prisma.vote.count({ where: { userId } })
  if (voteCount >= MAX_VOTES) {
    throw createError({ statusCode: 400, message: `Maximum ${MAX_VOTES} votes allowed` })
  }

  await prisma.vote.create({
    data: { userId, featureId },
  })

  return { voted: true }
})
