import { tr, type Lang } from '@/content/i18n';
import { returnCopy } from '@/content/copy/visitors';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import styles from './return.module.css';

/** Why visitors come back (V06 p50). Shared by both pages. */
export function ReturnReasons({ lang }: { lang: Lang }) {
  return (
    <section id="return" className={`container ${styles.section}`} aria-labelledby="return-title">
      <SectionHeader
        id="return-title"
        eyebrow={tr(returnCopy.eyebrow, lang)}
        title={tr(returnCopy.title, lang)}
        lead={tr(returnCopy.lead, lang)}
      />
      <ul className={styles.grid}>
        {returnCopy.items.map((item) => (
          <li key={item.title.en}>
            <h3>{tr(item.title, lang)}</h3>
            <p>{tr(item.text, lang)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
