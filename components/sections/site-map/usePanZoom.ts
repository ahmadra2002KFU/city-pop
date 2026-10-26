'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Rect } from '@/content/plan-geometry';

/** The visible window onto the content, in content units. */
export type View = Rect;
export type FrameSize = { width: number; height: number };

type Options = {
  /** Everything that can be shown, in content units. */
  content: Rect;
  /** Narrowest view (strongest zoom), in content units. */
  minWidth: number;
  /** Initial and reset view for a given frame size. Defaults to fitting the content. */
  initialView?: (frame: FrameSize, content: Rect) => View;
};

const dragThreshold = 6;

/** Runs `onFrame(eased progress)` for `duration` ms; returns a cancel function. */
function tween(
  duration: number,
  onFrame: (progress: number) => void,
): () => void {
  let handle = 0;
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    onFrame(1 - Math.pow(1 - t, 3));
    if (t < 1) handle = requestAnimationFrame(step);
  };
  handle = requestAnimationFrame(step);
  return () => cancelAnimationFrame(handle);
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Scale that fits the whole content inside the frame. */
function containScale(frame: FrameSize, content: Rect): number {
  return Math.min(frame.width / content.w, frame.height / content.h);
}

export function fitView(
  frame: FrameSize,
  content: Rect,
  target: Rect = content,
  padding = 0,
): View {
  const scale = Math.min(
    frame.width / (target.w + padding * 2),
    frame.height / (target.h + padding * 2),
  );
  const w = frame.width / scale;
  const h = frame.height / scale;
  return {
    x: target.x + target.w / 2 - w / 2,
    y: target.y + target.h / 2 - h / 2,
    w,
    h,
  };
}

/**
 * Narrow frames start zoomed to the content's full height (from its start edge),
 * so a long drawing stays legible; wide frames show everything.
 */
export function fitHeightOnNarrow(frame: FrameSize, bounds: Rect): View {
  const frameAspect = frame.width / frame.height;
  if (frameAspect >= (bounds.w / bounds.h) * 0.85)
    return fitView(frame, bounds);
  const scale = frame.height / bounds.h;
  return { x: bounds.x, y: bounds.y, w: frame.width / scale, h: bounds.h };
}

function clampView(
  view: View,
  frame: FrameSize,
  content: Rect,
  minWidth: number,
): View {
  const maxWidth = frame.width / containScale(frame, content);
  const w = Math.min(Math.max(view.w, minWidth), maxWidth);
  const h = (w * frame.height) / frame.width;
  const clampAxis = (
    start: number,
    size: number,
    from: number,
    length: number,
  ) =>
    size >= length
      ? from + (length - size) / 2
      : Math.min(Math.max(start, from), from + length - size);
  return {
    x: clampAxis(view.x, w, content.x, content.w),
    y: clampAxis(view.y, h, content.y, content.h),
    w,
    h,
  };
}

/**
 * Pan and zoom for a fixed-size frame: drag with one pointer, pinch with two,
 * ctrl/⌘ + wheel (and trackpad pinch) to zoom, and programmatic zoom/fit.
 * The caller renders `view` (an SVG viewBox, or a CSS transform).
 */
export function usePanZoom<T extends HTMLElement>({
  content,
  minWidth,
  initialView,
}: Options) {
  const [element, setElement] = useState<T | null>(null);
  const [frame, setFrame] = useState<FrameSize | null>(null);
  const [view, setView] = useState<View | null>(null);
  const viewRef = useRef<View | null>(null);
  const frameSizeRef = useRef<FrameSize | null>(null);
  const touchedRef = useRef(false);
  const cancelAnimation = useRef<() => void>(() => {});
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{
    startView: View;
    startX: number;
    startY: number;
    startDistance: number;
    moved: boolean;
  } | null>(null);
  const draggedRef = useRef(false);
  const [dragging, setDragging] = useState(false);

  const initial = useCallback(
    (size: FrameSize) =>
      clampView(
        initialView ? initialView(size, content) : fitView(size, content),
        size,
        content,
        minWidth,
      ),
    [content, initialView, minWidth],
  );

  const commit = useCallback(
    (next: View) => {
      const size = frameSizeRef.current;
      if (!size) return;
      const clamped = clampView(next, size, content, minWidth);
      viewRef.current = clamped;
      setView(clamped);
    },
    [content, minWidth],
  );

  const animateTo = useCallback(
    (target: View) => {
      const size = frameSizeRef.current;
      const from = viewRef.current;
      if (!size || !from) return;
      const to = clampView(target, size, content, minWidth);
      cancelAnimation.current();
      if (prefersReducedMotion()) {
        commit(to);
        return;
      }
      cancelAnimation.current = tween(320, (e) =>
        commit({
          x: from.x + (to.x - from.x) * e,
          y: from.y + (to.y - from.y) * e,
          w: from.w + (to.w - from.w) * e,
          h: from.h + (to.h - from.h) * e,
        }),
      );
    },
    [commit, content, minWidth],
  );

  // Track the frame size; keep the user's view on resize, or re-fit if untouched.
  useEffect(() => {
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const size = {
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      };
      if (size.width < 1 || size.height < 1) return;
      frameSizeRef.current = size;
      setFrame(size);
      const current = viewRef.current;
      if (!current || !touchedRef.current) {
        const next = initial(size);
        viewRef.current = next;
        setView(next);
      } else {
        const scale = frameSizeRef.current.width / current.w;
        commit({ ...current, w: size.width / scale, h: size.height / scale });
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [commit, element, initial]);

  const zoomAt = useCallback(
    (factor: number, px?: number, py?: number, animate = false) => {
      const size = frameSizeRef.current;
      const current = viewRef.current;
      if (!size || !current) return;
      touchedRef.current = true;
      const ax = px ?? size.width / 2;
      const ay = py ?? size.height / 2;
      const scale = size.width / current.w;
      const ux = current.x + ax / scale;
      const uy = current.y + ay / scale;
      const w = current.w / factor;
      const nextScale = size.width / w;
      const target = {
        x: ux - ax / nextScale,
        y: uy - ay / nextScale,
        w,
        h: size.height / nextScale,
      };
      if (animate) animateTo(target);
      else commit(target);
    },
    [animateTo, commit],
  );

  /** Show `target` (content units) with optional padding; never zooms past `maxScale` px per unit. */
  const focusOn = useCallback(
    (target: Rect, padding = 0, maxScale = Infinity) => {
      const size = frameSizeRef.current;
      if (!size) return;
      touchedRef.current = true;
      let next = fitView(size, content, target, padding);
      const scale = size.width / next.w;
      if (scale > maxScale) {
        const w = size.width / maxScale;
        const h = size.height / maxScale;
        next = {
          x: target.x + target.w / 2 - w / 2,
          y: target.y + target.h / 2 - h / 2,
          w,
          h,
        };
      }
      animateTo(next);
    },
    [animateTo, content],
  );

  /** Pan (without zooming) just enough to bring `target` into view. */
  const ensureVisible = useCallback(
    (target: Rect, margin = 0) => {
      const current = viewRef.current;
      if (!current) return;
      let { x, y } = current;
      if (target.x - margin < x) x = target.x - margin;
      else if (target.x + target.w + margin > x + current.w)
        x = target.x + target.w + margin - current.w;
      if (target.y - margin < y) y = target.y - margin;
      else if (target.y + target.h + margin > y + current.h)
        y = target.y + target.h + margin - current.h;
      if (x !== current.x || y !== current.y) {
        touchedRef.current = true;
        animateTo({ ...current, x, y });
      }
    },
    [animateTo],
  );

  const centerOn = useCallback(
    (cx: number, cy: number) => {
      const current = viewRef.current;
      if (!current) return;
      touchedRef.current = true;
      commit({ ...current, x: cx - current.w / 2, y: cy - current.h / 2 });
    },
    [commit],
  );

  const reset = useCallback(() => {
    const size = frameSizeRef.current;
    if (!size) return;
    touchedRef.current = false;
    animateTo(initial(size));
  }, [animateTo, initial]);

  // ctrl/⌘ + wheel (and trackpad pinch, which reports ctrlKey) zooms; plain wheel scrolls the page.
  useEffect(() => {
    if (!element) return;
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const box = element.getBoundingClientRect();
      zoomAt(
        Math.exp(-event.deltaY * 0.01),
        event.clientX - box.left,
        event.clientY - box.top,
      );
    };
    element.addEventListener('wheel', onWheel, { passive: false });
    return () => element.removeEventListener('wheel', onWheel);
  }, [element, zoomAt]);

  useEffect(() => () => cancelAnimation.current(), []);

  const startGesture = () => {
    const current = viewRef.current;
    const points = [...pointers.current.values()];
    if (!current || points.length === 0) return;
    const midX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const midY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    const distance =
      points.length > 1
        ? Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)
        : 0;
    gesture.current = {
      startView: current,
      startX: midX,
      startY: midY,
      startDistance: distance,
      moved: gesture.current?.moved ?? false,
    };
  };

  const onPointerDown = (event: React.PointerEvent<T>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    cancelAnimation.current();
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    if (pointers.current.size === 1) {
      draggedRef.current = false;
      gesture.current = null;
    }
    startGesture();
  };

  const onPointerMove = (event: React.PointerEvent<T>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    const g = gesture.current;
    const size = frameSizeRef.current;
    if (!g || !size || !element) return;
    const points = [...pointers.current.values()];
    const midX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const midY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    if (!g.moved) {
      if (
        Math.hypot(midX - g.startX, midY - g.startY) < dragThreshold &&
        points.length < 2
      )
        return;
      g.moved = true;
      draggedRef.current = true;
      touchedRef.current = true;
      setDragging(true);
      for (const id of pointers.current.keys()) {
        if (!element.hasPointerCapture(id)) {
          try {
            element.setPointerCapture(id);
          } catch {
            // The pointer may already be gone; nothing to capture.
          }
        }
      }
    }
    const scale = size.width / g.startView.w;
    let next: View = {
      ...g.startView,
      x: g.startView.x - (midX - g.startX) / scale,
      y: g.startView.y - (midY - g.startY) / scale,
    };
    if (points.length > 1 && g.startDistance > 0) {
      const distance = Math.hypot(
        points[0].x - points[1].x,
        points[0].y - points[1].y,
      );
      const factor = distance / g.startDistance;
      const box = element.getBoundingClientRect();
      const ax = midX - box.left;
      const ay = midY - box.top;
      const ux = next.x + ax / scale;
      const uy = next.y + ay / scale;
      const w = g.startView.w / factor;
      const nextScale = size.width / w;
      next = {
        x: ux - ax / nextScale,
        y: uy - ay / nextScale,
        w,
        h: size.height / nextScale,
      };
    }
    commit(next);
  };

  const onPointerEnd = (event: React.PointerEvent<T>) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size === 0) {
      gesture.current = null;
      setDragging(false);
    } else {
      startGesture();
    }
  };

  /** True once if the last pointer interaction was a drag; use to ignore the trailing click. */
  const consumeDrag = useCallback(() => {
    const dragged = draggedRef.current;
    draggedRef.current = false;
    return dragged;
  }, []);

  const scale = frame && view ? frame.width / view.w : 0;
  const zoomed =
    frame && view
      ? view.w < content.w - 0.5 || view.h < content.h - 0.5
      : false;
  const atMaxZoom = view ? view.w <= minWidth + 0.01 : false;
  const atMinZoom =
    frame && view
      ? view.w >= frame.width / containScale(frame, content) - 0.01
      : true;

  return {
    /** Callback ref for the frame element. */
    attachFrame: setElement,
    frame,
    view,
    scale,
    zoomed,
    atMaxZoom,
    atMinZoom,
    dragging,
    zoomAt,
    focusOn,
    ensureVisible,
    centerOn,
    reset,
    consumeDrag,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
    },
  };
}
