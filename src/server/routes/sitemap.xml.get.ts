const BASE_URL = 'https://nomad.whoisarjen.com';

const toUrl = (
  loc: string,
  lastmod: string | null,
  alternates: { lang: string; href: string }[],
) => {
  const lastmodTag = lastmod ? `<lastmod>${lastmod}</lastmod>` : '';
  const xhtmlLinks = alternates
    .map(
      (a) =>
        `<xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.href}" />`,
    )
    .join('\n    ');
  return `  <url>
    <loc>${loc}</loc>${lastmodTag}
    ${xhtmlLinks}
  </url>`;
};

const i18nAlternates = (path: string) => [
  { lang: 'en', href: `${BASE_URL}${path}` },
  { lang: 'pl', href: `${BASE_URL}/pl${path}` },
  { lang: 'x-default', href: `${BASE_URL}${path}` },
];

export default defineEventHandler(async (event) => {
  const today = new Date().toISOString().split('T')[0];

  // Static pages
  const staticUrls = [
    toUrl(`${BASE_URL}/`, today, i18nAlternates('/')),
    toUrl(`${BASE_URL}/pl/`, today, i18nAlternates('/')),
    toUrl(`${BASE_URL}/blog`, today, i18nAlternates('/blog')),
    toUrl(`${BASE_URL}/pl/blog`, today, i18nAlternates('/blog')),
  ];

  // City pages
  const cities = await prisma.city.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { name: 'asc' },
  });

  const cityUrls = cities.flatMap((city) => {
    const lastmod = city.updatedAt.toISOString().split('T')[0];
    const alts = i18nAlternates(`/cities/${city.slug}`);
    return [
      toUrl(`${BASE_URL}/cities/${city.slug}`, lastmod, alts),
      toUrl(`${BASE_URL}/pl/cities/${city.slug}`, lastmod, alts),
    ];
  });

  // Blog articles
  const articles = await prisma.article.findMany({
    where: { isPublished: true, publishedAt: { lte: new Date() } },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: 'desc' },
  });

  const articleUrls = articles.flatMap((article) => {
    const lastmod = article.updatedAt.toISOString().split('T')[0];
    const alts = i18nAlternates(`/blog/${article.slug}`);
    return [
      toUrl(`${BASE_URL}/blog/${article.slug}`, lastmod, alts),
      toUrl(`${BASE_URL}/pl/blog/${article.slug}`, lastmod, alts),
    ];
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...staticUrls, ...cityUrls, ...articleUrls].join('\n')}
</urlset>`;

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8');
  setResponseHeader(event, 'cache-control', 'public, max-age=3600, s-maxage=3600');
  return xml;
});
