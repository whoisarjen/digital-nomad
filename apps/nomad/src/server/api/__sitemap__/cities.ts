import { LANGUAGES } from '~/constants/global.constant';

export default defineSitemapEventHandler(async () => {
    const cities = await prisma.city.findMany({
        select: { slug: true, updatedAt: true },
        orderBy: { name: 'asc' },
    });

    return cities.flatMap((city) => {
        const variants = LANGUAGES.map((lang) => ({
            lang,
            loc: `${lang !== 'en' ? `/${lang}` : ''}/cities/${city.slug}`,
        }));

        const alternatives = buildSitemapAlternatives(variants);

        return variants.map((v) => ({
            loc: v.loc,
            _sitemap: v.lang,
            lastmod: new Date(city.updatedAt).toISOString(),
            alternatives,
        }));
    });
});
