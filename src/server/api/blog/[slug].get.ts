import { getArticleBySlugSchema } from '~/shared/global.schema';

export default defineEventHandler(async (event) => {
  const language = getLocale(event);
  const select = getLocalizedSelect(language, 'title', 'excerpt', 'content', 'metaTitle', 'metaDesc');

  const { slug } = await getValidatedRouterParams(event, getArticleBySlugSchema.parse);

  const article = await prisma.article.findFirstOrThrow({
    where: {
      slug,
      isPublished: true,
      publishedAt: { lte: new Date() },
    },
    select: {
      slug: true,
      ...select,
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

  const faqs = (article.faqs as any[] ?? []).map((faq: any) => ({
    question: localized(faq, 'question', language),
    answer: localized(faq, 'answer', language),
  }));

  return {
    slug: article.slug,
    title: localized(article, 'title', language),
    excerpt: localized(article, 'excerpt', language),
    content: localized(article, 'content', language),
    metaTitle: localized(article, 'metaTitle', language),
    metaDesc: localized(article, 'metaDesc', language),
    featuredImageUrl: article.featuredImageUrl,
    featuredImageAlt: article.featuredImageAlt,
    featuredImageOwnerName: article.featuredImageOwnerName,
    featuredImageOwnerUsername: article.featuredImageOwnerUsername,
    readingTimeMinutes: article.readingTimeMinutes,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    cities: article.cities,
    faqs,
  };
});
