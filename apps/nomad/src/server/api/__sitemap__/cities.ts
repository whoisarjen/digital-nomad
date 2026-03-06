export default defineSitemapEventHandler(async (event) => {
    const query = getQuery(event);
    const chunk = Number(query.chunk ?? 0);
    const total = Number(query.total ?? 1);

    const allCities = await prisma.city.findMany({
        select: { slug: true, updatedAt: true },
        orderBy: { name: 'asc' },
    });

    const citiesPerChunk = Math.ceil(allCities.length / total);
    const start = chunk * citiesPerChunk;
    const cities = allCities.slice(start, Math.min(start + citiesPerChunk, allCities.length));

    return cities.flatMap((city) =>
        buildLocalizedEntries(
            (lang) => `${lang !== 'en' ? `/${lang}` : ''}/cities/${city.slug}`,
            { lastmod: new Date(city.updatedAt).toISOString() },
        ),
    );
});
