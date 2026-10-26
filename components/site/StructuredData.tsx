import { pagePath, tr, type Lang, type PageId } from '@/content/i18n';
import { facts } from '@/content/facts';
import { meta } from '@/content/site';
import { eventName } from '@/content/seo';
import { media } from '@/content/media.generated';
import { absoluteUrl } from '@/lib/site-url';
import { shareImageFile } from '@/lib/page-metadata';

/**
 * schema.org Event for City Pop, rendered as JSON-LD on every page.
 * Only confirmed facts are included: no street address (no venue is given in
 * any deck) and no offers (ticket prices are not announced).
 */
export function eventJsonLd(page: PageId, lang: Lang) {
  const gate = media.gate;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: tr(eventName, lang),
    alternateName: tr(eventName, lang === 'ar' ? 'en' : 'ar'),
    description: tr(meta.visitors.description, lang),
    inLanguage: lang,
    url: absoluteUrl(pagePath(page, lang)),
    startDate: facts.dates.start,
    endDate: facts.dates.end,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: [
        tr(facts.location.city, lang),
        tr(facts.location.region, lang),
      ].join(lang === 'ar' ? '، ' : ', '),
      address: {
        '@type': 'PostalAddress',
        addressLocality: facts.location.city.en,
        addressRegion: facts.location.region.en,
        // ISO 3166-1 code for facts.location.country (Saudi Arabia).
        addressCountry: 'SA',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: facts.organiser.name.en,
      alternateName: facts.organiser.name.ar,
    },
    image: [
      absoluteUrl(shareImageFile().path),
      absoluteUrl(`/media/${gate.fallback}`),
    ],
  };
}

/** Serialises JSON for a <script> element without allowing `</script>` breakouts. */
function safeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function StructuredData({ page, lang }: { page: PageId; lang: Lang }) {
  return (
    <script
      type="application/ld+json"
      // oxlint-disable-next-line react/no-danger -- JSON-LD must be emitted verbatim; input is escaped above.
      dangerouslySetInnerHTML={{ __html: safeJson(eventJsonLd(page, lang)) }}
    />
  );
}
