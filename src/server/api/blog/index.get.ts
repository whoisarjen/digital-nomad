import { type Prisma } from '@prisma/client';
import { getArticlesSchema } from '~/shared/global.schema';
import { LOCALE_SUFFIX_MAP } from '~/constants/global.constant';

export default defineEventHandler(async (event) => {
  const language = getLocale(event);
  const select = getLocalizedSelect(language, 'title', 'excerpt');

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
      [`title${LOCALE_SUFFIX_MAP[language]}`]: {
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
        ...select,
        featuredImageUrl: true,
        featuredImageAlt: true,
        featuredImageOwnerName: true,
        featuredImageOwnerUsername: true,
        readingTimeMinutes: true,
        publishedAt: true,
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
    title: localized(item, 'title', language),
    excerpt: localized(item, 'excerpt', language),
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
