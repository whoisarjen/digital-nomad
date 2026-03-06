import { LANGUAGES } from '~/constants/global.constant';

type SitemapVariant = {
    lang: string;
    loc: string;
};

export const buildSitemapAlternatives = (variants: SitemapVariant[]) => {
    if (variants.length <= 1) return [];

    const enVariant = variants.find(v => v.lang === 'en');

    return [
        ...variants.map(v => ({ hreflang: v.lang, href: v.loc })),
        { hreflang: 'x-default', href: enVariant?.loc ?? variants[0]!.loc },
    ];
};

export const buildLocalizedEntries = <T extends object>(
    buildLoc: (lang: string) => string,
    extra?: T,
) => {
    const variants = LANGUAGES.map(lang => ({ lang, loc: buildLoc(lang) }));
    const alternatives = buildSitemapAlternatives(variants);
    return variants.map(v => ({ loc: v.loc, ...extra, alternatives }));
};
