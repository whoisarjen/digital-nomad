import { favoriteToggleSchema } from '~/shared/global.schema'

export default defineProtectedEventHandler(async (event, session) => {
  const { citySlug } = await readValidatedBody(event, favoriteToggleSchema.parse)

  const city = await prisma.city.findUnique({ where: { slug: citySlug } })
  if (!city) {
    throw createError({ statusCode: 404, message: 'City not found' })
  }

  const userId = session.user.id

  const existing = await prisma.favorite.findUnique({
    where: { userId_citySlug: { userId, citySlug } },
  })

  if (existing) {
    await prisma.favorite.delete({
      where: { userId_citySlug: { userId, citySlug } },
    })
    return { favorited: false }
  }

  await prisma.favorite.create({
    data: { userId, citySlug },
  })
  return { favorited: true }
})
