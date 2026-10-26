import { tr, type Lang } from '@/content/i18n';
import { visitorsCopy } from '@/content/copy/visitors';
import { partnersCopy } from '@/content/copy/partners';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import { PlanMap } from './PlanMap';
import styles from './site-map.module.css';

type SiteMapProps = {
  lang: Lang;
  /** Visitors see zones only; partners also get the leasable units. */
  variant: 'visitors' | 'partners';
};

export function SiteMap({ lang, variant }: SiteMapProps) {
  const copy =
    variant === 'visitors' ? visitorsCopy.map : partnersCopy.masterplan;
  const id = variant === 'visitors' ? 'map' : 'masterplan';
  return (
    <section
      id={id}
      className={`container ${styles.section}`}
      aria-labelledby={`${id}-title`}
    >
      <SectionHeader
        id={`${id}-title`}
        eyebrow={tr(copy.eyebrow, lang)}
        title={tr(copy.title, lang)}
        lead={tr(copy.lead, lang)}
      />
      <PlanMap lang={lang} variant={variant} />
    </section>
  );
}
