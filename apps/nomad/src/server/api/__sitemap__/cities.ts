export default defineSitemapEventHandler(async () => {
    const cities = await prisma.city.findMany({
        select: { slug: true, updatedAt: true },
        orderBy: { name: 'asc' },
    });

    return cities.flatMap((city) =>
        buildLocalizedEntries(
            (lang) => `${lang !== 'en' ? `/${lang}` : ''}/cities/${city.slug}`,
            { lastmod: new Date(city.updatedAt).toISOString() },
        ),
    );
});
