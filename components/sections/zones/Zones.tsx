'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { dir, tr, type Lang } from '@/content/i18n';
import { zones, type ZoneId } from '@/content/zones';
import { common } from '@/content/site';
import { visitorsCopy } from '@/content/copy/visitors';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import { Picture } from '@/components/primitives/Picture';
import { Modal } from '@/components/primitives/Modal';
import styles from './zones.module.css';

const copy = visitorsCopy.zones;

export function Zones({ lang }: { lang: Lang }) {
  const [active, setActive] = useState<ZoneId | null>(null);
  const zone = zones.find((item) => item.id === active);
  return (
    <section id="zones" className={`container ${styles.section}`} aria-labelledby="zones-title">
      <SectionHeader
        id="zones-title"
        eyebrow={tr(copy.eyebrow, lang)}
        title={tr(copy.title, lang)}
        lead={tr(copy.lead, lang)}
      />
      <ul className={styles.grid}>
        {zones.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              className={styles.card}
              style={{ '--zone': item.color } as React.CSSProperties}
              onClick={() => setActive(item.id)}
              aria-haspopup="dialog"
            >
              <Picture
                id={item.image}
                alt=""
                sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 400px"
                className={styles.image}
              />
              <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
              <span className={styles.body}>
                <span className={styles.subtitle}>{tr(item.subtitle, lang)}</span>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.summary}>{tr(item.summary, lang)}</span>
              </span>
              <span className={styles.open}>
                {tr(copy.open, lang)}
                <ArrowUpRight aria-hidden size={16} className={styles.flip} />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Modal
        open={Boolean(zone)}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
        title={zone ? `${zone.name}: ${tr(zone.subtitle, lang)}` : ''}
        closeLabel={tr(common.close, lang)}
        dir={dir(lang)}
      >
        {zone && (
          <div className={styles.dialog} style={{ '--zone': zone.color } as React.CSSProperties}>
            <Picture
              id={zone.image}
              alt={tr(zone.imageAlt, lang)}
              sizes="(max-width: 700px) 100vw, 640px"
              className={styles.dialogImage}
            />
            <p>{tr(zone.intro, lang)}</p>
            <h3>{tr(copy.featuresLabel, lang)}</h3>
            <ul className={styles.features}>
              {zone.features.map((feature) => (
                <li key={feature.en}>{tr(feature, lang)}</li>
              ))}
            </ul>
            <p className={styles.concept}>{tr(common.conceptLabel, lang)}</p>
          </div>
        )}
      </Modal>
    </section>
  );
}
