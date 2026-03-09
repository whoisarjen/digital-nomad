import { getDayCostSchema } from '~/shared/global.schema'

export default defineEventHandler(async (event) => {
  const language = getLocale(event)
  const _select = getLocalizedSelect(language)

  const { citySlug } = await getValidatedQuery(event, getDayCostSchema.parse)

  const city = await prisma.city.findFirstOrThrow({
    where: { slug: citySlug },
    select: {
      slug: true,
      name: true,
      mealInexpensiveRestaurant: true,
      mealMidRangeRestaurant: true,
      cappuccino: true,
      domesticBeerRestaurant: true,
      taxi1km: true,
      oneWayTicket: true,
    },
  })

  const toNum = (v: unknown) => (v === null || v === undefined ? null : Number(v))

  return {
    citySlug: city.slug,
    cityName: city.name,
    mealInexpensiveRestaurant: toNum(city.mealInexpensiveRestaurant),
    mealMidRangeRestaurant: toNum(city.mealMidRangeRestaurant),
    cappuccino: toNum(city.cappuccino),
    domesticBeerRestaurant: toNum(city.domesticBeerRestaurant),
    taxi1km: toNum(city.taxi1km),
    oneWayTicket: toNum(city.oneWayTicket),
  }
})
