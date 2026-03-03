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
    select: {
      slug: true,
      [`title${select}` as const]: true,
      [`excerpt${select}` as const]: true,
      [`content${select}` as const]: true,
      [`metaTitle${select}` as const]: true,
      [`metaDesc${select}` as const]: true,
      featuredImageUrl: true,
      featuredImageAlt: true,
      featuredImageOwnerName: true,
      featuredImageOwnerUsername: true,
      readingTimeMinutes: true,
      publishedAt: true,
      updatedAt: true,
      faqs: true,
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
    title: article[`title${select}` as const] ?? null,
    excerpt: article[`excerpt${select}` as const] ?? null,
    content: article[`content${select}` as const] ?? null,
    metaTitle: article[`metaTitle${select}` as const] ?? null,
    metaDesc: article[`metaDesc${select}` as const] ?? null,
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
