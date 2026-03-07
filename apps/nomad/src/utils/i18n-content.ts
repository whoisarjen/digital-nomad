import { LOCALE_BCP47_MAP } from '~/constants/global.constant';

export const getLocaleBcp47 = (locale: string): string => {
  return LOCALE_BCP47_MAP[locale as keyof typeof LOCALE_BCP47_MAP] ?? 'en-US';
};

export const getHtmlDir = (locale: string): 'rtl' | 'ltr' => {
  return locale === 'ar' ? 'rtl' : 'ltr';
};
