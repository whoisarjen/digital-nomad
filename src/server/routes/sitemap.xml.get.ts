import { LOCALES } from '~/constants/global.constant';

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
  ...LOCALES.map(l => ({
    lang: l.code,
    href: l.code === 'en' ? `${BASE_URL}${path}` : `${BASE_URL}/${l.code}${path}`,
  })),
  { lang: 'x-default', href: `${BASE_URL}${path}` },
];

const localeUrls = (path: string, lastmod: string | null) =>
  LOCALES.map(l =>
    toUrl(
      l.code === 'en' ? `${BASE_URL}${path}` : `${BASE_URL}/${l.code}${path}`,
      lastmod,
      i18nAlternates(path),
    )
  );

export default defineEventHandler(async (event) => {
  const today = new Date().toISOString().split('T')[0];

  // Static pages
  const staticPaths = ['/', '/blog'];
  const staticUrls = staticPaths.flatMap(path => localeUrls(path, today));

  // City pages
  const cities = await prisma.city.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { name: 'asc' },
  });

  const cityUrls = cities.flatMap((city) => {
    const lastmod = city.updatedAt.toISOString().split('T')[0];
    return localeUrls(`/cities/${city.slug}`, lastmod);
  });

  // Blog articles
  const articles = await prisma.article.findMany({
    where: { isPublished: true, publishedAt: { lte: new Date() } },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: 'desc' },
  });

  const articleUrls = articles.flatMap((article) => {
    const lastmod = article.updatedAt.toISOString().split('T')[0];
    return localeUrls(`/blog/${article.slug}`, lastmod);
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
