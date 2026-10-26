'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { assetPath } from '@/lib/asset-path';
import { dir, tr, type Lang } from '@/content/i18n';
import { common } from '@/content/site';
import { Modal } from '@/components/primitives/Modal';
import { mediaUrl } from '@/components/primitives/Picture';
import styles from './hero.module.css';

const film = common.film;

/**
 * "Watch the concept film" button and modal. Renders nothing while `common.film.enabled`
 * is false. The film loads only when the modal opens and never autoplays with sound.
 */
export function FilmButton({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  if (!film.enabled) return null;
  return (
    <>
      <button type="button" className={styles.filmButton} onClick={() => setOpen(true)}>
        <span className={styles.filmIcon} aria-hidden>
          <Play size={16} />
        </span>
        {tr(film.cta, lang)}
      </button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title={tr(film.title, lang)}
        closeLabel={tr(common.close, lang)}
        size="wide"
        dir={dir(lang)}
      >
        {open && (
          // oxlint-disable-next-line jsx-a11y/media-has-caption -- The film has no speech (music only; Claude Docs/source-review/video.md), so there is nothing to caption.
          <video
            className={styles.film}
            src={assetPath(film.src)}
            poster={mediaUrl('gate', 1280)}
            controls
            playsInline
            preload="metadata"
          />
        )}
        <p className={styles.filmNote}>{tr(film.note, lang)}</p>
      </Modal>
    </>
  );
}
