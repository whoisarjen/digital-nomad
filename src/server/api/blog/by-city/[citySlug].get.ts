import { getArticlesByCitySchema } from '~/shared/global.schema';

export default defineEventHandler(async (event) => {
  const language = getLocale(event);
  const select = getLocalizedSelect(language, 'title', 'excerpt');

  const { citySlug } = await getValidatedRouterParams(event, getArticlesByCitySchema.parse);

  const mappings = await prisma.articleCityMap.findMany({
    where: {
      citySlug,
      article: { isPublished: true, publishedAt: { lte: new Date() } },
    },
    orderBy: [
      { isPrimary: 'desc' },
      { article: { publishedAt: 'desc' } },
    ],
    take: 2,
    select: {
      isPrimary: true,
      article: {
        select: {
          slug: true,
          ...select,
          featuredImageUrl: true,
          featuredImageOwnerName: true,
          featuredImageOwnerUsername: true,
          readingTimeMinutes: true,
          publishedAt: true,
        },
      },
    },
  });

  const data = mappings.map((item) => ({
    slug: item.article.slug,
    title: localized(item.article, 'title', language),
    excerpt: localized(item.article, 'excerpt', language),
    featuredImageUrl: item.article.featuredImageUrl,
    featuredImageOwnerName: item.article.featuredImageOwnerName,
    featuredImageOwnerUsername: item.article.featuredImageOwnerUsername,
    readingTimeMinutes: item.article.readingTimeMinutes,
    publishedAt: item.article.publishedAt,
    isPrimary: item.isPrimary,
  }));

  return {
    data,
  };
});
