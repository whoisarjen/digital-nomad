import { getArticlesByCitySchema } from '~/shared/global.schema';

export default defineEventHandler(async (event) => {
  const language = getLocale(event);
  const select = getLocalizedSelect(language);

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
          [`title${select}` as const]: true,
          [`excerpt${select}` as const]: true,
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
    title: item.article[`title${select}` as const] ?? null,
    excerpt: item.article[`excerpt${select}` as const] ?? null,
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
