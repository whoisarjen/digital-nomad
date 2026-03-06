import { LANGUAGES } from '~/constants/global.constant';

export default defineSitemapEventHandler(async () => {
    const articles = await prisma.article.findMany({
        where: { isPublished: true, publishedAt: { lte: new Date() } },
        select: { slug: true, updatedAt: true },
        orderBy: { publishedAt: 'desc' },
    });

    return articles.flatMap((article) => {
        const variants = LANGUAGES.map((lang) => ({
            lang,
            loc: `${lang !== 'en' ? `/${lang}` : ''}/blog/${article.slug}`,
        }));

        const alternatives = buildSitemapAlternatives(variants);

        return variants.map((v) => ({
            loc: v.loc,
            lastmod: new Date(article.updatedAt).toISOString(),
            alternatives,
        }));
    });
});
