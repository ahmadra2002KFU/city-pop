import {
  benefitGroups,
  tiers,
  type BenefitRow,
  type Cell,
  type TierId,
} from '@/content/sponsorship';

/**
 * Editorial pick of the rights that set each tier apart, shown on the tier cards.
 * Rows are looked up in the deck matrix (content/sponsorship.ts) by group id and
 * English label, and the value shown is always the matrix cell, so a card can never
 * claim more than the comparison table. A missing row fails the build.
 */
const picks: Record<TierId, readonly (readonly [groupId: string, label: string])[]> = {
  platinum: [
    ['naming', 'Name one of the six zones after your brand'],
    ['association', 'Category exclusivity'],
    ['activation', 'A private activation inside The Hub'],
    ['visibility', 'Flags at the main entrance'],
  ],
  gold: [
    ['naming', 'Name an activation inside a zone'],
    ['space', '3×3 display space in SOCIAL POP'],
    ['media', 'Dedicated posts on the event accounts'],
    ['hospitality', 'VIP tickets for the main stage'],
  ],
  silver: [
    ['visibility', 'Event promotional boards'],
    ['media', 'Logo on all of the event’s social platforms'],
    ['media', 'Dedicated posts on the event accounts'],
    ['hospitality', 'VIP tickets for the main stage'],
  ],
};

export type Highlight = { row: BenefitRow; cell: Cell };

export function tierHighlights(tierId: TierId): Highlight[] {
  const tierIndex = tiers.findIndex((tier) => tier.id === tierId);
  return picks[tierId].map(([groupId, label]) => {
    const row = benefitGroups
      .find((group) => group.id === groupId)
      ?.rows.find((item) => item.label.en === label);
    if (!row) throw new Error(`Sponsorship highlight not found in the matrix: ${groupId} / ${label}`);
    const cell = row.values[tierIndex];
    if (cell === false) throw new Error(`Highlight "${label}" is not included in ${tierId}`);
    return { row, cell };
  });
}
