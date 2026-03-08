import { SAFE_CITIES_CONTEXT_SLUGS, SAFE_CITIES_PATH_BY_LOCALE } from '~/shared/global.utils'

export default defineSitemapEventHandler(() => [
  // Root index page: /safe-cities
  ...buildLocalizedEntries(
    (lang) => `${lang !== 'en' ? `/${lang}` : ''}/${SAFE_CITIES_PATH_BY_LOCALE[lang] ?? 'safe-cities'}`,
  ),
  // Context pages: /safe-cities/women, /safe-cities/europe, etc.
  ...SAFE_CITIES_CONTEXT_SLUGS.flatMap((slug) =>
    buildLocalizedEntries(
      (lang) => `${lang !== 'en' ? `/${lang}` : ''}/${SAFE_CITIES_PATH_BY_LOCALE[lang] ?? 'safe-cities'}/${slug}`,
    ),
  ),
])
