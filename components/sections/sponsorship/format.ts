import { formatNumber, type L, type Lang } from '@/content/i18n';

/** Replace `{name}` placeholders in a copy template. Numbers use Western digits. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = values[key];
    if (value === undefined) return match;
    return typeof value === 'number' ? formatNumber(value) : value;
  });
}

type PluralForms = { one: L; two: L; few: L; many: L; other: L };

/** Pick the grammatical form for `count` (Arabic has one/two/few/many/other). */
export function plural(forms: PluralForms, count: number, lang: Lang): string {
  const category = new Intl.PluralRules(lang).select(count);
  const form = category in forms ? forms[category as keyof PluralForms] : forms.other;
  return fill(form[lang], { n: count });
}
