import { CalendarDays, Repeat, Sparkles, Tag, TicketPercent, Trophy, UserStar } from 'lucide-react';
import { tr, type Lang } from '@/content/i18n';
import { returnCopy } from '@/content/copy/visitors';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import styles from './return.module.css';

/** One icon per reason, in the order of V06 p50. */
const icons = [Tag, Sparkles, UserStar, CalendarDays, TicketPercent, Trophy];

/** Why visitors come back (V06 p50). Shared by both pages. */
export function ReturnReasons({ lang }: { lang: Lang }) {
  return (
    <section id="return" className={`container ${styles.section}`} aria-labelledby="return-title">
      <div className={styles.panel}>
        <div className={styles.intro}>
          <SectionHeader
            id="return-title"
            eyebrow={tr(returnCopy.eyebrow, lang)}
            title={tr(returnCopy.title, lang)}
            lead={tr(returnCopy.lead, lang)}
            className={styles.header}
          />
          <span className={styles.loop} aria-hidden>
            <Repeat size={56} strokeWidth={1.5} />
          </span>
        </div>
        <ul className={styles.grid}>
          {returnCopy.items.map((item, index) => {
            const Icon = icons[index] ?? Sparkles;
            return (
              <li key={item.title.en}>
                <span className={styles.icon} aria-hidden>
                  <Icon size={22} />
                </span>
                <div className={styles.text}>
                  <h3>{tr(item.title, lang)}</h3>
                  <p>{tr(item.text, lang)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
