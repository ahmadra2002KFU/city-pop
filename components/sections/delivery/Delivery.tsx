import {
  Clapperboard,
  FileCheck2,
  Megaphone,
  PencilRuler,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { tr, type Lang } from '@/content/i18n';
import { partnersCopy } from '@/content/copy/partners';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import styles from './delivery.module.css';

const copy = partnersCopy.delivery;
type GroupId = (typeof copy.groups)[number]['id'];

/** Icon and accent per responsibility group; accents walk the brand gradient. */
const look: Record<GroupId, { icon: LucideIcon; accent: string }> = {
  build: { icon: PencilRuler, accent: 'var(--blue-bright)' },
  operations: { icon: ShieldCheck, accent: 'color-mix(in srgb, var(--blue-bright), var(--violet))' },
  marketing: { icon: Megaphone, accent: 'var(--violet)' },
  content: { icon: Clapperboard, accent: 'var(--rose)' },
  permits: { icon: FileCheck2, accent: 'var(--pink)' },
};

/** What Mufeed delivers (V06 p44–48), laid out as a ledger: one row per area of responsibility. */
export function Delivery({ lang }: { lang: Lang }) {
  return (
    <section id="delivery" className={`container ${styles.section}`} aria-labelledby="delivery-title">
      <SectionHeader id="delivery-title" eyebrow={tr(copy.eyebrow, lang)} title={tr(copy.title, lang)} />

      <ul className={styles.ledger}>
        {copy.groups.map((group) => {
          const { icon: Icon, accent } = look[group.id];
          return (
            <li
              key={group.id}
              className={styles.group}
              style={{ '--accent': accent } as React.CSSProperties}
            >
              <div className={styles.groupHead}>
                <span className={styles.icon} aria-hidden>
                  <Icon size={22} strokeWidth={1.8} />
                </span>
                <h3>{tr(group.title, lang)}</h3>
              </div>
              <ul className={styles.items}>
                {group.items.map((item) => (
                  <li key={item.title.en}>
                    <h4>{tr(item.title, lang)}</h4>
                    <p>{tr(item.text, lang)}</p>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
