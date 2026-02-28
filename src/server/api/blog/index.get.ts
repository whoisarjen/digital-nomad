import { Prisma } from '@prisma/client';
import { getArticlesSchema } from '~/shared/global.schema';

const getArticlePrismaQuery = (query: ReturnType<typeof getArticlesSchema.parse>) => {
  const AND: Prisma.ArticleWhereInput[] = [
    { isPublished: true },
    { publishedAt: { lte: new Date() } },
  ];

  if (query.q) {
    AND.push({
      OR: [
        { titleEn: { contains: query.q, mode: 'insensitive' } },
        { titlePl: { contains: query.q, mode: 'insensitive' } },
      ],
    });
  }

  if (query.city) {
    AND.push({ cities: { some: { citySlug: query.city } } });
  }

  return { AND };
};

export default defineEventHandler(async (event) => {
  const validatedQuery = await getValidatedQuery(event, (body) =>
    getArticlesSchema.parse(body)
  );
  const where = getArticlePrismaQuery(validatedQuery);
  const { page, limit } = validatedQuery;

  const [articles, count] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      select: {
        slug: true,
        titleEn: true,
        titlePl: true,
        excerptEn: true,
        excerptPl: true,
        featuredImageUrl: true,
        featuredImageAlt: true,
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

  return {
    data: articles,
    count,
    pagesCount: Math.ceil(count / limit),
  };
});
