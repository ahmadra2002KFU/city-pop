import { Check, Minus } from 'lucide-react';
import { formatNumber, tr, type Lang } from '@/content/i18n';
import {
  benefitGroups,
  includedCount,
  shareNote,
  sharedBenefits,
  tiers,
  type Cell,
} from '@/content/sponsorship';
import { partnersCopy } from '@/content/copy/partners';
import { enquiryHref } from '@/lib/enquiry-link';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import styles from './sponsorship.module.css';

const copy = partnersCopy.sponsorship;

function CellValue({ cell, lang }: { cell: Cell; lang: Lang }) {
  if (cell === true) {
    return (
      <>
        <Check aria-hidden size={18} className={styles.yes} />
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
  if ('share' in cell) return <span className="latin">{cell.share}%</span>;
  return (
    <span>
      <span className="latin">{cell.count}</span> {cell.unit ? tr(cell.unit, lang) : ''}
    </span>
  );
}

export function Sponsorship({ lang }: { lang: Lang }) {
  return (
    <section id="sponsorship" className={`container ${styles.section}`} aria-labelledby="sponsorship-title">
      <SectionHeader
        id="sponsorship-title"
        eyebrow={tr(copy.eyebrow, lang)}
        title={tr(copy.title, lang)}
        lead={tr(copy.lead, lang)}
      />
      <ul className={styles.tiers}>
        {tiers.map((tier, index) => (
          <li
            key={tier.id}
            className={styles.tier}
            style={{ '--tier': tier.color } as React.CSSProperties}
          >
            <p className={styles.badge}>{tr(tier.badge, lang)}</p>
            <h3>{tr(tier.name, lang)}</h3>
            <p className={styles.pitch}>{tr(tier.pitch, lang)}</p>
            <p className={styles.price}>
              <strong className="latin">{formatNumber(tier.price)}</strong>
              <span>
                {tr(copy.price, lang)} · {tr(copy.vat, lang)}
              </span>
            </p>
            <dl className={styles.meta}>
              <div>
                <dt>{tr(copy.slots, lang)}</dt>
                <dd>{tier.slots}</dd>
              </div>
              <div>
                <dt>{tr(copy.benefits, lang)}</dt>
                <dd>{includedCount(index as 0 | 1 | 2)}</dd>
              </div>
            </dl>
            <a className={styles.choose} href={enquiryHref({ interest: 'sponsor', tier: tier.id })}>
              {tr(copy.choose, lang)}
            </a>
          </li>
        ))}
      </ul>

      <h3 className={styles.subTitle}>{tr(copy.sharedTitle, lang)}</h3>
      <ul className={styles.shared}>
        {sharedBenefits.map((row) => (
          <li key={row.label.en}>
            <Check aria-hidden size={16} className={styles.yes} />
            {tr(row.label, lang)}
          </li>
        ))}
      </ul>

      <h3 className={styles.subTitle}>{tr(copy.compareTitle, lang)}</h3>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption className="visually-hidden">{tr(copy.compareTitle, lang)}</caption>
          <thead>
            <tr>
              <th scope="col">{tr(copy.benefitColumn, lang)}</th>
              {tiers.map((tier) => (
                <th scope="col" key={tier.id}>
                  {tr(tier.name, lang)}
                </th>
              ))}
            </tr>
          </thead>
          {benefitGroups.map((group) => (
            <tbody key={group.id}>
              <tr className={styles.groupRow}>
                <th scope="colgroup" colSpan={4}>
                  {tr(group.title, lang)}
                </th>
              </tr>
              {group.rows.map((row) => (
                <tr key={row.label.en}>
                  <th scope="row">{tr(row.label, lang)}</th>
                  {row.values.map((cell, i) => (
                    <td key={tiers[i].id}>
                      <CellValue cell={cell} lang={lang} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
      <p className={styles.note}>{tr(shareNote, lang)}</p>
    </section>
  );
}
