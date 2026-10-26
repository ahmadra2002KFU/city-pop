import { tr, type Lang } from '@/content/i18n';
import { mapNumbers, supportAreas, zones, type MapAreaId } from '@/content/zones';
import { visitorsCopy } from '@/content/copy/visitors';
import { partnersCopy } from '@/content/copy/partners';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import { Picture } from '@/components/primitives/Picture';
import styles from './site-map.module.css';

type SiteMapProps = {
  lang: Lang;
  /** Visitors see zones only; partners get the masterplan framing. */
  variant: 'visitors' | 'partners';
};

type LegendEntry = { id: MapAreaId; name: string; color: string; features: string[] };

function legend(lang: Lang): LegendEntry[] {
  const entries: LegendEntry[] = [
    ...zones.map((zone) => ({
      id: zone.id,
      name: zone.name,
      color: zone.color,
      features: zone.features.map((feature) => tr(feature, lang)),
    })),
    ...(['entrance', 'facilities'] as const).map((id) => ({
      id,
      name: tr(supportAreas[id].name, lang),
      color: supportAreas[id].color,
      features: supportAreas[id].features.map((feature) => tr(feature, lang)),
    })),
  ];
  return entries.sort((a, b) => mapNumbers[a.id] - mapNumbers[b.id]);
}

export function SiteMap({ lang, variant }: SiteMapProps) {
  const copy = variant === 'visitors' ? visitorsCopy.map : partnersCopy.masterplan;
  const id = variant === 'visitors' ? 'map' : 'masterplan';
  return (
    <section id={id} className={`container ${styles.section}`} aria-labelledby={`${id}-title`}>
      <SectionHeader
        id={`${id}-title`}
        eyebrow={tr(copy.eyebrow, lang)}
        title={tr(copy.title, lang)}
        lead={tr(copy.lead, lang)}
      />
      <figure className={styles.figure}>
        <Picture
          id="masterplan-zoned"
          alt={tr(copy.title, lang)}
          sizes="(max-width: 1240px) 100vw, 1200px"
          className={styles.plan}
        />
      </figure>
      <ol className={styles.legend}>
        {legend(lang).map((entry) => (
          <li key={entry.id} style={{ '--zone': entry.color } as React.CSSProperties}>
            <span className={`latin ${styles.number}`}>{mapNumbers[entry.id]}</span>
            <div>
              <strong>{entry.name}</strong>
              <p>{entry.features.join(lang === 'ar' ? '، ' : ', ')}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
