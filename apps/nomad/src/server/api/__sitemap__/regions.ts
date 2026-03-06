import { LANGUAGES } from '~/constants/global.constant'
import { REGION_SLUGS, REGION_PATH_BY_LOCALE } from '~/shared/global.utils'

export default defineSitemapEventHandler(() => {
  return REGION_SLUGS.flatMap((slug) => {
    const variants = LANGUAGES.map((lang) => ({
      lang,
      loc: `${lang !== 'en' ? `/${lang}` : ''}/${REGION_PATH_BY_LOCALE[lang] ?? 'regions'}/${slug}`,
    }))

    const alternatives = buildSitemapAlternatives(variants)

    return variants.map((v) => ({
      loc: v.loc,
      alternatives,
    }))
  })
})
