import { tr, type Lang } from '@/content/i18n';
import { partnersCopy } from '@/content/copy/partners';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import styles from './delivery.module.css';

const copy = partnersCopy.delivery;

/** What Mufeed delivers (V06 p44–48). */
export function Delivery({ lang }: { lang: Lang }) {
  return (
    <section id="delivery" className={`container ${styles.section}`} aria-labelledby="delivery-title">
      <SectionHeader id="delivery-title" eyebrow={tr(copy.eyebrow, lang)} title={tr(copy.title, lang)} />
      <div className={styles.groups}>
        {copy.groups.map((group) => (
          <div key={group.title.en} className={styles.group}>
            <h3>{tr(group.title, lang)}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item.title.en}>
                  <strong>{tr(item.title, lang)}</strong>
                  <span>{tr(item.text, lang)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
