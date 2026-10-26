'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { dir, tr, type Lang } from '@/content/i18n';
import { common } from '@/content/site';
import { zoneById } from '@/content/zones';
import { visitorsCopy } from '@/content/copy/visitors';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import { Picture } from '@/components/primitives/Picture';
import { Modal } from '@/components/primitives/Modal';
import styles from './gallery.module.css';

const copy = visitorsCopy.gallery;
const items = copy.items;

/** Concept gallery: cropped V06 renders and film stills, with an optional lightbox. */
export function Gallery({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState<number | null>(null);
  const rtl = lang === 'ar';
  const PrevIcon = rtl ? ChevronRight : ChevronLeft;
  const NextIcon = rtl ? ChevronLeft : ChevronRight;
  const item = open === null ? undefined : items[open];

  const step = (delta: number) =>
    setOpen((index) => (index === null ? index : (index + delta + items.length) % items.length));

  // Arrow keys move through the lightbox, following the reading direction.
  const isOpen = open !== null;
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      const forward = event.key === (rtl ? 'ArrowLeft' : 'ArrowRight');
      setOpen((index) =>
        index === null ? index : (index + (forward ? 1 : -1) + items.length) % items.length,
      );
      event.preventDefault();
    };
    // Capture phase: the dialog stops arrow-key events from bubbling past its popup.
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [isOpen, rtl]);

  return (
    <section id="gallery" className={`container ${styles.section}`} aria-labelledby="gallery-title">
      <SectionHeader
        id="gallery-title"
        eyebrow={tr(copy.eyebrow, lang)}
        title={tr(copy.title, lang)}
        lead={tr(copy.lead, lang)}
      />
      <ul className={styles.grid}>
        {items.map((entry, index) => {
          const zone = entry.zone ? zoneById(entry.zone) : null;
          return (
            <li key={entry.image} className={styles.item}>
              <button
                type="button"
                className={styles.tile}
                onClick={() => setOpen(index)}
                aria-haspopup="dialog"
                style={zone ? ({ '--zone': zone.color } as React.CSSProperties) : undefined}
              >
                <Picture
                  id={entry.image}
                  alt={tr(entry.alt, lang)}
                  sizes={
                    index === 0
                      ? '(max-width: 560px) 100vw, (max-width: 1000px) 100vw, 800px'
                      : '(max-width: 560px) 50vw, (max-width: 1000px) 50vw, 600px'
                  }
                  className={styles.image}
                />
                <span className={styles.caption}>
                  {zone && <span className={`latin ${styles.zone}`}>{zone.name}</span>}
                  <span className={styles.captionText}>{tr(entry.caption, lang)}</span>
                </span>
                <span className={styles.expand} aria-hidden>
                  <Expand size={16} />
                </span>
                <span className="visually-hidden">{tr(copy.open, lang)}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className={styles.note}>{tr(common.conceptLabel, lang)}</p>

      <Modal
        open={item !== undefined}
        onOpenChange={(next) => {
          if (!next) setOpen(null);
        }}
        title={item ? tr(item.caption, lang) : ''}
        closeLabel={tr(common.close, lang)}
        size="full"
        dir={dir(lang)}
      >
        {item && open !== null && (
          <div className={styles.lightbox}>
            <Picture
              key={item.image}
              id={item.image}
              alt={tr(item.alt, lang)}
              sizes="(max-width: 1600px) 100vw, 1600px"
              className={styles.lightboxImage}
            />
            <div className={styles.lightboxBar}>
              <button
                type="button"
                className={styles.navButton}
                onClick={() => step(-1)}
                aria-label={tr(copy.previous, lang)}
              >
                <PrevIcon size={20} aria-hidden />
              </button>
              <p className={styles.lightboxMeta}>
                <span>
                  <span className="latin">{open + 1}</span> {tr(copy.of, lang)}{' '}
                  <span className="latin">{items.length}</span>
                </span>
                <span>{tr(common.conceptLabel, lang)}</span>
              </p>
              <button
                type="button"
                className={styles.navButton}
                onClick={() => step(1)}
                aria-label={tr(copy.next, lang)}
              >
                <NextIcon size={20} aria-hidden />
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
