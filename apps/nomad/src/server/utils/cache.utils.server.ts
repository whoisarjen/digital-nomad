import {
  createError,
  defineEventHandler as originalDefineEventHandler,
  getRequestURL,
  setResponseHeader,
  type H3Event,
} from 'h3';
import { addCacheTag } from '@vercel/functions';
import { CACHE_MAX_QUERY_PARAMS, CACHE_TAGS, CACHE_TTL_SECONDS, type CacheTag } from '~/constants/cache.constant';

/**
 * The CDN keys on the URL alone and cannot read the i18n_locale cookie that
 * `server/middleware/locale.ts` falls back to. Without an explicit `lang` the
 * first visitor's locale would be served to everyone, so those requests are
 * left uncached instead.
 */
const isCacheable = (url: URL, varyByLocale: boolean): boolean => {
  if (varyByLocale && !url.searchParams.has('lang')) {
    if (import.meta.dev) {
      throw createError({
        statusCode: 500,
        statusMessage: `Cached endpoint called without a lang query param: ${url.pathname}${url.search}. The CDN keys on the URL alone and cannot read the i18n_locale cookie, so the locale must be explicit or one locale is served to everyone.`,
      });
    }

    console.log(`[Cache] SKIP - no lang param, cannot key the CDN by locale - ${url.pathname}${url.search}`);
    return false;
  }

  if (url.searchParams.size > CACHE_MAX_QUERY_PARAMS) {
    console.log(`[Cache] SKIP - ${url.searchParams.size} params exceeds limit (${CACHE_MAX_QUERY_PARAMS}) - ${url.pathname}${url.search}`);
    return false;
  }

  return true;
};

type CacheHandlerOptions = {
  /**
   * Tags added on top of GLOBAL. Purging any of them with
   * `vercel cache invalidate --tag <tag>` drops this endpoint from the CDN.
   */
  tags?: CacheTag[];
  /** Override the one-year default for content that must not freeze that long. */
  ttlSeconds?: number;
  /**
   * Set false for a response that is byte-identical in every locale (exchange
   * rates, for instance). Those are cached even without a `lang` param, since
   * there is no locale for the CDN to key on in the first place.
   */
  varyByLocale?: boolean;
};

/**
 * Wraps a public read endpoint so its response is cached on Vercel's CDN.
 * `Vercel-CDN-Cache-Control` outranks both `CDN-Cache-Control` and
 * `Cache-Control`, and is consumed by the proxy rather than forwarded, so the
 * browser is unaffected.
 */
export const defineCustomCacheEventHandler = <T>(
  handler: (event: H3Event) => T | Promise<T>,
  options: CacheHandlerOptions = {},
) =>
  originalDefineEventHandler(async (event: H3Event) => {
    const url = getRequestURL(event);

    if (!isCacheable(url, options.varyByLocale ?? true)) {
      return await handler(event);
    }

    // Headers go on after the handler resolves, so a thrown error never gets
    // cached — it propagates with the default no-store response instead.
    const result = await handler(event);
    const ttlSeconds = options.ttlSeconds ?? CACHE_TTL_SECONDS;

    setResponseHeader(event, 'Vercel-CDN-Cache-Control', `public, s-maxage=${ttlSeconds}`);

    try {
      await addCacheTag([CACHE_TAGS.GLOBAL, ...options.tags ?? []]);
    } catch (error) {
      // Not running on Vercel (local dev, or a self-hosted build).
      console.error('[Cache] addCacheTag failed:', error);
    }

    return result;
  });
