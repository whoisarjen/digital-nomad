import { LANGUAGES } from '~/constants/global.constant';
import { buildCompareSlug } from '~/shared/global.utils';

export default defineSitemapEventHandler(async () => {
    const cities = await prisma.city.findMany({
        select: { slug: true },
        orderBy: { slug: 'asc' },
    });

    const entries: { loc: string; _sitemap: string; alternatives: { hreflang: string; href: string }[] }[] = [];

    for (let i = 0; i < cities.length; i++) {
        for (let j = i + 1; j < cities.length; j++) {
            const slug = buildCompareSlug(cities[i].slug, cities[j].slug);
            const path = `/compare/${slug}`;

            const variants = LANGUAGES.map((lang) => ({
                lang,
                loc: `${lang !== 'en' ? `/${lang}` : ''}${path}`,
            }));

            const alternatives = buildSitemapAlternatives(variants);

            for (const v of variants) {
                entries.push({
                    loc: v.loc,
                    _sitemap: v.lang,
                    alternatives,
                });
            }
        }
    }

    return entries;
});
