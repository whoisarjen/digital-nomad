import { voteSchema } from '~/shared/global.schema'

const MAX_VOTES = 3

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const { featureId } = await readValidatedBody(event, voteSchema.parse)

  // Check if feature exists
  const feature = await prisma.feature.findUnique({ where: { id: featureId } })
  if (!feature) {
    throw createError({ statusCode: 404, message: 'Feature not found' })
  }

  // Check if already voted → toggle off
  const existingVote = await prisma.vote.findUnique({
    where: { userId_featureId: { userId: user.id, featureId } },
  })

  if (existingVote) {
    await prisma.vote.delete({
      where: { userId_featureId: { userId: user.id, featureId } },
    })
    return { voted: false }
  }

  // Check vote limit
  const voteCount = await prisma.vote.count({ where: { userId: user.id } })
  if (voteCount >= MAX_VOTES) {
    throw createError({ statusCode: 400, message: `Maximum ${MAX_VOTES} votes allowed` })
  }

  await prisma.vote.create({
    data: { userId: user.id, featureId },
  })

  return { voted: true }
})
