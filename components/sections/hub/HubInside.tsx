import { tr, type Lang } from '@/content/i18n';
import { visitorsCopy } from '@/content/copy/visitors';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import { Picture } from '@/components/primitives/Picture';
import styles from './hub.module.css';

const copy = visitorsCopy.hub;

export function HubInside({ lang }: { lang: Lang }) {
  return (
    <section id="hub" className={`container ${styles.section}`} aria-labelledby="hub-title">
      <SectionHeader
        id="hub-title"
        eyebrow={tr(copy.eyebrow, lang)}
        title={tr(copy.title, lang)}
        lead={tr(copy.lead, lang)}
      />
      <ul className={styles.offers}>
        {copy.offers.map((offer) => (
          <li key={offer.title.en}>
            <h3>{tr(offer.title, lang)}</h3>
            <p>{tr(offer.text, lang)}</p>
          </li>
        ))}
      </ul>

      <div className={styles.split}>
        <div>
          <h3 className={styles.subTitle}>{tr(copy.workshops.title, lang)}</h3>
          <p className={styles.subLead}>{tr(copy.workshops.lead, lang)}</p>
          <ul className={styles.list}>
            {copy.workshops.items.map((item) => (
              <li key={item.title.en}>
                <strong>{tr(item.title, lang)}</strong>
                <span>{tr(item.text, lang)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className={styles.subTitle}>{tr(copy.marketWall.title, lang)}</h3>
          <p className={styles.subLead}>{tr(copy.marketWall.lead, lang)}</p>
          <ol className={styles.steps}>
            {copy.marketWall.steps.map((step, index) => (
              <li key={step.title.en}>
                <span className="latin" aria-hidden>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <strong>{tr(step.title, lang)}</strong>
                <span>{tr(step.text, lang)}</span>
              </li>
            ))}
          </ol>
          <Picture
            id="fast-pop-wall"
            alt={tr(copy.marketWall.imageAlt, lang)}
            sizes="(max-width: 900px) 100vw, 600px"
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}
