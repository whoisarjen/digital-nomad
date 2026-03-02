import type { H3Event } from 'h3';
import { LOCALE_SUFFIX_MAP, type Language } from '~/constants/global.constant';

export type CurrentLanguage = 'en';

export const getLocale = (event: H3Event): CurrentLanguage => {
  const lang = event.context.lang;
  return lang && lang in LOCALE_SUFFIX_MAP ? (lang as CurrentLanguage) : 'en';
};

export const getLocalizedSelect = <L extends Language>(lang: L) => LOCALE_SUFFIX_MAP[lang];
