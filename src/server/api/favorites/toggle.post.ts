import { favoriteToggleSchema } from '~/shared/global.schema'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const { citySlug } = await readValidatedBody(event, favoriteToggleSchema.parse)

  const city = await prisma.city.findUnique({ where: { slug: citySlug } })
  if (!city) {
    throw createError({ statusCode: 404, message: 'City not found' })
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_citySlug: { userId: user.id, citySlug } },
  })

  if (existing) {
    await prisma.favorite.delete({
      where: { userId_citySlug: { userId: user.id, citySlug } },
    })
    return { favorited: false }
  }

  await prisma.favorite.create({
    data: { userId: user.id, citySlug },
  })
  return { favorited: true }
})
