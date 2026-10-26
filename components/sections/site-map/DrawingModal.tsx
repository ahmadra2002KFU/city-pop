'use client';

import { Expand, Minus, Plus } from 'lucide-react';
import { tr, type Lang } from '@/content/i18n';
import { media } from '@/content/media.generated';
import { visitorsCopy } from '@/content/copy/visitors';
import { common } from '@/content/site';
import { Modal } from '@/components/primitives/Modal';
import { Picture } from '@/components/primitives/Picture';
import { fitHeightOnNarrow, usePanZoom } from './usePanZoom';
import styles from './site-map.module.css';

const drawing = media['masterplan-cad'];
const drawingContent = { x: 0, y: 0, w: drawing.width, h: drawing.height };

type DrawingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lang: Lang;
};

/** The original 4096 px CAD drawing, with the same drag / pinch / button zoom as the plan. */
export function DrawingModal({ open, onOpenChange, lang }: DrawingModalProps) {
  const controls = visitorsCopy.map.controls;
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={tr(controls.drawingTitle, lang)}
      closeLabel={tr(common.close, lang)}
      size="full"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {open && <DrawingViewer lang={lang} />}
    </Modal>
  );
}

function DrawingViewer({ lang }: { lang: Lang }) {
  const controls = visitorsCopy.map.controls;
  const {
    atMaxZoom,
    atMinZoom,
    attachFrame,
    dragging,
    handlers,
    reset,
    scale,
    view,
    zoomAt,
    zoomed,
  } = usePanZoom<HTMLDivElement>({
    content: drawingContent,
    minWidth: 360,
    initialView: fitHeightOnNarrow,
  });
  const transform = view
    ? `translate(${-view.x * scale}px, ${-view.y * scale}px) scale(${scale})`
    : undefined;
  return (
    <div className={styles.drawingViewer}>
      <div
        ref={attachFrame}
        className={`${styles.drawingFrame} ${dragging ? styles.grabbing : ''}`}
        style={{ touchAction: zoomed ? 'none' : 'pan-y' }}
        dir="ltr"
        {...handlers}
      >
        <div
          className={styles.drawingCanvas}
          style={{
            width: drawing.width,
            height: drawing.height,
            transform,
            visibility: view ? 'visible' : 'hidden',
          }}
        >
          <Picture
            id="masterplan-cad"
            alt={tr(controls.drawingTitle, lang)}
            sizes={`${drawing.width}px`}
            className={styles.drawingImage}
            priority
          />
        </div>
      </div>
      <div className={styles.toolbar}>
        <p className={styles.hint}>{tr(controls.drawingHint, lang)}</p>
        <div className={styles.zoomButtons}>
          <button
            type="button"
            onClick={() => zoomAt(1 / 1.6, undefined, undefined, true)}
            disabled={atMinZoom}
            aria-label={tr(controls.zoomOut, lang)}
          >
            <Minus size={18} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => zoomAt(1.6, undefined, undefined, true)}
            disabled={atMaxZoom}
            aria-label={tr(controls.zoomIn, lang)}
          >
            <Plus size={18} aria-hidden />
          </button>
          <button
            type="button"
            onClick={reset}
            aria-label={tr(controls.reset, lang)}
          >
            <Expand size={17} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
