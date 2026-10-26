import { CalendarDays, MapPin } from 'lucide-react';
import { formatDate, tr, type Lang } from '@/content/i18n';
import { facts } from '@/content/facts';
import { partnersCopy } from '@/content/copy/partners';
import { visitorsCopy } from '@/content/copy/visitors';
import { Picture } from '@/components/primitives/Picture';
import { ButtonLink } from '@/components/primitives/ButtonLink';
import styles from './partners-hero.module.css';

const copy = partnersCopy.hero;

export function PartnersHero({ lang }: { lang: Lang }) {
  return (
    <section className={styles.hero} aria-labelledby="partners-title">
      <Picture
        id="gate"
        alt={tr(visitorsCopy.hero.imageAlt, lang)}
        sizes="100vw"
        priority
        className={styles.image}
      />
      <div className={styles.shade} aria-hidden />
      <div className={`container ${styles.content}`}>
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
            {tr(facts.location.city, lang)}
            {lang === 'ar' ? '، ' : ', '}
            {tr(facts.location.region, lang)}
          </li>
        </ul>
        <div className={styles.actions}>
          <ButtonLink href="#spaces" arrow>
            {tr(copy.spacesCta, lang)}
          </ButtonLink>
          <ButtonLink href="#sponsorship" variant="ghost">
            {tr(copy.sponsorCta, lang)}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
