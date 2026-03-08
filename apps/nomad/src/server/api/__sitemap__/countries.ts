import { COUNTRY_PATH_BY_LOCALE } from '~/shared/global.utils'

export default defineSitemapEventHandler(async () => {
  const countries = await prisma.country.findMany({
    select: { slug: true },
  })

  return countries.flatMap(({ slug }) =>
    buildLocalizedEntries(
      (lang) => `${lang !== 'en' ? `/${lang}` : ''}/${COUNTRY_PATH_BY_LOCALE[lang] ?? 'countries'}/${slug}`,
    ),
  )
})
