/**
 * Vercel's CDN accepts an s-maxage between 1 second and 31536000 seconds
 * (1 year); we use the maximum. Nothing expires these responses on a timer —
 * a new deployment starts every endpoint with an empty cache, and a single
 * group can be dropped on demand with `vercel cache invalidate --tag <tag>`.
 */
export const CACHE_TTL_SECONDS = 31536000;

/** A request carrying more query params than this is never cached. */
export const CACHE_MAX_QUERY_PARAMS = 16;

/**
 * Cache tags group endpoints so one purge can clear a whole content area.
 * Every cached endpoint carries GLOBAL plus whatever it reads from.
 */
export const CACHE_TAGS = {
  GLOBAL: 'cache-global',
  CITIES: 'cache-cities',
  COUNTRIES: 'cache-countries',
  ARTICLES: 'cache-articles',
  COMMUNITY: 'cache-community',
  EXCHANGE_RATES: 'cache-exchange-rates',
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];
