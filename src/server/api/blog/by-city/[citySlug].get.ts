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
    include: {
      article: {
        omit: {
          contentEn: true, contentPl: true, contentEs: true, contentDe: true,
          contentPt: true, contentFr: true, contentKo: true, contentAr: true,
          contentTr: true, contentJa: true, contentIt: true,
          metaTitleEn: true, metaTitlePl: true, metaTitleEs: true, metaTitleDe: true,
          metaTitlePt: true, metaTitleFr: true, metaTitleKo: true, metaTitleAr: true,
          metaTitleTr: true, metaTitleJa: true, metaTitleIt: true,
          metaDescEn: true, metaDescPl: true, metaDescEs: true, metaDescDe: true,
          metaDescPt: true, metaDescFr: true, metaDescKo: true, metaDescAr: true,
          metaDescTr: true, metaDescJa: true, metaDescIt: true,
          faqs: true,
          createdAt: true,
        },
      },
    },
  });

  const data = mappings.map((item) => ({
    slug: item.article.slug,
    title: item.article[`title${select}`] ?? null,
    excerpt: item.article[`excerpt${select}`] ?? null,
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
