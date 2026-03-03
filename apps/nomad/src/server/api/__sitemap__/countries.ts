import { LANGUAGES } from '~/constants/global.constant'

const COUNTRY_PATH_BY_LOCALE: Partial<Record<string, string>> = {
  pl: 'kraje',
}

export default defineSitemapEventHandler(async () => {
  const cities = await prisma.city.findMany({
    distinct: ['countrySlug'],
    select: { countrySlug: true },
  })

  return cities.flatMap(({ countrySlug }) => {
    const variants = LANGUAGES.map((lang) => ({
      lang,
      loc: `${lang !== 'en' ? `/${lang}` : ''}/${COUNTRY_PATH_BY_LOCALE[lang] ?? 'countries'}/${countrySlug}`,
    }))

    const alternatives = buildSitemapAlternatives(variants)

    return variants.map((v) => ({
      loc: v.loc,
      _sitemap: v.lang,
      alternatives,
    }))
  })
})
