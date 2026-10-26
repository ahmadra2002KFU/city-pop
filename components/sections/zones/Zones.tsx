'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { dir, tr, type Lang } from '@/content/i18n';
import { zones, type ZoneId } from '@/content/zones';
import { common } from '@/content/site';
import { visitorsCopy } from '@/content/copy/visitors';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import { Picture } from '@/components/primitives/Picture';
import { Modal } from '@/components/primitives/Modal';
import styles from './zones.module.css';

const copy = visitorsCopy.zones;
const pad = (n: number) => String(n).padStart(2, '0');

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

export function Zones({ lang }: { lang: Lang }) {
  const [active, setActive] = useState<ZoneId | null>(null);
  const [current, setCurrent] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const activeIndex = zones.findIndex((item) => item.id === active);
  const zone = activeIndex >= 0 ? zones[activeIndex] : undefined;
  const rtl = lang === 'ar';
  // Chevrons point along the reading direction.
  const PrevIcon = rtl ? ChevronRight : ChevronLeft;
  const NextIcon = rtl ? ChevronLeft : ChevronRight;

  // On the mobile carousel, track which card is most in view for the counter and buttons.
  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof IntersectionObserver === 'undefined') return;
    const ratios = new Map<Element, number>();
    const items = [...list.children];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target, entry.intersectionRatio);
        let best = 0;
        let bestRatio = -1;
        items.forEach((item, index) => {
          const ratio = ratios.get(item) ?? 0;
          if (ratio > bestRatio + 0.01) {
            best = index;
            bestRatio = ratio;
          }
        });
        setCurrent(best);
      },
      { root: list, threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  function goTo(index: number) {
    const list = listRef.current;
    const target = list?.children[index] as HTMLElement | undefined;
    if (!list || !target) return;
    // Scroll only the list horizontally so the page does not jump.
    const listBox = list.getBoundingClientRect();
    const box = target.getBoundingClientRect();
    const offset = box.left + box.width / 2 - (listBox.left + listBox.width / 2);
    list.scrollBy({ left: offset, behavior: scrollBehavior() });
  }

  return (
    <section id="zones" className={styles.section} aria-labelledby="zones-title">
      <div className="container">
        <SectionHeader
          id="zones-title"
          eyebrow={tr(copy.eyebrow, lang)}
          title={tr(copy.title, lang)}
          lead={tr(copy.lead, lang)}
        />
      </div>
      <div className={styles.rail}>
        <ul ref={listRef} className={styles.grid} aria-label={tr(copy.listLabel, lang)}>
          {zones.map((item, index) => (
            <li key={item.id} className={styles.item}>
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
                  sizes="(max-width: 760px) 84vw, (max-width: 1100px) 50vw, 400px"
                  className={styles.image}
                />
                <span className={styles.number}>
                  <span className="visually-hidden">{tr(copy.zoneLabel, lang)} </span>
                  <span className="latin">{pad(index + 1)}</span>
                </span>
                <span className={styles.body}>
                  <span className={styles.subtitle}>{tr(item.subtitle, lang)}</span>
                  <span className={`latin ${styles.name}`}>{item.name}</span>
                  <span className={styles.summary}>{tr(item.summary, lang)}</span>
                  <span className={styles.open}>
                    {tr(copy.open, lang)}
                    <ArrowUpRight aria-hidden size={16} className={styles.flip} />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className={`container ${styles.controls}`}>
        <p className={styles.hint}>
          {tr(copy.swipeHint, lang)}
          <span className={`latin ${styles.counter}`} dir="ltr" aria-hidden>
            {pad(current + 1)} / {pad(zones.length)}
          </span>
        </p>
        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => goTo(Math.max(0, current - 1))}
            disabled={current === 0}
            aria-label={tr(copy.previous, lang)}
          >
            <PrevIcon size={20} aria-hidden />
          </button>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => goTo(Math.min(zones.length - 1, current + 1))}
            disabled={current === zones.length - 1}
            aria-label={tr(copy.next, lang)}
          >
            <NextIcon size={20} aria-hidden />
          </button>
        </div>
      </div>

      <Modal
        open={Boolean(zone)}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
        title={zone ? `${zone.name} · ${tr(zone.subtitle, lang)}` : ''}
        closeLabel={tr(common.close, lang)}
        size="wide"
        dir={dir(lang)}
      >
        {zone && (
          <div className={styles.dialog} style={{ '--zone': zone.color } as React.CSSProperties}>
            <div className={styles.dialogMedia}>
              <figure className={styles.dialogFigure}>
                <Picture
                  id={zone.image}
                  alt={tr(zone.imageAlt, lang)}
                  sizes="(max-width: 860px) 100vw, 480px"
                  className={styles.dialogImage}
                />
              </figure>
              {zone.extraImage && (
                <figure className={styles.dialogFigure}>
                  <Picture
                    id={zone.extraImage.id}
                    alt={tr(zone.extraImage.alt, lang)}
                    sizes="(max-width: 860px) 100vw, 480px"
                    className={styles.dialogImage}
                  />
                </figure>
              )}
              <p className={styles.concept}>{tr(common.conceptLabel, lang)}</p>
            </div>
            <div className={styles.dialogText}>
              <p className={styles.kicker}>
                {tr(copy.zoneLabel, lang)} <span className="latin">{pad(activeIndex + 1)}</span>
              </p>
              <p className={styles.intro}>{tr(zone.intro, lang)}</p>
              <h3 className={styles.featuresTitle}>{tr(copy.featuresLabel, lang)}</h3>
              <ul className={styles.features}>
                {zone.features.map((feature) => (
                  <li key={feature.en}>{tr(feature, lang)}</li>
                ))}
              </ul>
              <div className={styles.dialogNav}>
                <button
                  type="button"
                  className={styles.dialogNavButton}
                  onClick={() => setActive(zones[(activeIndex - 1 + zones.length) % zones.length].id)}
                >
                  <PrevIcon size={18} aria-hidden />
                  <span>
                    <span className="visually-hidden">{tr(copy.previous, lang)}: </span>
                    <span className="latin">{zones[(activeIndex - 1 + zones.length) % zones.length].name}</span>
                  </span>
                </button>
                <button
                  type="button"
                  className={styles.dialogNavButton}
                  onClick={() => setActive(zones[(activeIndex + 1) % zones.length].id)}
                >
                  <span>
                    <span className="visually-hidden">{tr(copy.next, lang)}: </span>
                    <span className="latin">{zones[(activeIndex + 1) % zones.length].name}</span>
                  </span>
                  <NextIcon size={18} aria-hidden />
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
