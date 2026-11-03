import { tr, type L, type Lang } from './i18n';

/**
 * Every event fact shown on the site, in one place.
 * `source` records where each value comes from; it is never rendered.
 * Deck abbreviations: V06 = "City PoP V06.pdf", Spons = "الرعايات - CITY POP.pdf",
 * Part = "الشراكات - CITY POP.pdf". Reviews live in "Claude Docs/source-review".
 */
export const facts = {
  dates: {
    // Rescheduled by Mufeed on 2026-11-03 (replaces 25 Nov 2026 – 5 Jan 2027 in the decks).
    // 28 Mar – 6 May 2027 is 40 days inclusive, matching operatingDays.
    start: '2027-03-28',
    end: '2027-05-06',
    source: 'Mufeed update 2026-11-03',
  },
  operatingDays: { value: 40, source: 'Spons p7; Part p4' },
  area: { value: 46_353, unit: 'm²', source: 'V06 p9; Spons p7; Part p4' },
  siteDimensions: {
    length: 380.2,
    depth: 121.92,
    source: 'V06 p9–10',
  },
  expectedVisitors: { value: 500_000, source: 'Spons p7; Part p4' },
  zoneCount: { value: 6, source: 'V06 p7; Spons p7' },
  stageSeats: { vip: 134, general: 1_496, source: 'V06 p10, p37' },
  location: {
    // Mufeed (2026-11-03): the location is the Eastern Province; no city is named.
    city: null as L | null,
    region: { ar: 'المنطقة الشرقية', en: 'Eastern Province' } satisfies L,
    country: { ar: 'المملكة العربية السعودية', en: 'Saudi Arabia' } satisfies L,
    // No venue or address is given in any deck.
    venue: null,
    source: 'Mufeed update 2026-11-03; V06 p5',
  },
  organiser: {
    name: { ar: 'شركة مفيد', en: 'Mufeed' } satisfies L,
  },
  /** Cities named as next stops, without dates (V06 p51). */
  nextCities: [
    { ar: 'الرياض', en: 'Riyadh' },
    { ar: 'جدة', en: 'Jeddah' },
    { ar: 'المدينة المنورة', en: 'Madinah' },
    { ar: 'جازان', en: 'Jazan' },
    { ar: 'عسير', en: 'Asir' },
    { ar: 'تبوك', en: 'Tabuk' },
    { ar: 'ينبع', en: 'Yanbu' },
    { ar: 'حفر الباطن', en: 'Hafr Al-Batin' },
  ] satisfies L[],
} as const;

/** "City, Region" when a city is confirmed, otherwise the region alone. */
export function placeName(lang: Lang): string {
  const { city, region } = facts.location;
  return city
    ? `${tr(city, lang)}${lang === 'ar' ? '، ' : ', '}${tr(region, lang)}`
    : tr(region, lang);
}

export const stageSeatTotal = facts.stageSeats.vip + facts.stageSeats.general;

export type EventPhase = 'upcoming' | 'live' | 'ended';

/** Opening and closing instants in Saudi time (UTC+3). */
export const eventWindow = {
  opensAt: new Date(`${facts.dates.start}T00:00:00+03:00`),
  closesAt: new Date(`${facts.dates.end}T23:59:59+03:00`),
};

export function eventPhase(now: Date): EventPhase {
  if (now < eventWindow.opensAt) return 'upcoming';
  if (now <= eventWindow.closesAt) return 'live';
  return 'ended';
}
