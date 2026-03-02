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
      [`title${select}` as const]: {
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
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.article.count({ where }),
  ]);

  const data = articlesRaw.map((item) => ({
    slug: item.slug,
    title: item[`title${select}` as const] ?? null,
    excerpt: item[`excerpt${select}` as const] ?? null,
    featuredImageUrl: item.featuredImageUrl,
    featuredImageOwnerName: item.featuredImageOwnerName,
    featuredImageOwnerUsername: item.featuredImageOwnerUsername,
    readingTimeMinutes: item.readingTimeMinutes,
    publishedAt: item.publishedAt,
  }));

  const pagesCount = Math.ceil(count / limit);

  return {
    data,
    count,
    pagesCount,
  };
});
