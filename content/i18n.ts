export type Lang = 'ar' | 'en';
export const langs: readonly Lang[] = ['ar', 'en'];

/** A string written in both site languages. */
export type L = { readonly ar: string; readonly en: string };

export function tr(value: L, lang: Lang): string {
  return value[lang];
}

export function dir(lang: Lang): 'rtl' | 'ltr' {
  return lang === 'ar' ? 'rtl' : 'ltr';
}

export type PageId = 'visitors' | 'partners';

/** Route paths without the deployment base path; see lib/asset-path.ts. */
export function pagePath(page: PageId, lang: Lang): string {
  const prefix = lang === 'en' ? '/en' : '';
  return page === 'visitors' ? `${prefix}/` : `${prefix}/partners/`;
}

/** Western digits with thousands separators, as printed in the source decks. */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/** Gregorian dates with Western digits in both languages. */
export function formatDate(
  isoDate: string,
  lang: Lang,
  options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  },
): string {
  const locale = lang === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB';
  return new Intl.DateTimeFormat(locale, {
    ...options,
    timeZone: 'Asia/Riyadh',
  }).format(new Date(`${isoDate}T12:00:00+03:00`));
}

export function formatSar(value: number, lang: Lang): string {
  return lang === 'ar'
    ? `${formatNumber(value)} ريال`
    : `SAR ${formatNumber(value)}`;
}
