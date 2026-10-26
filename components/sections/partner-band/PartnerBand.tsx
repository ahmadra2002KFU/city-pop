import { ArrowRight } from 'lucide-react';
import { assetPath } from '@/lib/asset-path';
import { formatNumber, pagePath, tr, type Lang } from '@/content/i18n';
import { facts } from '@/content/facts';
import { totalUnits } from '@/content/units';
import { tiers } from '@/content/sponsorship';
import { visitorsCopy } from '@/content/copy/visitors';
import styles from './partner-band.module.css';

const copy = visitorsCopy.partnerBand;

/** Visitor-page bridge to the partners page: the one light, full-gradient panel on the page. */
export function PartnerBand({ lang }: { lang: Lang }) {
  const stats = [
    { key: 'visitors', value: formatNumber(facts.expectedVisitors.value), label: copy.visitors },
    { key: 'units', value: String(totalUnits), label: copy.units },
    { key: 'tiers', value: String(tiers.length), label: copy.tiers },
  ];
  return (
    <section className={`container ${styles.wrap}`} aria-labelledby="partner-band-title">
      <div className={styles.band}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{tr(copy.eyebrow, lang)}</p>
          <h2 id="partner-band-title">{tr(copy.title, lang)}</h2>
          <p className={styles.text}>{tr(copy.text, lang)}</p>
        </div>
        <dl className={styles.stats}>
          {stats.map((stat) => (
            <div key={stat.key}>
              <dt>{tr(stat.label, lang)}</dt>
              <dd className="latin">{stat.value}</dd>
            </div>
          ))}
        </dl>
        <a className={styles.cta} href={assetPath(pagePath('partners', lang))}>
          {tr(copy.cta, lang)}
          <ArrowRight aria-hidden size={18} className={styles.arrow} />
        </a>
      </div>
    </section>
  );
}
