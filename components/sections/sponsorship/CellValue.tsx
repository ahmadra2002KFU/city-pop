import { Check, Minus } from 'lucide-react';
import { formatNumber, tr, type Lang } from '@/content/i18n';
import type { Cell } from '@/content/sponsorship';
import { partnersCopy } from '@/content/copy/partners';
import styles from './comparison.module.css';

const copy = partnersCopy.sponsorship;

/** One matrix cell exactly as the deck prints it: ✓, —, a percentage or a quantity. */
export function CellValue({ cell, lang }: { cell: Cell; lang: Lang }) {
  if (cell === true) {
    return (
      <>
        <Check aria-hidden size={18} strokeWidth={2.6} className={styles.yes} />
        <span className="visually-hidden">{tr(copy.included, lang)}</span>
      </>
    );
  }
  if (cell === false) {
    return (
      <>
        <Minus aria-hidden size={18} className={styles.no} />
        <span className="visually-hidden">{tr(copy.notIncluded, lang)}</span>
      </>
    );
  }
  if ('share' in cell) {
    return (
      <span className={`latin ${styles.value}`} dir="ltr">
        {cell.share}%
      </span>
    );
  }
  return (
    <span className={styles.value}>
      <span className="latin">{formatNumber(cell.count)}</span>
      {cell.unit ? ` ${tr(cell.unit, lang)}` : null}
    </span>
  );
}
