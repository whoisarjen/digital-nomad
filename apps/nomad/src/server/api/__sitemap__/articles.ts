const CHUNK_SIZE = 50;

export default defineSitemapEventHandler(async (event) => {
    const query = getQuery(event);
    const chunk = Number(query.chunk ?? 0);

    const articles = await prisma.article.findMany({
        where: { isPublished: true, publishedAt: { lte: new Date() } },
        select: { slug: true, updatedAt: true },
        orderBy: { publishedAt: 'desc' },
        skip: chunk * CHUNK_SIZE,
        take: CHUNK_SIZE,
    });

    return articles.flatMap((article) =>
        buildLocalizedEntries(
            (lang) => `${lang !== 'en' ? `/${lang}` : ''}/blog/${article.slug}`,
            { lastmod: new Date(article.updatedAt).toISOString() },
        ),
    );
});
