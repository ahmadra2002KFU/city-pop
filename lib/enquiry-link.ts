import { tiers, type TierId } from '@/content/sponsorship';
import { unitTypes, type UnitTypeId } from '@/content/units';

/**
 * Prefill contract for the enquiry form. Links point at `#enquire?…` so the page
 * never reloads; the Enquire section listens for hash changes, applies the
 * values and scrolls itself into view.
 */
export type EnquiryPrefill = {
  interest?: 'unit' | 'sponsor' | 'other';
  unitType?: UnitTypeId;
  unit?: string;
  tier?: TierId;
};

export const enquiryAnchor = 'enquire';

export function enquiryHref(prefill: EnquiryPrefill): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(prefill)) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return `#${enquiryAnchor}${query ? `?${query}` : ''}`;
}

/**
 * Reads `#enquire?…`. Returns null for any other hash. Values that do not exist in
 * the content layer (an unknown unit type, a unit number of another type, an
 * unknown tier) are dropped rather than passed on, so a stale or hand-edited
 * link can never put an impossible selection into the form.
 */
export function parseEnquiryHash(hash: string): EnquiryPrefill | null {
  const value = hash.replace(/^#/, '');
  if (value !== enquiryAnchor && !value.startsWith(`${enquiryAnchor}?`)) {
    return null;
  }
  const params = new URLSearchParams(value.slice(enquiryAnchor.length + 1));
  const interest = params.get('interest');
  const type = unitTypes.find((item) => item.id === params.get('unitType'));
  const unit = params.get('unit');
  const tier = tiers.find((item) => item.id === params.get('tier'));
  return {
    interest:
      interest === 'unit' || interest === 'sponsor' || interest === 'other'
        ? interest
        : type
          ? 'unit'
          : tier
            ? 'sponsor'
            : undefined,
    unitType: type?.id,
    unit: type && unit && type.units.includes(unit) ? unit : undefined,
    tier: tier?.id,
  };
}

/** True when the hash carried at least one selection, not just `#enquire`. */
export function hasSelection(prefill: EnquiryPrefill): boolean {
  return Boolean(
    prefill.interest || prefill.unitType || prefill.unit || prefill.tier,
  );
}
