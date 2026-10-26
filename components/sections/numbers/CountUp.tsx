'use client';

import { useEffect, useRef, useState } from 'react';
import { formatNumber } from '@/content/i18n';

type CountUpProps = {
  value: number;
  /** Zero-pad to this many digits instead of using thousands separators. */
  pad?: number;
};

const duration = 1400;

function format(value: number, pad?: number) {
  return pad ? String(value).padStart(pad, '0') : formatNumber(value);
}

/**
 * Counts up to `value` the first time it scrolls into view. The static HTML, screen
 * readers, reduced-motion visitors and anything already on screen get the final value.
 */
export function CountUp({ value, pad }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    let first = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const initial = first;
        first = false;
        if (!entry.isIntersecting) {
          // Off screen when the page loaded: park at zero until it is seen.
          if (initial) setShown(0);
          return;
        }
        observer.disconnect();
        if (initial) return;
        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - progress) ** 3;
          setShown(Math.round(value * eased));
          if (progress < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.35 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <>
      <span ref={ref} aria-hidden>
        {format(shown, pad)}
      </span>
      <span className="visually-hidden">{format(value, pad)}</span>
    </>
  );
}
