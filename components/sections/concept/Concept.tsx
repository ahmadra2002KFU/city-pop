import { tr, type Lang } from '@/content/i18n';
import { visitorsCopy } from '@/content/copy/visitors';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import styles from './concept.module.css';

const copy = visitorsCopy.concept;

export function Concept({ lang }: { lang: Lang }) {
  return (
    <section id="concept" className={`container ${styles.section}`} aria-labelledby="concept-title">
      <SectionHeader
        id="concept-title"
        eyebrow={tr(copy.eyebrow, lang)}
        title={tr(copy.title, lang)}
        lead={tr(copy.stat, lang)}
      />
      <div className={styles.compare}>
        {[copy.today, copy.cityPop].map((column, index) => (
          <div key={column.label.en} className={styles.column} data-highlight={index === 1}>
            <h3>{tr(column.label, lang)}</h3>
            <ol>
              {column.points.map((point, i) => (
                <li key={point.en}>
                  <span className="latin" aria-hidden>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {tr(point, lang)}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <h3 className={styles.motivationsTitle}>{tr(copy.motivationsTitle, lang)}</h3>
      <ul className={styles.motivations}>
        {copy.motivations.map((item) => (
          <li key={item.title.en}>
            <strong>{tr(item.title, lang)}</strong>
            <p>{tr(item.text, lang)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
