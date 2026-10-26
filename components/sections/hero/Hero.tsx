import { formatDate, tr, type Lang } from '@/content/i18n';
import { facts } from '@/content/facts';
import { zones } from '@/content/zones';
import { common } from '@/content/site';
import { visitorsCopy } from '@/content/copy/visitors';
import { assetPath } from '@/lib/asset-path';
import { Picture, mediaUrl } from '@/components/primitives/Picture';
import { ButtonLink } from '@/components/primitives/ButtonLink';
import { Countdown } from './Countdown';
import { HeroVideo } from './HeroVideo';
import { FilmButton } from './FilmButton';
import styles from './hero.module.css';

const copy = visitorsCopy.hero;

/** Cut from the concept film without any city name or AI-garbled signage (see Claude Docs). */
const heroLoop = '/media/video/hero-loop-1280.mp4';

export function Hero({ lang }: { lang: Lang }) {
  const separator = lang === 'ar' ? '، ' : ', ';
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media}>
        <Picture id="gate" alt={tr(copy.imageAlt, lang)} sizes="100vw" priority className={styles.image} />
        <HeroVideo
          src={assetPath(heroLoop)}
          tag={tr(common.conceptLabel, lang)}
          poster={mediaUrl('gate', 1280)}
          pauseLabel={tr(copy.videoPause, lang)}
          playLabel={tr(copy.videoPlay, lang)}
        />
      </div>
      <div className={styles.shade} aria-hidden />

      <div className={`container ${styles.content}`}>
        <p className={styles.eyebrow}>{tr(copy.eyebrow, lang)}</p>
        <h1 id="hero-title" className={styles.title}>
          {copy.titleLines.map((line, index) => (
            <span key={line.en} className={index === 1 ? styles.titleGlow : undefined}>
              {tr(line, lang)}
            </span>
          ))}
        </h1>
        <p className={styles.tagline}>{tr(copy.tagline, lang)}</p>
        <p className={styles.lead}>{tr(copy.lead, lang)}</p>
        <div className={styles.actions}>
          <ButtonLink href="#zones" arrow>
            {tr(copy.primaryCta, lang)}
          </ButtonLink>
          <FilmButton lang={lang} />
        </div>
      </div>

      <div className={`container ${styles.ticketWrap}`}>
        <div className={styles.ticket}>
          <span className={styles.spectrum} aria-hidden>
            {zones.map((zone) => (
              <span key={zone.id} style={{ background: zone.color }} />
            ))}
          </span>
          <dl className={styles.ticketFacts}>
            <div>
              <dt>{tr(copy.whenLabel, lang)}</dt>
              <dd>
                <span>{formatDate(facts.dates.start, lang)}</span>
                <span aria-hidden className={styles.arrow}>
                  →
                </span>
                <span className="visually-hidden"> – </span>
                <span>{formatDate(facts.dates.end, lang)}</span>
              </dd>
            </div>
            <div>
              <dt>{tr(copy.whereLabel, lang)}</dt>
              <dd>
                {tr(facts.location.city, lang)}
                {separator}
                {tr(facts.location.region, lang)}
              </dd>
            </div>
          </dl>
          <div className={styles.ticketCountdown}>
            <Countdown lang={lang} />
          </div>
        </div>
      </div>
    </section>
  );
}
