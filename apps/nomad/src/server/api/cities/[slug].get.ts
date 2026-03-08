import { getCitiesBySlugSchema } from "~/shared/global.schema"

export default defineEventHandler(async (event) => {
  const { slug } = await getValidatedRouterParams(event, getCitiesBySlugSchema.parse)

  const city = await prisma.city.findFirstOrThrow({
    where: { slug },
    select: {
      name: true,
      countrySlug: true,
      country: {
        select: {
          name: true,
          region: true,
          internetSpeed: true,
          internetSpeedRanking: true,
          englishProficiency: true,
          plugTypes: true,
          voltage: true,
          frequency: true,
        },
      },
      costForNomadInUsd: true,
      costForExpatInUsd: true,
      costForLocalInUsd: true,
      costForFamilyInUsd: true,
      pollution: true,
      safety: true,
      climate: true,
      healthCare: true,
      population: true,
      internetSpeedCity: true,
      internetSpeedCityRanking: true,
      airQualityNow: true,
      airQualityScore: true,
      airQualityNowScore: true,
      humidity: true,
      image: {
        select: {
          url: true,
          ownerName: true,
          ownerUsername: true,
        }
      },
      monthSummary: {
        select: {
          month: true,
          weatherIcon: true,
          apparentTemperatureMax: true,
          rainSum: true,
          sunshineDuration: true,
          totalScore: true,
        },
        orderBy: {
          month: 'asc',
        },
      },
      // Restaurants
      mealInexpensiveRestaurant: true,
      mealMidRangeRestaurant: true,
      mcMeal: true,
      domesticBeerRestaurant: true,
      importedBeerRestaurant: true,
      cappuccino: true,
      cokeRestaurant: true,
      waterRestaurant: true,
      // Markets
      milk1L: true,
      bread500g: true,
      rice1kg: true,
      eggs12: true,
      localCheese1kg: true,
      chickenFillets1kg: true,
      beefRound1kg: true,
      apples1kg: true,
      banana1kg: true,
      oranges1kg: true,
      tomato1kg: true,
      potato1kg: true,
      onion1kg: true,
      lettuce: true,
      water15L: true,
      wineBottleMidRange: true,
      domesticBeerMarket: true,
      importedBeerMarket: true,
      cigarettes20Pack: true,
      // Transportation
      oneWayTicket: true,
      monthlyTransportPass: true,
      taxiStart: true,
      taxi1km: true,
      taxi1hourWaiting: true,
      gasoline1L: true,
      volkswagenGolf: true,
      toyotaCorolla: true,
      // Utilities
      utilitiesMonthly85m2: true,
      mobileMinutePrepaid: true,
      internet60mbps: true,
      // Sports & Leisure
      fitnessClubMonthly: true,
      tennisCourt1h: true,
      cinema1seat: true,
      // Childcare
      preschoolMonthly: true,
      internationalPrimarySchoolYearly: true,
      // Clothing
      jeans: true,
      summerDress: true,
      nikeShoes: true,
      leatherBusinessShoes: true,
      // Rent
      apartment1brCentre: true,
      apartment1brOutside: true,
      apartment3brCentre: true,
      apartment3brOutside: true,
      // Buy
      pricePerM2Centre: true,
      pricePerM2Outside: true,
      // Finance
      averageMonthlyNetSalary: true,
      mortgageInterestRate: true,
    }
  })

  const { country: countryData, ...cityFields } = city

  const ep = countryData.englishProficiency
  const englishProficiency = ep === 0 ? null : ep >= 550 ? 'HIGH' : ep >= 450 ? 'MIDDLE' : 'LOW'

  return {
    ...cityFields,
    country: countryData.name,
    region: countryData.region,
    internetSpeedCountry: countryData.internetSpeed,
    internetSpeedCountryRanking: countryData.internetSpeedRanking,
    englishProficiency,
    plugTypes: countryData.plugTypes ?? null,
    voltage: countryData.voltage ?? null,
    frequency: countryData.frequency ?? null,
  }
})
