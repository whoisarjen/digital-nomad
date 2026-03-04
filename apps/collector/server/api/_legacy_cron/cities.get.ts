export default defineEventHandler(async () => {
  const citiesInDb = await prisma.city.findMany({ select: { internetSpeedCity: true, slug: true, region: true } })
  await processInBatches(citiesInDb, async cityInDb => {
    await prisma.city.update({
      where: {
        slug: cityInDb.slug,
      },
      data: {},
    })
  })

  return 'Done'
})
