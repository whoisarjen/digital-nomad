import { MONTH_SLUGS } from '~/shared/months.constant'

export default defineSitemapEventHandler(() => {
  return MONTH_SLUGS.flatMap((monthSlug) =>
    buildLocalizedEntries(
      (lang) => `${lang !== 'en' ? `/${lang}` : ''}/best-cities/${monthSlug}`,
    ),
  )
})
