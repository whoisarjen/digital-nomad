export default defineSitemapEventHandler(async () => {
    const articles = await prisma.article.findMany({
        where: { isPublished: true, publishedAt: { lte: new Date() } },
        select: { slug: true, updatedAt: true },
        orderBy: { publishedAt: 'desc' },
    });

    return articles.flatMap((article) =>
        buildLocalizedEntries(
            (lang) => `${lang !== 'en' ? `/${lang}` : ''}/blog/${article.slug}`,
            { lastmod: new Date(article.updatedAt).toISOString() },
        ),
    );
});
