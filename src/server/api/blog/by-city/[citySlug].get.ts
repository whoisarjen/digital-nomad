import { getArticlesByCitySchema } from '~/shared/global.schema';

export default defineEventHandler(async (event) => {
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
    take: 3,
    select: {
      isPrimary: true,
      article: {
        select: {
          slug: true,
          titleEn: true,
          titlePl: true,
          excerptEn: true,
          excerptPl: true,
          featuredImageUrl: true,
          readingTimeMinutes: true,
          publishedAt: true,
        },
      },
    },
  });

  return {
    data: mappings.map(m => ({ ...m.article, isPrimary: m.isPrimary })),
  };
});
