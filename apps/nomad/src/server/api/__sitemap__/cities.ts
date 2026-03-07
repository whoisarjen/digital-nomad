const CHUNK_SIZE = 100;

export default defineSitemapEventHandler(async (event) => {
    const query = getQuery(event);
    const chunk = Number(query.chunk ?? 0);

    const cities = await prisma.city.findMany({
        select: { slug: true, updatedAt: true },
        orderBy: { name: 'asc' },
        skip: chunk * CHUNK_SIZE,
        take: CHUNK_SIZE,
    });

    return cities.flatMap((city) =>
        buildLocalizedEntries(
            (lang) => `${lang !== 'en' ? `/${lang}` : ''}/cities/${city.slug}`,
            { lastmod: new Date(city.updatedAt).toISOString() },
        ),
    );
});
