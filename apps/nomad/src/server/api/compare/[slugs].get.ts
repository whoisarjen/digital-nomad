import { getCompareSchema } from '~/shared/global.schema'
import { buildCompareSlug } from '~/shared/global.utils'

const CITY_SELECT = {
  slug: true,
  name: true,
  country: {
    select: {
      name: true,
      region: true,
      internetSpeed: true,
      internetSpeedRanking: true,
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
    },
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
    orderBy: { month: 'asc' as const },
  },
  // Restaurants
  mealInexpensiveRestaurant: true,
  mealMidRangeRestaurant: true,
  mcMeal: true,
  cappuccino: true,
  domesticBeerRestaurant: true,
  importedBeerRestaurant: true,
  cokeRestaurant: true,
  waterRestaurant: true,
  // Markets
  milk1L: true,
  bread500g: true,
  rice1kg: true,
  eggs12: true,
  chickenFillets1kg: true,
  beefRound1kg: true,
  localCheese1kg: true,
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
  // Transport
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
  // Sport & Leisure
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
} as const

export default defineEventHandler(async (event) => {
  const { slugs } = await getValidatedRouterParams(event, getCompareSchema.parse)

  // Enforce canonical alphabetical ordering
  const canonical = buildCompareSlug(slugs.city1, slugs.city2)
  if (canonical !== slugs.raw) {
    await sendRedirect(event, `/api/compare/${canonical}`, 301)
    return
  }

  const [rawA, rawB] = await Promise.all([
    prisma.city.findFirstOrThrow({
      where: { slug: slugs.city1 },
      select: CITY_SELECT,
    }),
    prisma.city.findFirstOrThrow({
      where: { slug: slugs.city2 },
      select: CITY_SELECT,
    }),
  ])

  const { country: countryA, ...fieldsA } = rawA
  const { country: countryB, ...fieldsB } = rawB

  return {
    cityA: {
      ...fieldsA,
      country: countryA.name,
      region: countryA.region,
      internetSpeedCountry: countryA.internetSpeed,
      internetSpeedCountryRanking: countryA.internetSpeedRanking,
    },
    cityB: {
      ...fieldsB,
      country: countryB.name,
      region: countryB.region,
      internetSpeedCountry: countryB.internetSpeed,
      internetSpeedCountryRanking: countryB.internetSpeedRanking,
    },
  }
})
