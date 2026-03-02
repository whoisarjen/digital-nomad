import type { H3Event } from 'h3';
import { LOCALE_SUFFIX_MAP, type Language } from '~/constants/global.constant';

export const getLocale = (event: H3Event): Language => {
  const lang = event.context.lang;
  return lang && lang in LOCALE_SUFFIX_MAP ? (lang as Language) : 'en';
};

export const getLocalizedSelect = (lang: Language) => LOCALE_SUFFIX_MAP[lang];
