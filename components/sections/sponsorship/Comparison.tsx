'use client';

import { useState } from 'react';
import { Check, ChevronDown, Minus } from 'lucide-react';
import { formatNumber, tr, type Lang } from '@/content/i18n';
import {
  benefitGroups,
  benefitRows,
  includedCount,
  isIncluded,
  shareNote,
  tiers,
  type TierId,
} from '@/content/sponsorship';
import { partnersCopy } from '@/content/copy/partners';
import { CellValue } from './CellValue';
import { fill } from './format';
import styles from './comparison.module.css';

const copy = partnersCopy.sponsorship;
const tierIndex = (index: number) => index as 0 | 1 | 2;
const rowId = (groupId: string, index: number) => `benefit-${groupId}-${index + 1}`;

/**
 * The full 39-row matrix as one accessible table.
 * Wide screens show all three tiers with a sticky header and collapsible groups.
 * At 760px and below a tier switcher (native radios) picks which tier column is
 * shown, so every row stays visible for whichever tier is selected.
 */
export function Comparison({ lang }: { lang: Lang }) {
  const [activeTier, setActiveTier] = useState<TierId>(tiers[0].id);
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(() => new Set());
  const allOpen = collapsed.size === 0;
  const active = tiers.find((tier) => tier.id === activeTier) ?? tiers[0];
  const activeIndex = tierIndex(tiers.indexOf(active));

  const toggleGroup = (id: string) =>
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className={styles.compare}>
      <div className={styles.head}>
        <div>
          <h3 id="sponsorship-compare-title" className={styles.title}>
            {tr(copy.compareTitle, lang)}
          </h3>
          <p className={styles.lead}>{tr(copy.compareLead, lang)}</p>
        </div>
        <button
          type="button"
          className={styles.toggleAll}
          onClick={() => setCollapsed(allOpen ? new Set(benefitGroups.map((group) => group.id)) : new Set())}
        >
          <ChevronDown aria-hidden size={16} className={allOpen ? styles.chevronOpen : undefined} />
          {tr(allOpen ? copy.collapseAll : copy.expandAll, lang)}
        </button>
      </div>

      <ul className={styles.legend}>
        <li>
          <Check aria-hidden size={16} strokeWidth={2.6} className={styles.yes} />
          {tr(copy.included, lang)}
        </li>
        <li>
          <Minus aria-hidden size={16} className={styles.no} />
          {tr(copy.notIncluded, lang)}
        </li>
        <li>
          <span className={`latin ${styles.legendMark}`} aria-hidden>
            %
          </span>
          {tr(copy.legendShare, lang)}
        </li>
        <li>
          <span className={`latin ${styles.legendMark}`} aria-hidden>
            #
          </span>
          {tr(copy.legendCount, lang)}
        </li>
      </ul>
      <p className={styles.note} id="sponsorship-share-note">
        <span className="latin" aria-hidden>
          %{' '}
        </span>
        {tr(shareNote, lang)}
      </p>

      <fieldset className={styles.switcher}>
        <legend className={styles.switcherLegend}>{tr(copy.showTier, lang)}</legend>
        <div className={styles.segments}>
          {tiers.map((tier) => (
            <label
              key={tier.id}
              className={styles.segment}
              style={{ '--tier': tier.color } as React.CSSProperties}
            >
              <input
                type="radio"
                name="sponsorship-tier"
                value={tier.id}
                checked={tier.id === activeTier}
                onChange={() => setActiveTier(tier.id)}
              />
              <span>{tr(tier.name, lang)}</span>
            </label>
          ))}
        </div>
        <p className={styles.showing} aria-live="polite">
          {fill(tr(copy.showing, lang), {
            tier: tr(active.name, lang),
            n: includedCount(activeIndex),
            total: benefitRows.length,
          })}
        </p>
      </fieldset>

      <table className={styles.table} aria-labelledby="sponsorship-compare-title" aria-describedby="sponsorship-share-note">
        <thead>
          <tr>
            <th scope="col" className={styles.benefitHead}>
              {tr(copy.benefitColumn, lang)}
            </th>
            {tiers.map((tier) => (
              <th
                scope="col"
                key={tier.id}
                className={styles.tierHead}
                data-off={tier.id !== activeTier}
                style={{ '--tier': tier.color } as React.CSSProperties}
              >
                <span className={styles.tierName}>{tr(tier.name, lang)}</span>
                <span className={styles.tierPrice}>
                  <span className="latin">{formatNumber(tier.price)}</span> {tr(copy.price, lang)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        {benefitGroups.map((group) => {
          const open = !collapsed.has(group.id);
          const ids = group.rows.map((_, index) => rowId(group.id, index));
          return (
            <tbody key={group.id} data-group={group.id}>
              <tr className={styles.groupRow}>
                <th scope="rowgroup" className={styles.groupHead}>
                  <button
                    type="button"
                    className={styles.groupButton}
                    aria-expanded={open}
                    aria-controls={ids.join(' ')}
                    onClick={() => toggleGroup(group.id)}
                  >
                    <ChevronDown aria-hidden size={18} className={open ? styles.chevronOpen : styles.chevron} />
                    <span>{tr(group.title, lang)}</span>
                  </button>
                </th>
                {tiers.map((tier, index) => {
                  const included = group.rows.filter((row) => isIncluded(row.values[tierIndex(index)])).length;
                  const label = fill(tr(copy.groupCount, lang), { n: included, m: group.rows.length });
                  return (
                    <td
                      key={tier.id}
                      className={styles.groupCount}
                      data-off={tier.id !== activeTier}
                      data-full={included === group.rows.length}
                      style={{ '--tier': tier.color } as React.CSSProperties}
                    >
                      <span aria-hidden className="latin">
                        {included}/{group.rows.length}
                      </span>
                      <span className="visually-hidden">{label}</span>
                    </td>
                  );
                })}
              </tr>
              {group.rows.map((row, index) => (
                <tr key={row.label.en} id={ids[index]} hidden={!open} data-benefit-row="">
                  <th scope="row" className={styles.rowHead}>
                    {tr(row.label, lang)}
                  </th>
                  {row.values.map((cell, i) => (
                    <td
                      key={tiers[i].id}
                      data-tier={tiers[i].id}
                      data-included={isIncluded(cell)}
                      data-off={tiers[i].id !== activeTier}
                      style={{ '--tier': tiers[i].color } as React.CSSProperties}
                    >
                      <CellValue cell={cell} lang={lang} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          );
        })}
      </table>
    </div>
  );
}
