const CSV_URL = 'https://raw.githubusercontent.com/TheChance101/cost-of-living/master/costOfLiving.csv'

const MANUAL_OVERRIDES: Record<string, string> = {
  'denpasar': 'bali',
  'ubud': 'bali',
  'saint petersburg': 'saint-petersburg',
  'ho chi minh city': 'ho-chi-minh-city',
  'ho chi minh': 'ho-chi-minh-city',
  'saigon': 'ho-chi-minh-city',
  'kuala lumpur': 'kuala-lumpur',
  'mexico city': 'mexico-city',
  'new york': 'new-york-city',
  'new york city': 'new-york-city',
  'los angeles': 'los-angeles',
  'san francisco': 'san-francisco',
  'buenos aires': 'buenos-aires',
  'sao paulo': 'sao-paulo',
  'rio de janeiro': 'rio-de-janeiro',
  'cape town': 'cape-town',
  'tel aviv': 'tel-aviv',
  'tel aviv-yafo': 'tel-aviv',
  'abu dhabi': 'abu-dhabi',
  'hong kong': 'hong-kong',
  'chiang mai': 'chiang-mai',
  'koh samui': 'koh-samui',
  'ko samui': 'koh-samui',
  'phnom penh': 'phnom-penh',
  'george town': 'penang',
  'da nang': 'da-nang',
  'new delhi': 'delhi',
  'bengaluru': 'bangalore',
  'cebu city': 'cebu',
  'xi an': 'xian',
  'marrakesh': 'marrakech',
  'kuwait city': 'kuwait-city',
  'dar es salaam': 'dar-es-salaam',
  'addis ababa': 'addis-ababa',
}

function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[''`]/g, '')
    .replace(/[-_]/g, ' ')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
}

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function parseRow(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuote = false
  for (const char of line) {
    if (char === '"') { inQuote = !inQuote }
    else if (char === ',' && !inQuote) { values.push(current); current = '' }
    else { current += char }
  }
  values.push(current)
  return values
}

function toDecimal(val: string | undefined) {
  if (!val) return null
  const n = parseFloat(val)
  return isNaN(n) ? null : n
}

export default defineEventHandler(async () => {
  const raw = await $fetch<string>(CSV_URL)
  const lines = raw.trim().split('\n')

  const cities = await prisma.city.findMany({
    select: { slug: true, name: true, country: { select: { name: true } } },
  })

  const byName = new Map<string, string>()
  const byNameAndCountry = new Map<string, string>()
  const bySlug = new Set<string>()

  for (const c of cities) {
    const normName = normalize(c.name)
    const key = `${normName}|${normalize(c.country.name)}`
    if (!byName.has(normName)) byName.set(normName, c.slug)
    byNameAndCountry.set(key, c.slug)
    bySlug.add(c.slug)
  }

  let matched = 0
  let skipped = 0
  let errors = 0

  await processInBatches(lines, async (line) => {
    const v = parseRow(line)
    if (v.length !== 58) { skipped++; return }

    const cityName = v[0]?.trim()
    const countryName = v[1]?.trim()
    if (!cityName || !countryName) { skipped++; return }

    const normName = normalize(cityName)
    const key = `${normName}|${normalize(countryName)}`

    let slug: string | undefined
    if (MANUAL_OVERRIDES[normName] && bySlug.has(MANUAL_OVERRIDES[normName])) {
      slug = MANUAL_OVERRIDES[normName]
    } else if (byNameAndCountry.has(key)) {
      slug = byNameAndCountry.get(key)
    } else {
      const derived = toSlug(cityName)
      if (bySlug.has(derived)) slug = derived
    }
    if (!slug && byName.has(normName)) slug = byName.get(normName)

    if (!slug) { skipped++; return }

    try {
      await prisma.city.update({
        where: { slug },
        data: {
          mealInexpensiveRestaurant:        toDecimal(v[2]),
          mealMidRangeRestaurant:           toDecimal(v[3]),
          mcMeal:                           toDecimal(v[4]),
          domesticBeerRestaurant:           toDecimal(v[5]),
          importedBeerRestaurant:           toDecimal(v[6]),
          cappuccino:                       toDecimal(v[7]),
          cokeRestaurant:                   toDecimal(v[8]),
          waterRestaurant:                  toDecimal(v[9]),
          milk1L:                           toDecimal(v[10]),
          bread500g:                        toDecimal(v[11]),
          rice1kg:                          toDecimal(v[12]),
          eggs12:                           toDecimal(v[13]),
          localCheese1kg:                   toDecimal(v[14]),
          chickenFillets1kg:                toDecimal(v[15]),
          beefRound1kg:                     toDecimal(v[16]),
          apples1kg:                        toDecimal(v[17]),
          banana1kg:                        toDecimal(v[18]),
          oranges1kg:                       toDecimal(v[19]),
          tomato1kg:                        toDecimal(v[20]),
          potato1kg:                        toDecimal(v[21]),
          onion1kg:                         toDecimal(v[22]),
          lettuce:                          toDecimal(v[23]),
          water15L:                         toDecimal(v[24]),
          wineBottleMidRange:               toDecimal(v[25]),
          domesticBeerMarket:               toDecimal(v[26]),
          importedBeerMarket:               toDecimal(v[27]),
          cigarettes20Pack:                 toDecimal(v[28]),
          oneWayTicket:                     toDecimal(v[29]),
          monthlyTransportPass:             toDecimal(v[30]),
          taxiStart:                        toDecimal(v[31]),
          taxi1km:                          toDecimal(v[32]),
          taxi1hourWaiting:                 toDecimal(v[33]),
          gasoline1L:                       toDecimal(v[34]),
          volkswagenGolf:                   toDecimal(v[35]),
          toyotaCorolla:                    toDecimal(v[36]),
          utilitiesMonthly85m2:             toDecimal(v[37]),
          mobileMinutePrepaid:              toDecimal(v[38]),
          internet60mbps:                   toDecimal(v[39]),
          fitnessClubMonthly:               toDecimal(v[40]),
          tennisCourt1h:                    toDecimal(v[41]),
          cinema1seat:                      toDecimal(v[42]),
          preschoolMonthly:                 toDecimal(v[43]),
          internationalPrimarySchoolYearly: toDecimal(v[44]),
          jeans:                            toDecimal(v[45]),
          summerDress:                      toDecimal(v[46]),
          nikeShoes:                        toDecimal(v[47]),
          leatherBusinessShoes:             toDecimal(v[48]),
          apartment1brCentre:               toDecimal(v[49]),
          apartment1brOutside:              toDecimal(v[50]),
          apartment3brCentre:               toDecimal(v[51]),
          apartment3brOutside:              toDecimal(v[52]),
          pricePerM2Centre:                 toDecimal(v[53]),
          pricePerM2Outside:                toDecimal(v[54]),
          averageMonthlyNetSalary:          toDecimal(v[55]),
          mortgageInterestRate:             toDecimal(v[56]),
        },
      })
      matched++
    } catch {
      errors++
    }
  })

  return { matched, skipped, errors }
})
