import { formatNumber, formatSar, tr, type Lang } from '@/content/i18n';
import { leaseTermDays, unitArea, unitTypes } from '@/content/units';
import { zoneById, type ZoneId } from '@/content/zones';
import { partnersCopy } from '@/content/copy/partners';
import { enquiryHref } from '@/lib/enquiry-link';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import styles from './spaces.module.css';

const copy = partnersCopy.spaces;
const zoneOrder: ZoneId[] = ['hub', 'social', 'fnb'];

export function Spaces({ lang }: { lang: Lang }) {
  return (
    <section id="spaces" className={`container ${styles.section}`} aria-labelledby="spaces-title">
      <SectionHeader
        id="spaces-title"
        eyebrow={tr(copy.eyebrow, lang)}
        title={tr(copy.title, lang)}
        lead={tr(copy.lead, lang)}
      />
      {zoneOrder.map((zoneId) => {
        const zone = zoneById(zoneId);
        return (
          <div
            key={zoneId}
            className={styles.zone}
            style={{ '--zone': zone.color } as React.CSSProperties}
          >
            <h3 className={styles.zoneName}>
              {zone.name}
              <span>{tr(zone.subtitle, lang)}</span>
            </h3>
            <ul className={styles.cards}>
              {unitTypes
                .filter((type) => type.zone === zoneId)
                .map((type) => (
                  <li key={type.id} className={styles.card}>
                    <h4>{tr(type.name, lang)}</h4>
                    <p className={styles.ideal}>
                      {tr(copy.idealFor, lang)} {tr(type.idealFor, lang)}
                    </p>
                    <dl className={styles.specs}>
                      <div>
                        <dt>{tr(copy.size, lang)}</dt>
                        <dd className="latin" dir="ltr">
                          {type.width} × {type.depth} m · {formatNumber(unitArea(type))} m²
                        </dd>
                      </div>
                      <div>
                        <dt>{tr(copy.height, lang)}</dt>
                        <dd className="latin" dir="ltr">
                          {type.height} m
                        </dd>
                      </div>
                      <div>
                        <dt>{tr(copy.term, lang)}</dt>
                        <dd>
                          {leaseTermDays} {tr(copy.days, lang)}
                        </dd>
                      </div>
                      <div>
                        <dt>{tr(copy.count, lang)}</dt>
                        <dd>{type.units.length}</dd>
                      </div>
                    </dl>
                    <p className={styles.price}>
                      <span>{tr(copy.price, lang)}</span>
                      <strong>{formatSar(type.price, lang)}</strong>
                    </p>
                    <a className={styles.enquire} href={enquiryHref({ interest: 'unit', unitType: type.id })}>
                      {tr(copy.enquire, lang)}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        );
      })}
      <p className={styles.note}>{tr(copy.note, lang)}</p>
    </section>
  );
}
