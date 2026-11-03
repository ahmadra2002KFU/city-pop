import { CalendarDays, MapPin } from 'lucide-react';
import { formatDate, tr, type Lang } from '@/content/i18n';
import { facts, placeName } from '@/content/facts';
import { zones } from '@/content/zones';
import { common } from '@/content/site';
import { partnersCopy } from '@/content/copy/partners';
import { visitorsCopy } from '@/content/copy/visitors';
import { Picture } from '@/components/primitives/Picture';
import { ButtonLink } from '@/components/primitives/ButtonLink';
import { FilmButton } from '@/components/sections/hero/FilmButton';
import styles from './partners-hero.module.css';

const copy = partnersCopy.hero;

/** Partners page opener: a split layout so it reads as a sales page, not a second visitor hero. */
export function PartnersHero({ lang }: { lang: Lang }) {
  return (
    <section className={styles.hero} aria-labelledby="partners-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>{tr(copy.eyebrow, lang)}</p>
          <h1 id="partners-title" className={styles.title}>
            {tr(copy.title, lang)}
          </h1>
          <p className={styles.lead}>{tr(copy.lead, lang)}</p>
          <ul className={styles.facts}>
            <li>
              <CalendarDays aria-hidden size={18} />
              {formatDate(facts.dates.start, lang)} – {formatDate(facts.dates.end, lang)}
            </li>
            <li>
              <MapPin aria-hidden size={18} />
              {placeName(lang)}
            </li>
          </ul>
          <div className={styles.actions}>
            <ButtonLink href="#spaces" arrow>
              {tr(copy.spacesCta, lang)}
            </ButtonLink>
            <ButtonLink href="#sponsorship" variant="ghost">
              {tr(copy.sponsorCta, lang)}
            </ButtonLink>
            <FilmButton lang={lang} />
          </div>
        </div>
        <figure className={styles.visual}>
          <Picture
            id="gate"
            alt={tr(visitorsCopy.hero.imageAlt, lang)}
            sizes="(max-width: 860px) 100vw, 45vw"
            priority
            className={styles.image}
          />
          <figcaption className={styles.tag}>{tr(common.conceptLabel, lang)}</figcaption>
          <span className={styles.spectrum} aria-hidden>
            {zones.map((zone) => (
              <span key={zone.id} style={{ background: zone.color }} />
            ))}
          </span>
        </figure>
      </div>
    </section>
  );
}
