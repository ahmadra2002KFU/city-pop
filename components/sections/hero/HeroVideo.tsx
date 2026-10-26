'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Pause, Play } from 'lucide-react';
import styles from './hero.module.css';

type HeroVideoProps = {
  src: string;
  /** "Concept visual" tag, always shown in the media corner. */
  tag: string;
  poster: string;
  pauseLabel: string;
  playLabel: string;
};

type NetworkInformation = { saveData?: boolean };

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

// Motion is allowed only when the visitor has not asked for reduced motion or reduced data.
function subscribe(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}
function motionAllowed(): boolean {
  if (window.matchMedia(reducedMotionQuery).matches) return false;
  const connection = (
    navigator as Navigator & { connection?: NetworkInformation }
  ).connection;
  return connection?.saveData !== true;
}
const serverMotionAllowed = () => false;

/**
 * Muted background loop layered over the static hero image. It is never rendered in the
 * static HTML, so the image stays the LCP element and the fallback for reduced motion,
 * Save-Data and no-JS visitors.
 */
export function HeroVideo({
  src,
  tag,
  poster,
  pauseLabel,
  playLabel,
}: HeroVideoProps) {
  const allowed = useSyncExternalStore(
    subscribe,
    motionAllowed,
    serverMotionAllowed,
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);

  // Play only while the hero is on screen and the visitor has not paused it.
  useEffect(() => {
    const video = videoRef.current;
    if (!allowed || !video) return;
    video.muted = true;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !paused) video.play().catch(() => undefined);
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [allowed, paused]);

  return (
    <>
      {allowed && (
        <video
          ref={videoRef}
          className={styles.video}
          data-ready={ready}
          poster={poster}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          tabIndex={-1}
          onPlaying={() => setReady(true)}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
      <div className={styles.mediaBar}>
        <p className={styles.conceptTag}>{tag}</p>
        {allowed && (
          <button
            type="button"
            className={styles.videoToggle}
            aria-label={paused ? playLabel : pauseLabel}
            onClick={() => setPaused(!paused)}
          >
            {paused ? (
              <Play aria-hidden size={16} />
            ) : (
              <Pause aria-hidden size={16} />
            )}
          </button>
        )}
      </div>
    </>
  );
}
