export const LOCALES = [
  { code: 'en', name: 'English' },
  { code: 'pl', name: 'Polski' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'pt', name: 'Português' },
  { code: 'fr', name: 'Français' },
  { code: 'ko', name: '한국어' },
  { code: 'ar', name: 'العربية' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'ja', name: '日本語' },
  { code: 'it', name: 'Italiano' },
] as const;

export type Language = (typeof LOCALES)[number]['code'];

export const LANGUAGES = LOCALES.map(l => l.code) as unknown as readonly [Language, ...Language[]];

export const LOCALE_SUFFIX_MAP = {
  en: 'En',
  pl: 'Pl',
  es: 'Es',
  de: 'De',
  pt: 'Pt',
  fr: 'Fr',
  ko: 'Ko',
  ar: 'Ar',
  tr: 'Tr',
  ja: 'Ja',
  it: 'It',
} as const satisfies Record<Language, string>;

export type Suffix = (typeof LOCALE_SUFFIX_MAP)[Language];

export const LOCALE_BCP47_MAP: Record<Language, string> = {
  en: 'en-US',
  pl: 'pl-PL',
  es: 'es-ES',
  de: 'de-DE',
  pt: 'pt-BR',
  fr: 'fr-FR',
  ko: 'ko-KR',
  ar: 'ar-SA',
  tr: 'tr-TR',
  ja: 'ja-JP',
  it: 'it-IT',
};
