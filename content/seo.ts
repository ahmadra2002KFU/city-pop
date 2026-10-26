import type { L } from './i18n';
import type { MediaId } from './media.generated';

/**
 * Sharing and search data that is not page copy: the social card and the
 * schema.org Event naming. Facts (dates, place, organiser) come from facts.ts.
 */
export const shareImage: { id: MediaId; alt: L } = {
  // 1200 × 630 crop of the gate render (assets/media.json "og-card").
  id: 'og-card',
  alt: {
    ar: 'تصوّر مبدئي لبوابة سيتي بوب المضيئة ليلًا',
    en: 'Concept visual of the illuminated City Pop gate at night',
  },
};

export const eventName: L = { ar: 'سيتي بوب', en: 'City Pop' };
