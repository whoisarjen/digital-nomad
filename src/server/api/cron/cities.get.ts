// import { cities } from '../../../../data.json'

// import { Region } from "@prisma/client"

export default defineEventHandler(async () => {
  const citiesInDb = await prisma.city.findMany({ select: { internetSpeedCity: true, slug: true, region: true } })
  await processInBatches(citiesInDb, async cityInDb => {
    // const city = cities.find(({ slug }) => slug === cityInDb.slug)

    await prisma.city.update({
      where: {
        slug: cityInDb.slug,
      },
      data: {
        // internetSpeedCity: cityInDb.internetSpeedCity || city?.internet_speed,
        // region: (() => {
        //   if (city.region === 'Africa') {
        //       return Region.Africa
        //   }
        //   if (city.region === 'Europe') {
        //       return Region.Europe
        //   }
        //   if (city.region === 'Asia') {
        //       return Region.Asia
        //   }
        //   if (city.region === 'Middle East') {
        //       return Region.MiddleEast
        //   }
        //   if (city.region === 'Latin America') {
        //       return Region.LatinAmerica
        //   }
        //   if (city.region === 'North America') {
        //       return Region.NorthAmerica
        //   }
        //   if (city.region === 'Oceania') {
        //       return Region.Oceania
        //   }
        //   if (city.region === 'Antarctica') {
        //       return Region.Antarctica
        //   }
        // })(),
      },
    })
  })

  return
})
