import { getArticleBySlugSchema } from '~/shared/global.schema';

export default defineEventHandler(async (event) => {
  const { slug } = await getValidatedRouterParams(event, getArticleBySlugSchema.parse);

  return await prisma.article.findFirstOrThrow({
    where: {
      slug,
      isPublished: true,
      publishedAt: { lte: new Date() },
    },
    select: {
      slug: true,
      titleEn: true,
      titlePl: true,
      excerptEn: true,
      excerptPl: true,
      contentEn: true,
      contentPl: true,
      metaTitleEn: true,
      metaDescEn: true,
      metaTitlePl: true,
      metaDescPl: true,
      featuredImageUrl: true,
      featuredImageAlt: true,
      featuredImageOwnerName: true,
      featuredImageOwnerUsername: true,
      readingTimeMinutes: true,
      publishedAt: true,
      updatedAt: true,
      cities: {
        select: {
          isPrimary: true,
          city: {
            select: {
              slug: true,
              name: true,
              country: true,
              image: { select: { url: true } },
            },
          },
        },
      },
      faqs: true,
    },
  });
});
