import { REGION_SLUGS, REGION_PATH_BY_LOCALE } from '~/shared/global.utils'

export default defineSitemapEventHandler(() =>
  REGION_SLUGS.flatMap((slug) =>
    buildLocalizedEntries(
      (lang) => `${lang !== 'en' ? `/${lang}` : ''}/${REGION_PATH_BY_LOCALE[lang] ?? 'regions'}/${slug}`,
    ),
  ),
)
