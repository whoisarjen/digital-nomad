import { buildCompareSlug } from '~/shared/global.utils';

export default defineSitemapEventHandler(async (event) => {
    const query = getQuery(event);
    const chunk = Number(query.chunk ?? 0);
    const total = Number(query.total ?? 1);

    const cities = await prisma.city.findMany({
        select: { slug: true },
        orderBy: { slug: 'asc' },
    });

    const citiesPerChunk = Math.ceil(cities.length / total);
    const startCity = chunk * citiesPerChunk;
    const endCity = Math.min(startCity + citiesPerChunk, cities.length);

    const entries: { loc: string; alternatives: { hreflang: string; href: string }[] }[] = [];

    for (let i = startCity; i < endCity; i++) {
        for (let j = i + 1; j < cities.length; j++) {
            const path = `/compare/${buildCompareSlug(cities[i]!.slug, cities[j]!.slug)}`;
            entries.push(...buildLocalizedEntries((lang) => `${lang !== 'en' ? `/${lang}` : ''}${path}`));
        }
    }

    return entries;
});
