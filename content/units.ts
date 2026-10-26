import type { L } from './i18n';
import type { ZoneId } from './zones';

/**
 * Leasable units from the partnerships deck (Part p6–61).
 * Every unit is offered for the same 40-day term; prices are "قيمة الاستثمار" in SAR
 * and the deck does not say whether they include VAT. Availability is not stated,
 * so the site never claims a unit is free or taken.
 */
export const leaseTermDays = 40;

export type UnitTypeId =
  | 'main-store-large'
  | 'main-store'
  | 'secondary-store'
  | 'quality-dining'
  | 'lounge'
  | 'fnb-kiosk';

export type UnitType = {
  id: UnitTypeId;
  zone: ZoneId;
  name: L;
  /** Who the deck implies the unit is for; the deck itself does not say. */
  idealFor: L;
  width: number;
  depth: number;
  height: number;
  price: number;
  /** Unit labels exactly as numbered in the deck. */
  units: readonly string[];
  source: string;
};

const pad = (n: number) => String(n).padStart(2, '0');
const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => pad(from + i));

const largeHubStores = ['01', '05', '06', '10', '11', '15', '16', '20'];

export const unitTypes: readonly UnitType[] = [
  {
    id: 'main-store-large',
    zone: 'hub',
    name: { ar: 'متجر رئيسي كبير', en: 'Main store, large' },
    idealFor: {
      ar: 'المتاجر الرئيسية للعلامات التجارية',
      en: 'Brand flagship stores',
    },
    width: 20,
    depth: 20,
    height: 5,
    price: 300_000,
    units: largeHubStores,
    source: 'Part p6–13',
  },
  {
    id: 'main-store',
    zone: 'hub',
    name: { ar: 'متجر رئيسي', en: 'Main store' },
    idealFor: {
      ar: 'العلامات التجارية ومتاجر التجزئة',
      en: 'Brands and retailers',
    },
    width: 10,
    depth: 20,
    height: 5,
    price: 150_000,
    units: range(1, 20).filter((n) => !largeHubStores.includes(n)),
    source: 'Part p14–25',
  },
  {
    id: 'secondary-store',
    zone: 'social',
    name: { ar: 'متجر ثانوي', en: 'Boutique store' },
    idealFor: {
      ar: 'المتاجر الصغيرة والمشاريع الناشئة',
      en: 'Smaller retailers and emerging brands',
    },
    width: 3,
    depth: 3,
    height: 3,
    price: 11_700,
    units: range(1, 24),
    source: 'Part p27–50',
  },
  {
    id: 'quality-dining',
    zone: 'fnb',
    name: { ar: 'مطعم (Quality Dining)', en: 'Quality dining' },
    idealFor: { ar: 'المطاعم', en: 'Sit-down restaurants' },
    width: 20,
    depth: 20,
    height: 6,
    price: 100_000,
    units: range(1, 4),
    source: 'Part p52–55',
  },
  {
    id: 'lounge',
    zone: 'fnb',
    name: { ar: 'لاونج', en: 'Lounge' },
    idealFor: {
      ar: 'المقاهي ومفاهيم الضيافة',
      en: 'Cafés and lounge concepts',
    },
    width: 30,
    depth: 20,
    height: 6,
    price: 150_000,
    units: ['01'],
    source: 'Part p56',
  },
  {
    id: 'fnb-kiosk',
    zone: 'fnb',
    name: { ar: 'كشك مأكولات ومشروبات', en: 'F&B kiosk' },
    idealFor: {
      ar: 'مفاهيم الأطعمة والمشروبات السريعة',
      en: 'Grab-and-go food and drink',
    },
    width: 6,
    depth: 3,
    height: 3,
    price: 21_600,
    units: range(1, 5),
    source: 'Part p57–61',
  },
];

export function unitArea(type: UnitType): number {
  return type.width * type.depth;
}

/** Stable identifier for one unit, used by the map and the enquiry form. */
export function unitKey(type: UnitTypeId, unit: string): string {
  return `${type}:${unit}`;
}

export const totalUnits = unitTypes.reduce(
  (sum, type) => sum + type.units.length,
  0,
);
