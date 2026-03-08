export default defineEventHandler(async () => {
  // Step 1: Read distinct country data from existing City rows (uses raw SQL since old columns will be dropped)
  const countries = await prisma.$queryRaw<
    {
      countrySlug: string
      country: string
      countryChinese: string
      countryCode: string
      region: string
      internetSpeedCountry: number
      internetSpeedCountryRanking: number
    }[]
  >`
    SELECT DISTINCT ON ("countrySlug")
      "countrySlug", "country", "countryChinese", "countryCode", "region",
      "internetSpeedCountry", "internetSpeedCountryRanking"
    FROM "City"
    ORDER BY "countrySlug"
  `

  // Step 2: Load english proficiency scores
  const epData = await import('~/server/data/english-proficiency.json')
  const epScores = epData.scores as Record<string, number>

  // Step 3: Upsert each country
  let created = 0
  let updated = 0

  await processInBatches(countries, async (c) => {
    const ep = epScores[c.countrySlug] ?? 0

    const existing = await prisma.country.findUnique({ where: { slug: c.countrySlug } })

    if (existing) {
      await prisma.country.update({
        where: { slug: c.countrySlug },
        data: {
          name: c.country,
          nameChinese: c.countryChinese,
          code: c.countryCode,
          region: c.region as any,
          internetSpeed: c.internetSpeedCountry,
          internetSpeedRanking: c.internetSpeedCountryRanking,
          englishProficiency: ep,
        },
      })
      updated++
    } else {
      await prisma.country.create({
        data: {
          slug: c.countrySlug,
          name: c.country,
          nameChinese: c.countryChinese,
          code: c.countryCode,
          region: c.region as any,
          internetSpeed: c.internetSpeedCountry,
          internetSpeedRanking: c.internetSpeedCountryRanking,
          englishProficiency: ep,
        },
      })
      created++
    }
  })

  return { created, updated, total: countries.length }
})
