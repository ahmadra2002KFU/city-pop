import styles from './primitives.module.css';

type SectionHeaderProps = {
  id?: string;
  eyebrow?: string;
  title: React.ReactNode;
  lead?: string;
  className?: string;
};

/** Eyebrow, h2 and lead for a page section. Pass `id` to label the section. */
export function SectionHeader({ id, eyebrow, title, lead, className }: SectionHeaderProps) {
  return (
    <div className={[styles.header, className].filter(Boolean).join(' ')}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      {lead && <p className={styles.lead}>{lead}</p>}
    </div>
  );
}
