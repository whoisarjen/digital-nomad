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
