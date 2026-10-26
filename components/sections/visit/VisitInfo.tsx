import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { formatDate, tr, type Lang } from '@/content/i18n';
import { facts } from '@/content/facts';
import { visitorsCopy } from '@/content/copy/visitors';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import styles from './visit.module.css';

const copy = visitorsCopy.visit;

export function VisitInfo({ lang }: { lang: Lang }) {
  const separator = lang === 'ar' ? '، ' : ', ';
  return (
    <section id="visit" className={`container ${styles.section}`} aria-labelledby="visit-title">
      <SectionHeader id="visit-title" eyebrow={tr(copy.eyebrow, lang)} title={tr(copy.title, lang)} />
      <dl className={styles.facts}>
        <div>
          <dt>
            <CalendarDays aria-hidden size={20} />
            {tr(copy.whenLabel, lang)}
          </dt>
          <dd>
            {formatDate(facts.dates.start, lang)} – {formatDate(facts.dates.end, lang)}
          </dd>
        </div>
        <div>
          <dt>
            <MapPin aria-hidden size={20} />
            {tr(copy.whereLabel, lang)}
          </dt>
          <dd>
            {tr(facts.location.city, lang)}
            {separator}
            {tr(facts.location.region, lang)}
            <span>{tr(copy.venueTba, lang)}</span>
          </dd>
        </div>
        <div>
          <dt>
            <Clock aria-hidden size={20} />
            {tr(copy.hoursLabel, lang)}
          </dt>
          <dd>{tr(copy.hoursTba, lang)}</dd>
        </div>
      </dl>
      <div className={styles.cities}>
        <h3>{tr(copy.nextCitiesTitle, lang)}</h3>
        <p>{tr(copy.nextCitiesLead, lang)}</p>
        <ul>
          {facts.nextCities.map((city) => (
            <li key={city.en}>{tr(city, lang)}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
