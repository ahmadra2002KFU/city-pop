import { Clock, MapPin } from 'lucide-react';
import { formatDate, tr, type Lang } from '@/content/i18n';
import { facts, placeName } from '@/content/facts';
import { visitorsCopy } from '@/content/copy/visitors';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import styles from './visit.module.css';

const copy = visitorsCopy.visit;
const dayMs = 86_400_000;

/** Calendar months covered by the event window, with the number of event dates in each. */
function monthSpans(startIso: string, endIso: string) {
  const end = new Date(`${endIso}T00:00:00Z`);
  const spans: { iso: string; days: number }[] = [];
  let cursor = new Date(`${startIso}T00:00:00Z`);
  while (cursor <= end) {
    const monthEnd = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 0));
    const last = monthEnd < end ? monthEnd : end;
    spans.push({
      iso: cursor.toISOString().slice(0, 10),
      days: Math.round((last.getTime() - cursor.getTime()) / dayMs) + 1,
    });
    cursor = new Date(last.getTime() + dayMs);
  }
  return spans;
}

export function VisitInfo({ lang }: { lang: Lang }) {
  const months = monthSpans(facts.dates.start, facts.dates.end);
  return (
    <section id="visit" className={`container ${styles.section}`} aria-labelledby="visit-title">
      <SectionHeader id="visit-title" eyebrow={tr(copy.eyebrow, lang)} title={tr(copy.title, lang)} />

      <div className={styles.calendar}>
        <dl className={styles.ends}>
          <div>
            <dt>{tr(copy.opensLabel, lang)}</dt>
            <dd>{formatDate(facts.dates.start, lang)}</dd>
          </div>
          <div>
            <dt>{tr(copy.closesLabel, lang)}</dt>
            <dd>{formatDate(facts.dates.end, lang)}</dd>
          </div>
        </dl>
        <div className={styles.track} aria-hidden>
          {months.map((month) => (
            <span key={month.iso} style={{ flexGrow: month.days }}>
              {formatDate(month.iso, lang, { month: 'long' })}
            </span>
          ))}
        </div>
        <p className={styles.days}>
          <strong className="latin">{facts.operatingDays.value}</strong>
          <span>{tr(copy.operatingDays, lang)}</span>
        </p>
      </div>

      <dl className={styles.facts}>
        <div>
          <dt>
            <MapPin aria-hidden size={20} />
            {tr(copy.whereLabel, lang)}
          </dt>
          <dd>
            {placeName(lang)}
            <span>{tr(copy.venueTba, lang)}</span>
          </dd>
        </div>
        <div>
          <dt>
            <Clock aria-hidden size={20} />
            {tr(copy.hoursLabel, lang)}
          </dt>
          <dd>
            <span>{tr(copy.hoursTba, lang)}</span>
          </dd>
        </div>
      </dl>

      <div className={styles.cities}>
        <div>
          <h3>{tr(copy.nextCitiesTitle, lang)}</h3>
          <p>{tr(copy.nextCitiesLead, lang)}</p>
        </div>
        <ul>
          {facts.nextCities.map((city) => (
            <li key={city.en}>{tr(city, lang)}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
