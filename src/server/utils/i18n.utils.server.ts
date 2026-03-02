import type { H3Event } from 'h3';
import { LOCALE_SUFFIX_MAP, type Language } from '~/constants/global.constant';

export const getLocale = (event: H3Event): Language =>
  (event.context.lang ?? 'en') as Language;

export const getLocalizedSelect = (language: Language, ...fields: string[]) => {
  const suffix = LOCALE_SUFFIX_MAP[language];
  const enSuffix = LOCALE_SUFFIX_MAP.en;
  const select: Record<string, boolean> = {};

  for (const field of fields) {
    select[`${field}${suffix}`] = true;
    if (suffix !== enSuffix) {
      select[`${field}${enSuffix}`] = true;
    }
  }

  return select;
};

export const localized = (obj: Record<string, any>, field: string, language: Language): string => {
  const suffix = LOCALE_SUFFIX_MAP[language];
  return obj[`${field}${suffix}`] ?? obj[`${field}${LOCALE_SUFFIX_MAP.en}`] ?? '';
};
