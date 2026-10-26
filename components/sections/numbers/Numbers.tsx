import { tr, type Lang, type L } from '@/content/i18n';
import { facts, stageSeatTotal } from '@/content/facts';
import { totalUnits } from '@/content/units';
import { partnersCopy } from '@/content/copy/partners';
import { CountUp } from './CountUp';
import styles from './numbers.module.css';

const copy = partnersCopy.numbers;

type Stat = { key: string; value: number; pad?: number; label: L };

export function Numbers({ lang }: { lang: Lang }) {
  const lead: Stat = { key: 'visitors', value: facts.expectedVisitors.value, label: copy.visitors };
  const stats: Stat[] = [
    { key: 'area', value: facts.area.value, label: copy.area },
    { key: 'days', value: facts.operatingDays.value, label: copy.days },
    { key: 'zones', value: facts.zoneCount.value, pad: 2, label: copy.zones },
    { key: 'units', value: totalUnits, label: copy.units },
    { key: 'seats', value: stageSeatTotal, label: copy.seats },
  ];
  return (
    <section id="numbers" className={styles.section} aria-labelledby="numbers-title">
      <div className="container">
        <h2 id="numbers-title" className={styles.title}>
          {tr(copy.eyebrow, lang)}
        </h2>
        <dl className={styles.grid}>
          <div className={styles.lead}>
            <dt>{tr(lead.label, lang)}</dt>
            <dd className="latin">
              <CountUp value={lead.value} />
            </dd>
          </div>
          {stats.map((stat) => (
            <div key={stat.key} className={styles[stat.key]}>
              <dt>{tr(stat.label, lang)}</dt>
              <dd className="latin">
                <CountUp value={stat.value} pad={stat.pad} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
