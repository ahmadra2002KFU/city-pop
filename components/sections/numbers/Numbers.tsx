import { formatNumber, tr, type Lang } from '@/content/i18n';
import { facts, stageSeatTotal } from '@/content/facts';
import { totalUnits } from '@/content/units';
import { partnersCopy } from '@/content/copy/partners';
import styles from './numbers.module.css';

const copy = partnersCopy.numbers;

export function Numbers({ lang }: { lang: Lang }) {
  const stats = [
    { value: formatNumber(facts.area.value), label: copy.area },
    { value: formatNumber(facts.expectedVisitors.value), label: copy.visitors },
    { value: String(facts.operatingDays.value), label: copy.days },
    { value: String(facts.zoneCount.value).padStart(2, '0'), label: copy.zones },
    { value: String(totalUnits), label: copy.units },
    { value: formatNumber(stageSeatTotal), label: copy.seats },
  ];
  return (
    <section id="numbers" className={`container ${styles.section}`} aria-labelledby="numbers-title">
      <h2 id="numbers-title" className={styles.title}>
        {tr(copy.eyebrow, lang)}
      </h2>
      <dl className={styles.grid}>
        {stats.map((stat) => (
          <div key={stat.label.en}>
            <dt>{tr(stat.label, lang)}</dt>
            <dd className="latin">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
