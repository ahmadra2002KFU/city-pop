import { ArrowUpRight, Check, Crown, Gem, Medal, type LucideIcon } from 'lucide-react';
import { formatNumber, tr, type Lang } from '@/content/i18n';
import { benefitRows, includedCount, tiers, type TierId } from '@/content/sponsorship';
import { partnersCopy } from '@/content/copy/partners';
import { enquiryHref } from '@/lib/enquiry-link';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import { CellValue } from './CellValue';
import { Comparison } from './Comparison';
import { fill, plural } from './format';
import { tierHighlights } from './highlights';
import styles from './sponsorship.module.css';

const copy = partnersCopy.sponsorship;

/** Tier icons follow the tier cards on Spons p8: diamond, crown, medal. */
const tierIcons: Record<TierId, LucideIcon> = {
  platinum: Gem,
  gold: Crown,
  silver: Medal,
};

/** Rows where every tier gets a plain ✓ (no differing share or quantity). */
const everyTier = benefitRows.filter((row) => row.values.every((cell) => cell === true));
const totalSlots = tiers.reduce((sum, tier) => sum + tier.slots, 0);

export function Sponsorship({ lang }: { lang: Lang }) {
  return (
    <section id="sponsorship" className={`container ${styles.section}`} aria-labelledby="sponsorship-title">
      <SectionHeader
        id="sponsorship-title"
        eyebrow={tr(copy.eyebrow, lang)}
        title={fill(tr(copy.title, lang), { slots: plural(copy.slotsOnly, totalSlots, lang) })}
        lead={tr(copy.lead, lang)}
      />

      <ul className={styles.tiers}>
        {tiers.map((tier, index) => {
          const Icon = tierIcons[tier.id];
          const count = includedCount(index as 0 | 1 | 2);
          const nameId = `tier-${tier.id}-name`;
          return (
            <li
              key={tier.id}
              className={styles.tier}
              data-tier={tier.id}
              style={{ '--tier': tier.color } as React.CSSProperties}
            >
              <article className={styles.pass} aria-labelledby={nameId}>
                <div className={styles.passTop}>
                  <span className={styles.icon} aria-hidden>
                    <Icon size={20} strokeWidth={1.8} />
                  </span>
                  <p className={styles.badge}>{tr(tier.badge, lang)}</p>
                </div>
                <h3 id={nameId} className={styles.name}>
                  {tr(tier.name, lang)}
                </h3>
                <p className={styles.pitch}>{tr(tier.pitch, lang)}</p>

                <p className={styles.price}>
                  <strong className="latin">{formatNumber(tier.price)}</strong>
                  <span className={styles.currency}>{tr(copy.price, lang)}</span>
                  <span className={styles.vat}>{tr(copy.vat, lang)}</span>
                </p>

                <div className={styles.slots}>
                  <span className={styles.pips} aria-hidden>
                    {Array.from({ length: tier.slots }, (_, slot) => (
                      <span key={slot} />
                    ))}
                  </span>
                  <span>{plural(copy.slotsOnly, tier.slots, lang)}</span>
                </div>

                <div className={styles.perforation} aria-hidden />

                <div className={styles.meter}>
                  <p className={styles.meterLabel}>
                    {fill(tr(copy.benefitsOf, lang), { n: count, total: benefitRows.length })}
                  </p>
                  <span className={styles.meterBar} aria-hidden>
                    {benefitRows.map((row) => (
                      <span key={row.label.en} data-on={row.values[index] !== false} />
                    ))}
                  </span>
                </div>

                <div className={styles.highlights}>
                  <p className={styles.highlightsTitle}>{tr(copy.highlights, lang)}</p>
                  <ul>
                    {tierHighlights(tier.id).map(({ row, cell }) => (
                      <li key={row.label.en}>
                        <Check aria-hidden size={16} strokeWidth={2.6} className={styles.tick} />
                        <span className={styles.highlightLabel}>{tr(row.label, lang)}</span>
                        {cell !== true && (
                          <span className={styles.highlightValue}>
                            <CellValue cell={cell} lang={lang} />
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  className={styles.cta}
                  href={enquiryHref({ interest: 'sponsor', tier: tier.id })}
                  aria-describedby={nameId}
                >
                  {tr(copy.choose, lang)}
                  <ArrowUpRight aria-hidden size={18} className={styles.flip} />
                </a>
              </article>
            </li>
          );
        })}
      </ul>

      <div className={styles.shared}>
        <h3 className={styles.sharedTitle}>{tr(copy.sharedTitle, lang)}</h3>
        <ul className={styles.sharedList}>
          {everyTier.map((row) => (
            <li key={row.label.en}>
              <Check aria-hidden size={15} strokeWidth={2.6} />
              {tr(row.label, lang)}
            </li>
          ))}
        </ul>
      </div>

      <Comparison lang={lang} />
    </section>
  );
}
