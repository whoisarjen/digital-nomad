export const LOCALES = [
  { code: 'en', name: 'English' },
  { code: 'pl', name: 'Polski' },
] as const;

export type Language = (typeof LOCALES)[number]['code'];

export const LANGUAGES = LOCALES.map(l => l.code) as unknown as readonly [Language, ...Language[]];
