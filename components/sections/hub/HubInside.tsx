import { BadgePercent, Hand, ScanQrCode, ShoppingBag } from 'lucide-react';
import { tr, type Lang } from '@/content/i18n';
import { common } from '@/content/site';
import { zoneById } from '@/content/zones';
import { visitorsCopy } from '@/content/copy/visitors';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import { Picture } from '@/components/primitives/Picture';
import styles from './hub.module.css';

const copy = visitorsCopy.hub;
/** Try, scan, buy, save (V06 p27), in order. */
const stepIcons = [Hand, ScanQrCode, ShoppingBag, BadgePercent];

/** Workshop length on a 60-minute dial: solid to 20 minutes, lighter to 30 (V06 p25). */
function SessionDial() {
  const r = 50;
  const c = 2 * Math.PI * r;
  const twenty = c / 3;
  const ten = c / 6;
  return (
    <svg viewBox="0 0 120 120" className={styles.dialSvg} aria-hidden focusable="false">
      <defs>
        <linearGradient id="hub-dial-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2e97e4" />
          <stop offset="50%" stopColor="#987ad4" />
          <stop offset="100%" stopColor="#ffb6c3" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r={r} className={styles.dialTrack} />
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={i}
          x1="60"
          y1="4"
          x2="60"
          y2={i % 3 === 0 ? 12 : 9}
          className={styles.dialTick}
          transform={`rotate(${i * 30} 60 60)`}
        />
      ))}
      <g transform="rotate(-90 60 60)">
        <circle
          cx="60"
          cy="60"
          r={r}
          className={styles.dialRange}
          strokeDasharray={`0 ${twenty} ${ten} ${c}`}
        />
        <circle cx="60" cy="60" r={r} className={styles.dialCore} strokeDasharray={`${twenty} ${c}`} />
      </g>
    </svg>
  );
}

export function HubInside({ lang }: { lang: Lang }) {
  const hub = zoneById('hub');
  return (
    <section
      id="hub"
      className={styles.section}
      aria-labelledby="hub-title"
      style={{ '--zone': hub.color } as React.CSSProperties}
    >
      <div className="container">
        <SectionHeader
          id="hub-title"
          eyebrow={tr(copy.eyebrow, lang)}
          title={tr(copy.title, lang)}
          lead={tr(copy.lead, lang)}
        />

        <div className={styles.block}>
          <h3 className={styles.blockTitle}>{tr(copy.offersTitle, lang)}</h3>
          <ul className={styles.offers}>
            {copy.offers.map((offer) => (
              <li key={offer.title.en}>
                <strong>{tr(offer.title, lang)}</strong>
                <p>{tr(offer.text, lang)}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${styles.block} ${styles.workshop}`}>
          <div className={styles.dial}>
            <SessionDial />
            <p className={styles.duration}>
              <span className={`latin ${styles.durationFigure}`} dir="ltr">{tr(copy.duration.figure, lang)}</span>
              <span className={styles.durationUnit}>{tr(copy.duration.unit, lang)}</span>
              <span className={styles.durationLabel}>{tr(copy.duration.label, lang)}</span>
            </p>
          </div>
          <div>
            <h3 className={styles.blockTitle}>{tr(copy.workshops.title, lang)}</h3>
            <p className={styles.blockLead}>{tr(copy.workshops.lead, lang)}</p>
            <ul className={styles.workshops}>
              {copy.workshops.items.map((item) => (
                <li key={item.title.en}>
                  <strong>{tr(item.title, lang)}</strong>
                  <span>{tr(item.text, lang)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`${styles.block} ${styles.wall}`}>
          <figure className={styles.wallMedia}>
            <Picture
              id="fast-pop-wall"
              alt={tr(copy.marketWall.imageAlt, lang)}
              sizes="(max-width: 900px) 100vw, 640px"
              className={styles.wallImage}
            />
            <figcaption>{tr(common.conceptLabel, lang)}</figcaption>
          </figure>
          <div className={styles.wallText}>
            <h3 className={styles.blockTitle}>{tr(copy.marketWall.title, lang)}</h3>
            <p className={styles.blockLead}>{tr(copy.marketWall.lead, lang)}</p>
            <ol className={styles.flow} aria-label={tr(copy.marketWall.flowLabel, lang)}>
              {copy.marketWall.steps.map((step, index) => {
                const Icon = stepIcons[index];
                return (
                  <li key={step.title.en}>
                    <span className={styles.stepIcon} aria-hidden>
                      <Icon size={22} />
                    </span>
                    <span className={styles.stepBody}>
                      <span className={`latin ${styles.stepNumber}`} aria-hidden>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <strong>{tr(step.title, lang)}</strong>
                      <span>{tr(step.text, lang)}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
