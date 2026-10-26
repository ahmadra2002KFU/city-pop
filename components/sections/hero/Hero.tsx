import { CalendarDays, MapPin } from 'lucide-react';
import { formatDate, tr, type Lang } from '@/content/i18n';
import { facts } from '@/content/facts';
import { visitorsCopy } from '@/content/copy/visitors';
import { Picture } from '@/components/primitives/Picture';
import { ButtonLink } from '@/components/primitives/ButtonLink';
import { Countdown } from './Countdown';
import styles from './hero.module.css';

const copy = visitorsCopy.hero;

export function Hero({ lang }: { lang: Lang }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <Picture
        id="gate"
        alt={tr(copy.imageAlt, lang)}
        sizes="100vw"
        priority
        className={styles.image}
      />
      <div className={styles.shade} aria-hidden />
      <div className={`container ${styles.content}`}>
        <p className={styles.eyebrow}>{tr(copy.eyebrow, lang)}</p>
        <h1 id="hero-title" className={styles.title}>
          {copy.titleLines.map((line, index) => (
            <span key={line.en} className={index === 1 ? 'gradient-text' : undefined}>
              {tr(line, lang)}
            </span>
          ))}
        </h1>
        <p className={styles.tagline}>{tr(copy.tagline, lang)}</p>
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
          <ButtonLink href="#zones" arrow>
            {tr(copy.primaryCta, lang)}
          </ButtonLink>
        </div>
        <Countdown lang={lang} />
      </div>
    </section>
  );
}
