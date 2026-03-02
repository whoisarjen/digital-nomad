import { type Prisma } from '@prisma/client';
import { getArticlesSchema } from '~/shared/global.schema';

export default defineEventHandler(async (event) => {
  const language = getLocale(event);
  const select = getLocalizedSelect(language);

  const validatedQuery = await getValidatedQuery(event, (body) =>
    getArticlesSchema.parse(body),
  );

  const { page, limit } = validatedQuery;

  const AND: Prisma.ArticleWhereInput[] = [
    { isPublished: true },
    { publishedAt: { lte: new Date() } },
  ];

  if (validatedQuery.q) {
    AND.push({
      [`title${select}`]: {
        contains: validatedQuery.q,
        mode: 'insensitive',
      },
    });
  }

  if (validatedQuery.city) {
    AND.push({ cities: { some: { citySlug: validatedQuery.city } } });
  }

  const where = { AND };

  const [articlesRaw, count] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
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
      include: {
        cities: {
          select: {
            isPrimary: true,
            city: {
              select: { slug: true, name: true, country: true },
            },
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.article.count({ where }),
  ]);

  const data = articlesRaw.map((item) => ({
    slug: item.slug,
    title: item[`title${select}`] ?? null,
    excerpt: item[`excerpt${select}`] ?? null,
    featuredImageUrl: item.featuredImageUrl,
    featuredImageAlt: item.featuredImageAlt,
    featuredImageOwnerName: item.featuredImageOwnerName,
    featuredImageOwnerUsername: item.featuredImageOwnerUsername,
    readingTimeMinutes: item.readingTimeMinutes,
    publishedAt: item.publishedAt,
    cities: item.cities,
  }));

  const pagesCount = Math.ceil(count / limit);

  return {
    data,
    count,
    pagesCount,
  };
});
