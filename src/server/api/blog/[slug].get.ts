import { getArticleBySlugSchema } from '~/shared/global.schema';
import type { Suffix } from '~/constants/global.constant';

type FaqJson = Record<`${'question' | 'answer'}${Suffix}`, string | null>;

export default defineEventHandler(async (event) => {
  const language = getLocale(event);
  const select = getLocalizedSelect(language);

  const { slug } = await getValidatedRouterParams(event, getArticleBySlugSchema.parse);

  const article = await prisma.article.findFirstOrThrow({
    where: {
      slug,
      isPublished: true,
      publishedAt: { lte: new Date() },
    },
    include: {
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
    },
  });

  const rawFaqs = Array.isArray(article.faqs) ? (article.faqs as FaqJson[]) : [];
  const faqs = rawFaqs.map((faq) => ({
    question: faq[`question${select}`] ?? null,
    answer: faq[`answer${select}`] ?? null,
  }));

  return {
    slug: article.slug,
    title: article[`title${select}`] ?? null,
    excerpt: article[`excerpt${select}`] ?? null,
    content: article[`content${select}`] ?? null,
    metaTitle: article[`metaTitle${select}`] ?? null,
    metaDesc: article[`metaDesc${select}`] ?? null,
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
