import { COUNTRY_PATH_BY_LOCALE } from '~/shared/global.utils'

export default defineSitemapEventHandler(async () => {
  const cities = await prisma.city.findMany({
    distinct: ['countrySlug'],
    select: { countrySlug: true },
  })

  return cities.flatMap(({ countrySlug }) =>
    buildLocalizedEntries(
      (lang) => `${lang !== 'en' ? `/${lang}` : ''}/${COUNTRY_PATH_BY_LOCALE[lang] ?? 'countries'}/${countrySlug}`,
    ),
  )
})
