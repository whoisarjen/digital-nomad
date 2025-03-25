import { cities } from '../../../../data.json'

export default defineEventHandler(async () => {
  const citiesInDb = await prisma.city.findMany({ select: { internetSpeedCity: true, slug: true } })
  await processInBatches(citiesInDb, async cityInDb => {
    const city = cities.find(({ slug }) => slug === cityInDb.slug)

    await prisma.city.update({
      where: {
        slug: cityInDb.slug,
      },
      data: {
        internetSpeedCity: cityInDb.internetSpeedCity || city?.internet_speed,
      },
    })
  })

  return
})
