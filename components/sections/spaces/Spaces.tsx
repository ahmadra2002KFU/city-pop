'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { formatNumber, formatSar, tr, type Lang } from '@/content/i18n';
import {
  leaseTermDays,
  unitArea,
  unitTypes,
  type UnitType,
} from '@/content/units';
import { zoneById, type ZoneId } from '@/content/zones';
import { partnersCopy } from '@/content/copy/partners';
import { enquiryHref } from '@/lib/enquiry-link';
import { showUnitTypeOnMap } from '@/lib/plan-selection';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import styles from './spaces.module.css';

const copy = partnersCopy.spaces;
const zoneOrder: ZoneId[] = ['hub', 'social', 'fnb'];
type Filter = ZoneId | 'all';

/** Largest unit (the 30 m lounge) sets the scale of every footprint drawing. */
const footprintBox = { w: 32, h: 22 };

/** "01–24" for a run of consecutive numbers, otherwise "01 · 05 · 06 …". */
function unitNumbers(units: readonly string[]): string {
  const numbers = units.map(Number);
  const consecutive = numbers.every(
    (n, i) => i === 0 || n === numbers[i - 1] + 1,
  );
  if (consecutive && units.length > 2)
    return `${units[0]}–${units[units.length - 1]}`;
  return units.join(' · ');
}

function Footprint({ type, color }: { type: UnitType; color: string }) {
  const x = (footprintBox.w - type.width) / 2;
  const y = (footprintBox.h - type.depth) / 2;
  return (
    <svg
      className={styles.footprint}
      viewBox={`0 0 ${footprintBox.w} ${footprintBox.h}`}
      aria-hidden="true"
      style={{ '--zone': color } as React.CSSProperties}
    >
      <rect
        className={styles.footprintFrame}
        x={0.5}
        y={0.5}
        width={footprintBox.w - 1}
        height={footprintBox.h - 1}
      />
      <rect
        className={styles.footprintUnit}
        x={x}
        y={y}
        width={type.width}
        height={type.depth}
      />
    </svg>
  );
}

function showOnMap(type: UnitType) {
  showUnitTypeOnMap(type.id);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const plan =
    document.querySelector('#masterplan [data-plan-stage]') ??
    document.getElementById('masterplan');
  plan?.scrollIntoView({
    behavior: reduce ? 'auto' : 'smooth',
    block: 'center',
  });
}

export function Spaces({ lang }: { lang: Lang }) {
  const [filter, setFilter] = useState<Filter>('all');
  const filters: { id: Filter; label: string; color?: string }[] = [
    { id: 'all', label: tr(copy.allZones, lang) },
    ...zoneOrder.map((id) => ({
      id,
      label: zoneById(id).name,
      color: zoneById(id).color,
    })),
  ];
  return (
    <section
      id="spaces"
      className={`container ${styles.section}`}
      aria-labelledby="spaces-title"
    >
      <SectionHeader
        id="spaces-title"
        eyebrow={tr(copy.eyebrow, lang)}
        title={tr(copy.title, lang)}
        lead={tr(copy.lead, lang)}
      />
      <fieldset className={styles.filters}>
        <legend className="visually-hidden">
          {tr(copy.filterLabel, lang)}
        </legend>
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            className={styles.chip}
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
            style={
              item.color
                ? ({ '--zone': item.color } as React.CSSProperties)
                : undefined
            }
          >
            {item.color && (
              <span className={styles.chipDot} aria-hidden="true" />
            )}
            <span className={item.id === 'all' ? undefined : 'latin'}>
              {item.label}
            </span>
          </button>
        ))}
      </fieldset>
      {zoneOrder.map((zoneId) => {
        const zone = zoneById(zoneId);
        const types = unitTypes.filter((type) => type.zone === zoneId);
        const count = types.reduce((sum, type) => sum + type.units.length, 0);
        return (
          <div
            key={zoneId}
            className={styles.zone}
            hidden={filter !== 'all' && filter !== zoneId}
            style={{ '--zone': zone.color } as React.CSSProperties}
          >
            <div className={styles.zoneHead}>
              <h3 className={styles.zoneName}>
                <span className="latin">{zone.name}</span>
                <span className={styles.zoneSubtitle}>
                  {tr(zone.subtitle, lang)}
                </span>
              </h3>
              <p className={styles.zoneCount}>
                <strong className="latin">{count}</strong>{' '}
                {tr(copy.count, lang)}
              </p>
            </div>
            <ul className={styles.cards}>
              {types.map((type) => (
                <li key={type.id} className={styles.card}>
                  <div className={styles.cardBody}>
                    <div className={styles.cardTop}>
                      <Footprint type={type} color={zone.color} />
                      <p className={styles.multiplier}>
                        <span className="latin" dir="ltr">
                          ×{type.units.length}
                        </span>
                      </p>
                    </div>
                    <div className={styles.cardHead}>
                      <h4>{tr(type.name, lang)}</h4>
                      <p className={styles.ideal}>
                        {tr(copy.idealFor, lang)} {tr(type.idealFor, lang)}
                      </p>
                    </div>
                    <dl className={styles.specs}>
                      <div>
                        <dt>{tr(copy.size, lang)}</dt>
                        <dd className="latin">
                          <bdi dir="ltr">
                            {type.width} × {type.depth} m
                          </bdi>
                          <small>
                            <bdi dir="ltr">
                              {formatNumber(unitArea(type))} m²
                            </bdi>
                          </small>
                        </dd>
                      </div>
                      <div>
                        <dt>{tr(copy.height, lang)}</dt>
                        <dd className="latin">
                          <bdi dir="ltr">{type.height} m</bdi>
                        </dd>
                      </div>
                      <div>
                        <dt>{tr(copy.term, lang)}</dt>
                        <dd>
                          <span className="latin">{leaseTermDays}</span>{' '}
                          {tr(copy.days, lang)}
                        </dd>
                      </div>
                      <div>
                        <dt>{tr(copy.count, lang)}</dt>
                        <dd className="latin">{type.units.length}</dd>
                      </div>
                    </dl>
                    <p className={styles.numbers}>
                      <span>{tr(copy.unitNumbers, lang)}</span>
                      <span className="latin">
                        <bdi dir="ltr">{unitNumbers(type.units)}</bdi>
                      </span>
                    </p>
                    <p className={styles.price}>
                      <span>{tr(copy.price, lang)}</span>
                      <strong>{formatSar(type.price, lang)}</strong>
                    </p>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.mapButton}
                        onClick={() => showOnMap(type)}
                      >
                        <MapPin size={17} aria-hidden />
                        {tr(copy.showOnMap, lang)}
                      </button>
                      <a
                        className={styles.enquire}
                        href={enquiryHref({
                          interest: 'unit',
                          unitType: type.id,
                        })}
                      >
                        {tr(partnersCopy.masterplan.enquireType, lang)}
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      <div className={styles.notes}>
        <p>{tr(copy.note, lang)}</p>
        <p>{tr(partnersCopy.masterplan.allocation, lang)}</p>
      </div>
    </section>
  );
}
