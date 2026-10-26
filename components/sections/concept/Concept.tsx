import { MonitorSmartphone, MoveRight } from 'lucide-react';
import { tr, type Lang } from '@/content/i18n';
import { common } from '@/content/site';
import { visitorsCopy } from '@/content/copy/visitors';
import { Picture } from '@/components/primitives/Picture';
import styles from './concept.module.css';

const copy = visitorsCopy.concept;

/** "So what if?" (V06 p2), screen to reality (V06 p4) and the three motivations (V06 p6). */
export function Concept({ lang }: { lang: Lang }) {
  return (
    <section id="concept" className={styles.section} aria-labelledby="concept-title">
      <div className={`container ${styles.opening}`}>
        <div className={styles.question}>
          <p className={styles.eyebrow}>{tr(copy.eyebrow, lang)}</p>
          <h2 id="concept-title" className={styles.title}>
            {tr(copy.title, lang)}
          </h2>
        </div>
        <p className={styles.stat}>
          <span className={styles.figure}>
            <span className={`latin ${styles.number}`}>{tr(copy.statFigure, lang)}</span>
            <span className={styles.unit}>{tr(copy.statUnit, lang)}</span>
          </span>
          <span className={styles.statLabel}>{tr(copy.statLabel, lang)}</span>
        </p>
      </div>

      <div className="container">
        <h3 className={styles.compareTitle}>{tr(copy.compareTitle, lang)}</h3>
        <div className={styles.compare}>
          <article className={styles.screen}>
            <div className={styles.device} aria-hidden>
              <Picture id="concept-arrival" alt="" sizes="(max-width: 760px) 60vw, 260px" className={styles.deviceImage} />
              <span className={styles.deviceGlass} />
              <MonitorSmartphone size={20} className={styles.deviceIcon} />
            </div>
            <div className={styles.points}>
              <h4>{tr(copy.today.label, lang)}</h4>
              <ol>
                {copy.today.points.map((point) => (
                  <li key={point.en}>{tr(point, lang)}</li>
                ))}
              </ol>
            </div>
          </article>

          <span className={styles.bridge} aria-hidden>
            <MoveRight size={28} />
          </span>

          <article className={styles.reality}>
            <figure className={styles.realityMedia}>
              <Picture
                id="concept-arrival"
                alt={tr(copy.realityImageAlt, lang)}
                sizes="(max-width: 760px) 100vw, (max-width: 1100px) 55vw, 640px"
                className={styles.realityImage}
              />
              <figcaption>{tr(common.conceptLabel, lang)}</figcaption>
            </figure>
            <div className={styles.points}>
              <h4>{tr(copy.cityPop.label, lang)}</h4>
              <ol>
                {copy.cityPop.points.map((point) => (
                  <li key={point.en}>{tr(point, lang)}</li>
                ))}
              </ol>
            </div>
          </article>
        </div>
      </div>

      <div className={`container ${styles.motivationsWrap}`}>
        <h3 className={styles.motivationsTitle}>{tr(copy.motivationsTitle, lang)}</h3>
        <ul className={styles.motivations}>
          {copy.motivations.map((item) => (
            <li key={item.title.en}>
              <strong>{tr(item.title, lang)}</strong>
              <p>{tr(item.text, lang)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
