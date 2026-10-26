'use client';

import { useSyncExternalStore } from 'react';
import { tr, type Lang } from '@/content/i18n';
import { eventPhase, eventWindow } from '@/content/facts';
import { visitorsCopy } from '@/content/copy/visitors';
import styles from './hero.module.css';

const copy = visitorsCopy.countdown;
const tick = 30_000;

// A shared clock that ticks every 30 s; snapshots are rounded so they stay stable between ticks.
function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, tick);
  return () => window.clearInterval(timer);
}
const clientNow = () => Math.floor(Date.now() / tick) * tick;
const serverNow = () => null;

function remaining(now: number) {
  const total = Math.max(0, eventWindow.opensAt.getTime() - now);
  const minutes = Math.floor(total / 60_000);
  return {
    days: Math.floor(minutes / 1440),
    hours: Math.floor((minutes % 1440) / 60),
    minutes: minutes % 60,
  };
}

/** Time until opening, computed from content/facts.ts. Empty in the static HTML. */
export function Countdown({ lang }: { lang: Lang }) {
  const now = useSyncExternalStore(subscribe, clientNow, serverNow);

  if (now === null) return <div className={styles.countdown} aria-hidden />;
  const phase = eventPhase(new Date(now));
  if (phase !== 'upcoming') {
    return (
      <p className={styles.countdown} data-phase={phase}>
        {tr(phase === 'live' ? copy.live : copy.ended, lang)}
      </p>
    );
  }
  const left = remaining(now);
  const units = [
    [left.days, copy.days],
    [left.hours, copy.hours],
    [left.minutes, copy.minutes],
  ] as const;
  return (
    <p className={styles.countdown} data-phase={phase}>
      {units.map(([value, label]) => (
        <span key={label.en} className={styles.countdownUnit}>
          <strong className="latin">{String(value).padStart(2, '0')}</strong>
          <span>{tr(label, lang)}</span>
        </span>
      ))}
      <span className={styles.countdownLabel}>{tr(copy.until, lang)}</span>
    </p>
  );
}
