'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Expand, Map as MapIcon, Minus, Plus, X } from 'lucide-react';
import { formatNumber, formatSar, tr, type Lang } from '@/content/i18n';
import { leaseTermDays, unitArea, type UnitTypeId } from '@/content/units';
import { zoneById, type MapAreaId } from '@/content/zones';
import {
  boundsOf,
  planAreas,
  planTypeAreas,
  planUnits,
  site,
  type Rect,
} from '@/content/plan-geometry';
import { visitorsCopy } from '@/content/copy/visitors';
import { partnersCopy } from '@/content/copy/partners';
import { common } from '@/content/site';
import { enquiryHref } from '@/lib/enquiry-link';
import { clearPlanHighlight, usePlanSelection } from '@/lib/plan-selection';
import { PlanDrawing } from './PlanDrawing';
import { DrawingModal } from './DrawingModal';
import {
  inkOn,
  areaBounds,
  areaInfos,
  unitTypeById,
  unitTypeShapes,
} from './plan-data';
import { fitHeightOnNarrow, usePanZoom, type View } from './usePanZoom';
import styles from './site-map.module.css';

type Variant = 'visitors' | 'partners';

type Selection =
  | { kind: 'zone'; id: MapAreaId; anchor: Rect; at: number }
  | { kind: 'unit'; id: string; anchor: Rect; at: number }
  | { kind: 'type'; id: UnitTypeId; anchor: Rect; at: number };

/** Everything the plan can show: the site plus room for the dimension lines. */
const content: Rect = { x: -6, y: -10, w: 400, h: 137 };
const minViewWidth = 36;
/** Below this frame width the detail card sits under the map instead of floating. */
const floatingCardMinWidth = 640;

/** Narrow frames start at the entrance, zoomed to the site's depth; wide ones show it all. */
const initialView = fitHeightOnNarrow;

function inflate(rect: Rect, minSize: number, cap: number): Rect {
  const dx = Math.min(cap, Math.max(0, (minSize - rect.w) / 2));
  const dy = Math.min(cap, Math.max(0, (minSize - rect.h) / 2));
  return {
    x: rect.x - dx,
    y: rect.y - dy,
    w: rect.w + dx * 2,
    h: rect.h + dy * 2,
  };
}

function sameSelection(a: Selection | null, b: Selection | null) {
  return !!a && !!b && a.kind === b.kind && a.id === b.id;
}

const areaOrder: MapAreaId[] = [
  'popoff',
  'stage',
  'tiny',
  'fnb',
  'social',
  'hub',
  'facilities',
  'entrance',
];

export function PlanMap({ lang, variant }: { lang: Lang; variant: Variant }) {
  const controls = visitorsCopy.map.controls;
  const plan = partnersCopy.masterplan;
  const specs = partnersCopy.spaces;
  const isPartners = variant === 'partners';
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const uid = useId();
  const infos = useMemo(() => areaInfos(lang), [lang]);
  const infoById = useMemo(
    () => new Map(infos.map((info) => [info.id, info])),
    [infos],
  );

  const {
    atMaxZoom,
    atMinZoom,
    attachFrame,
    centerOn,
    consumeDrag,
    dragging,
    ensureVisible,
    focusOn,
    frame,
    handlers,
    reset,
    scale,
    view,
    zoomAt,
    zoomed,
  } = usePanZoom<HTMLDivElement>({
    content,
    minWidth: minViewWidth,
    initialView,
  });

  const highlight = usePlanSelection();
  const [selected, setSelected] = useState<Selection | null>(null);
  const [hovered, setHovered] = useState<Selection | null>(null);
  const [coarse, setCoarse] = useState(false);
  const [drawingOpen, setDrawingOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const hoverTimer = useRef(0);
  const cardRef = useRef<HTMLElement | null>(null);
  const chipRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef(new Map<string, SVGGElement>());
  const suppressFocusSelect = useRef(false);
  const [focusCard, setFocusCard] = useState(0);

  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse)');
    const update = () => setCoarse(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const highlightType = isPartners ? highlight.unitType : null;
  const highlightActive =
    highlightType !== null && highlight.seq > (selected?.at ?? -1);
  const typeSelection: Selection | null = highlightActive
    ? {
        kind: 'type',
        id: highlightType,
        anchor: boundsOf(unitTypeShapes(highlightType)),
        at: highlight.seq,
      }
    : null;
  const active = selected && !highlightActive ? selected : typeSelection;
  const shown = hovered ?? active;

  // "Show on map" from the Spaces cards: frame the highlighted units and announce them.
  useEffect(() => {
    if (!isPartners || highlight.unitType === null || highlight.seq === 0)
      return;
    focusOn(boundsOf(unitTypeShapes(highlight.unitType)), 8);
    chipRef.current?.focus({ preventScroll: true });
  }, [focusOn, highlight.seq, highlight.unitType, isPartners]);

  useEffect(() => {
    if (focusCard) cardRef.current?.focus({ preventScroll: true });
  }, [focusCard]);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  // Escape closes the card from anywhere inside the plan.
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<() => void>(() => {});
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current();
    };
    wrap.addEventListener('keydown', onKey);
    return () => wrap.removeEventListener('keydown', onKey);
  }, []);

  const targetPx = coarse ? 44 : 24;
  const unitsInteractive = (rect: Rect) =>
    Math.min(rect.w, rect.h) * scale >= targetPx;

  const selectionTitle = (sel: Selection): string => {
    if (sel.kind === 'zone') {
      const info = infoById.get(sel.id);
      return info ? `${info.number} ${info.name}` : '';
    }
    if (sel.kind === 'unit') {
      const unit = planUnits.find((item) => item.id === sel.id);
      return unit
        ? `${tr(unitTypeById(unit.type).name, lang)} ${unit.unit}`
        : '';
    }
    return tr(unitTypeById(sel.id).name, lang);
  };

  const itemKey = (sel: Selection) => {
    return `${sel.kind}:${sel.id}`;
  };

  const select = (next: Selection, moveFocus = false) => {
    setSelected({ ...next, at: highlight.seq });
    setHovered(null);
    setAnnouncement(selectionTitle(next));
    if (moveFocus) setFocusCard((n) => n + 1);
  };

  const close = () => {
    const owner = active;
    setSelected(null);
    setHovered(null);
    if (highlightActive) clearPlanHighlight();
    const item = owner ? itemRefs.current.get(itemKey(owner)) : undefined;
    if (item && cardRef.current?.contains(document.activeElement)) {
      suppressFocusSelect.current = true;
      item.focus({ preventScroll: true });
      suppressFocusSelect.current = false;
    }
  };

  useEffect(() => {
    closeRef.current = close;
  });

  const hoverIn = (next: Selection) => {
    if (coarse) return;
    window.clearTimeout(hoverTimer.current);
    setHovered(next);
  };
  const hoverOut = () => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setHovered(null), 220);
  };

  /** Shared props for every focusable item on the plan. */
  const itemProps = (
    sel: Omit<Selection, 'at'>,
    label: string,
    pressed: boolean,
  ) => {
    const full = { ...sel, at: highlight.seq } as Selection;
    return {
      ref: (node: SVGGElement | null) => {
        if (node) itemRefs.current.set(itemKey(full), node);
        else itemRefs.current.delete(itemKey(full));
      },
      role: 'button',
      tabIndex: 0,
      'aria-label': label,
      'aria-pressed': pressed,
      onClick: () => {
        if (consumeDrag()) return;
        select(full);
      },
      onKeyDown: (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          select(full, true);
        }
      },
      onFocus: () => {
        if (suppressFocusSelect.current) return;
        ensureVisible(sel.anchor, 4);
        if (!sameSelection(active, full)) select(full);
      },
    };
  };

  const r = scale > 0 ? Math.min(11 / scale, 4.4) : 4;
  const labelSize = scale > 0 ? Math.min(12 / scale, 4.6) : 4;
  /** Unit numbers: up to 11 px on screen, never wider than the unit; hidden below 8 px. */
  const unitLabelPx = (rect: Rect) =>
    Math.min(11, 0.45 * Math.min(rect.w, rect.h) * scale);
  const cardFloats = (frame?.width ?? 0) >= floatingCardMinWidth;

  const frameStyle = {
    touchAction: view && view.h < content.h - 1 ? 'none' : 'pan-y',
  } as React.CSSProperties;

  const renderCard = (sel: Selection) => {
    if (sel.kind === 'zone') {
      const info = infoById.get(sel.id);
      if (!info) return null;
      const unitsTooSmall =
        isPartners &&
        sel.id === 'hub' &&
        planUnits.some(
          (unit) => unit.type === 'main-store' && !unitsInteractive(unit.rect),
        );
      return (
        <>
          <p className={styles.cardEyebrow}>
            <span
              className={`latin ${styles.cardNumber}`}
              style={
                {
                  '--zone': info.color,
                  '--zone-ink': inkOn(info.color),
                } as React.CSSProperties
              }
            >
              {info.number}
            </span>
            {tr(controls.area, lang)}
          </p>
          <h3 className={styles.cardTitle}>
            <span className="latin">{info.name}</span>
            {info.subtitle && (
              <span className={styles.cardSubtitle}>{info.subtitle}</span>
            )}
          </h3>
          <ul className={styles.cardFeatures}>
            {info.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          {unitsTooSmall && (
            <p className={styles.cardNote}>{tr(plan.zoomToPick, lang)}</p>
          )}
          <button
            type="button"
            className={styles.cardAction}
            onClick={() => focusOn(sel.anchor, 6, 6)}
          >
            {tr(controls.zoomToArea, lang)}
          </button>
        </>
      );
    }
    const typeId =
      sel.kind === 'unit'
        ? planUnits.find((unit) => unit.id === sel.id)?.type
        : sel.id;
    if (!typeId) return null;
    const type = unitTypeById(typeId);
    const zone = zoneById(type.zone);
    const unit =
      sel.kind === 'unit'
        ? planUnits.find((item) => item.id === sel.id)
        : undefined;
    const isArea =
      sel.kind === 'type' && planTypeAreas.some((area) => area.type === typeId);
    return (
      <>
        <p className={styles.cardEyebrow}>
          <span
            className={styles.cardDot}
            style={{ '--zone': zone.color } as React.CSSProperties}
            aria-hidden="true"
          />
          <span className="latin">{zone.name}</span>
        </p>
        <h3 className={styles.cardTitle}>
          <span>
            {tr(type.name, lang)}
            {unit && (
              <>
                {' '}
                <span className="latin">{unit.unit}</span>
              </>
            )}
          </span>
        </h3>
        {!unit && (
          <p className={styles.cardCount}>
            <strong className="latin">{type.units.length}</strong>{' '}
            {isArea ? tr(plan.unitsInArea, lang) : tr(specs.count, lang)}
          </p>
        )}
        <dl className={styles.cardSpecs}>
          <div>
            <dt>{tr(specs.size, lang)}</dt>
            <dd className="latin">
              <bdi dir="ltr">
                {type.width} × {type.depth} m · {formatNumber(unitArea(type))}{' '}
                m²
              </bdi>
            </dd>
          </div>
          <div>
            <dt>{tr(specs.height, lang)}</dt>
            <dd className="latin">
              <bdi dir="ltr">{type.height} m</bdi>
            </dd>
          </div>
          <div>
            <dt>{tr(specs.term, lang)}</dt>
            <dd>
              <span className="latin">{leaseTermDays}</span>{' '}
              {tr(specs.days, lang)}
            </dd>
          </div>
          <div>
            <dt>{tr(specs.price, lang)}</dt>
            <dd className={styles.cardPrice}>{formatSar(type.price, lang)}</dd>
          </div>
        </dl>
        {isArea && (
          <p className={styles.cardNote}>{tr(plan.allocation, lang)}</p>
        )}
        <a
          className={styles.cardEnquire}
          href={enquiryHref(
            unit
              ? { interest: 'unit', unitType: type.id, unit: unit.unit }
              : { interest: 'unit', unitType: type.id },
          )}
        >
          {unit ? tr(plan.enquireUnit, lang) : tr(plan.enquireType, lang)}
        </a>
      </>
    );
  };

  let cardStyle: React.CSSProperties | undefined;
  let cardPlacement: 'above' | 'below' = 'below';
  if (shown && cardFloats && frame && view) {
    const left = (shown.anchor.x + shown.anchor.w / 2 - view.x) * scale;
    const top = (shown.anchor.y - view.y) * scale;
    const bottom = (shown.anchor.y + shown.anchor.h - view.y) * scale;
    cardPlacement = (top + bottom) / 2 > frame.height / 2 ? 'above' : 'below';
    const half = 160;
    cardStyle = {
      left: Math.min(Math.max(left, half + 8), frame.width - half - 8),
      top:
        cardPlacement === 'above'
          ? Math.min(Math.max(top - 10, 40), frame.height)
          : Math.max(Math.min(bottom + 10, frame.height - 40), 0),
    };
  }

  const card = shown ? (
    <section
      ref={cardRef}
      className={`${styles.card} ${cardFloats ? styles.cardFloating : ''}`}
      data-placement={cardPlacement}
      style={cardStyle}
      dir={dir}
      tabIndex={-1}
      aria-label={selectionTitle(shown)}
      onPointerEnter={() => window.clearTimeout(hoverTimer.current)}
      onPointerLeave={() => hovered && hoverOut()}
    >
      {!hovered && (
        <button
          type="button"
          className={styles.cardClose}
          onClick={close}
          aria-label={tr(common.close, lang)}
        >
          <X size={18} aria-hidden />
        </button>
      )}
      {renderCard(shown)}
    </section>
  ) : null;

  const isPressed = (sel: Omit<Selection, 'at'>) =>
    !!active && active.kind === sel.kind && active.id === sel.id;
  const isLit = (sel: Omit<Selection, 'at'>) =>
    isPressed(sel) ||
    (!!hovered && hovered.kind === sel.kind && hovered.id === sel.id);

  const zoneDimmed = highlightActive;

  return (
    <div ref={wrapRef} className={styles.planWrap}>
      <div className={styles.stage} data-plan-stage="">
        {highlightActive && highlightType && (
          <div ref={chipRef} className={styles.chip} tabIndex={-1}>
            <span>
              {tr(plan.showing, lang)}:{' '}
              <strong>{tr(unitTypeById(highlightType).name, lang)}</strong>{' '}
              <span className="latin">
                ({unitTypeById(highlightType).units.length})
              </span>
            </span>
            <button
              type="button"
              onClick={close}
              aria-label={tr(plan.clearHighlight, lang)}
            >
              <X size={16} aria-hidden />
            </button>
          </div>
        )}
        <div
          ref={attachFrame}
          className={`${styles.frame} ${zoomed ? styles.pannable : ''} ${dragging ? styles.grabbing : ''}`}
          style={frameStyle}
          dir="ltr"
          {...handlers}
        >
          <svg
            className={styles.svg}
            viewBox={
              view
                ? `${view.x} ${view.y} ${view.w} ${view.h}`
                : `${content.x} ${content.y} ${content.w} ${content.h}`
            }
            preserveAspectRatio="xMidYMid meet"
            // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- An SVG holding focusable areas is a group; no HTML tag fits.
            role="group"
            aria-label={tr(controls.mapLabel, lang)}
            data-variant={variant}
          >
            <defs>
              <pattern
                id={`${uid}-grid`}
                width={10}
                height={10}
                patternUnits="userSpaceOnUse"
              >
                <path d="M10 0H0V10" className={styles.gridLine} />
              </pattern>
            </defs>
            <rect
              x={0}
              y={0}
              width={site.width}
              height={site.depth}
              fill={`url(#${uid}-grid)`}
            />
            <PlanDrawing />

            {/* Dimension lines, as on the drawing */}
            <g className={styles.dimension} aria-hidden="true">
              <line x1={0} y1={-4.5} x2={site.width} y2={-4.5} />
              <line x1={0} y1={-6.5} x2={0} y2={-2.5} />
              <line x1={site.width} y1={-6.5} x2={site.width} y2={-2.5} />
              <line
                x1={site.width + 4.5}
                y1={0}
                x2={site.width + 4.5}
                y2={site.depth}
              />
              <line x1={site.width + 2.5} y1={0} x2={site.width + 6.5} y2={0} />
              <line
                x1={site.width + 2.5}
                y1={site.depth}
                x2={site.width + 6.5}
                y2={site.depth}
              />
              <text x={site.width / 2} y={-6.2} style={{ fontSize: labelSize }}>
                {site.width.toFixed(2)} {tr(controls.metres, lang)}
              </text>
              <text
                x={site.width + 8.2}
                y={site.depth / 2}
                style={{ fontSize: labelSize }}
                transform={`rotate(90 ${site.width + 8.2} ${site.depth / 2})`}
              >
                {site.depth.toFixed(2)} {tr(controls.metres, lang)}
              </text>
            </g>

            {/* Zones */}
            <g className={`${styles.zones} ${zoneDimmed ? styles.dimmed : ''}`}>
              {areaOrder.map((id) => {
                const area = planAreas.find((item) => item.id === id);
                const info = infoById.get(id);
                if (!area || !info) return null;
                const sel = {
                  kind: 'zone' as const,
                  id,
                  anchor: area.shapes[0],
                };
                return (
                  <g
                    key={id}
                    id={`plan-zone-${id}`}
                    className={`${styles.zone} ${isLit(sel) ? styles.on : ''}`}
                    style={
                      {
                        '--zone': info.color,
                        '--zone-ink': inkOn(info.color),
                      } as React.CSSProperties
                    }
                    {...itemProps(
                      sel,
                      `${info.number}. ${info.name}`,
                      isPressed(sel),
                    )}
                  >
                    {area.shapes.map((shape) => {
                      const hit = inflate(shape, targetPx / (scale || 1), 8);
                      return (
                        <g
                          key={`${shape.x}-${shape.y}`}
                          onClick={(event) => {
                            // Anchor the card to the block that was tapped, not the zone's first block.
                            event.stopPropagation();
                            if (consumeDrag()) return;
                            select({
                              kind: 'zone',
                              id,
                              anchor: shape,
                              at: highlight.seq,
                            });
                          }}
                        >
                          <rect
                            className={styles.hit}
                            x={hit.x}
                            y={hit.y}
                            width={hit.w}
                            height={hit.h}
                          />
                          <rect
                            className={styles.shape}
                            x={shape.x}
                            y={shape.y}
                            width={shape.w}
                            height={shape.h}
                          />
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </g>

            {/* Leasable units (partners only) */}
            {isPartners && (
              <g
                className={`${styles.units} ${highlightActive ? styles.dimmed : ''}`}
                data-units-layer=""
              >
                {planUnits.map((unit) => {
                  const type = unitTypeById(unit.type);
                  const zone = zoneById(type.zone);
                  const interactive = unitsInteractive(unit.rect);
                  const lit = highlightActive && highlightType === unit.type;
                  const sel = {
                    kind: 'unit' as const,
                    id: unit.id,
                    anchor: unit.rect,
                  };
                  const pressed = isPressed(sel);
                  const label = `${tr(type.name, lang)} ${unit.unit}, ${type.width} × ${type.depth} m, ${formatSar(type.price, lang)}`;
                  const center = {
                    x: unit.rect.x + unit.rect.w / 2,
                    y: unit.rect.y + unit.rect.h / 2,
                  };
                  return (
                    <g
                      key={unit.id}
                      id={unit.id}
                      data-unit-type={unit.type}
                      data-unit={unit.unit}
                      className={`${styles.unit} ${isLit(sel) ? styles.on : ''} ${lit ? styles.lit : ''} ${interactive ? '' : styles.inert}`}
                      style={{ '--zone': zone.color } as React.CSSProperties}
                      onPointerEnter={() =>
                        hoverIn({ ...sel, at: highlight.seq })
                      }
                      onPointerLeave={hoverOut}
                      {...itemProps(sel, label, pressed)}
                    >
                      <rect
                        className={styles.shape}
                        x={unit.rect.x}
                        y={unit.rect.y}
                        width={unit.rect.w}
                        height={unit.rect.h}
                      />
                      {unitLabelPx(unit.rect) >= 8 && (
                        <text
                          x={center.x}
                          y={center.y}
                          style={{ fontSize: unitLabelPx(unit.rect) / scale }}
                        >
                          {unit.type === 'lounge'
                            ? tr(type.name, lang)
                            : unit.unit}
                        </text>
                      )}
                    </g>
                  );
                })}
                {planTypeAreas.map((area) => {
                  const type = unitTypeById(area.type);
                  const zone = zoneById(type.zone);
                  const lit = highlightActive && highlightType === area.type;
                  const sel = {
                    kind: 'type' as const,
                    id: area.type,
                    anchor: boundsOf(area.shapes),
                  };
                  const pressed = isPressed(sel);
                  const label = `${tr(type.name, lang)}: ${type.units.length} ${tr(plan.unitsInArea, lang)}, ${type.width} × ${type.depth} m, ${formatSar(type.price, lang)}`;
                  return (
                    <g
                      key={area.id}
                      id={area.id}
                      data-unit-type={area.type}
                      data-type-area=""
                      className={`${styles.typeArea} ${isLit(sel) ? styles.on : ''} ${lit ? styles.lit : ''}`}
                      style={{ '--zone': zone.color } as React.CSSProperties}
                      onPointerEnter={() =>
                        hoverIn({ ...sel, at: highlight.seq })
                      }
                      onPointerLeave={hoverOut}
                      {...itemProps(sel, label, pressed)}
                    >
                      {area.shapes.map((shape) => {
                        const hit = inflate(shape, targetPx / (scale || 1), 6);
                        return (
                          <g key={`${shape.x}-${shape.y}`}>
                            <rect
                              className={styles.hit}
                              x={hit.x}
                              y={hit.y}
                              width={hit.w}
                              height={hit.h}
                            />
                            <rect
                              className={styles.shape}
                              x={shape.x}
                              y={shape.y}
                              width={shape.w}
                              height={shape.h}
                            />
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
              </g>
            )}

            {/* Legend numbers and names, always on top and never in the way of a tap */}
            <g
              className={`${styles.badges} ${highlightActive ? styles.dimmed : ''}`}
              aria-hidden="true"
            >
              {planAreas.map((area) => {
                const info = infoById.get(area.id);
                if (!info) return null;
                return (
                  <g
                    key={area.id}
                    style={
                      {
                        '--zone': info.color,
                        '--zone-ink': inkOn(info.color),
                      } as React.CSSProperties
                    }
                  >
                    {area.label && (
                      <text
                        className={styles.areaLabel}
                        x={area.label.x}
                        y={area.label.y}
                        style={{ fontSize: labelSize }}
                      >
                        {info.name}
                      </text>
                    )}
                    {/* On the partners plan the units carry their own labels, so Hub and dining badges step aside. */}
                    {(isPartners && (area.id === 'hub' || area.id === 'fnb')
                      ? area.badges.filter((_, i) => area.id === 'fnb' && i > 0)
                      : area.badges
                    ).map((badge) => (
                      <g key={`${badge.x}-${badge.y}`} className={styles.badge}>
                        <circle cx={badge.x} cy={badge.y} r={r} />
                        <text
                          x={badge.x}
                          y={badge.y}
                          style={{ fontSize: r * 1.15 }}
                        >
                          {info.number}
                        </text>
                      </g>
                    ))}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
        {cardFloats && card}
      </div>

      <div className={styles.toolbar}>
        {zoomed && view && (
          <MiniMap
            view={view}
            onJump={centerOn}
            label={tr(controls.overview, lang)}
            infos={infoById}
          />
        )}
        <p className={styles.hint}>
          {tr(isPartners ? plan.hint : controls.hint, lang)}
        </p>
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
        <button
          type="button"
          className={styles.drawingButton}
          onClick={() => setDrawingOpen(true)}
        >
          <MapIcon size={17} aria-hidden />
          {tr(controls.originalDrawing, lang)}
        </button>
      </div>

      {!cardFloats && card}

      {isPartners && (
        <p className={styles.allocation}>{tr(plan.allocation, lang)}</p>
      )}

      <p className="visually-hidden" aria-live="polite">
        {announcement}
      </p>

      <h3 className={styles.legendTitle}>{tr(controls.legendLabel, lang)}</h3>
      <ol className={styles.legend}>
        {infos.map((info) => {
          const bounds = areaBounds(info.id);
          const pressed =
            !!active && active.kind === 'zone' && active.id === info.id;
          return (
            <li
              key={info.id}
              style={
                {
                  '--zone': info.color,
                  '--zone-ink': inkOn(info.color),
                } as React.CSSProperties
              }
            >
              <button
                type="button"
                aria-pressed={pressed}
                className={styles.legendButton}
                onClick={() => {
                  select({
                    kind: 'zone',
                    id: info.id,
                    anchor: bounds,
                    at: highlight.seq,
                  });
                  if (
                    view &&
                    (bounds.x < view.x ||
                      bounds.x + bounds.w > view.x + view.w ||
                      bounds.y < view.y ||
                      bounds.y + bounds.h > view.y + view.h)
                  ) {
                    focusOn(bounds, 6, scale);
                  }
                }}
              >
                <span className={`latin ${styles.number}`}>{info.number}</span>
                <span className={styles.legendText}>
                  <strong>{info.name}</strong>
                  <span>{info.features.join(lang === 'ar' ? '، ' : ', ')}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <DrawingModal
        open={drawingOpen}
        onOpenChange={setDrawingOpen}
        lang={lang}
      />
    </div>
  );
}

function MiniMap({
  view,
  onJump,
  label,
  infos,
}: {
  view: View;
  onJump: (x: number, y: number) => void;
  label: string;
  infos: Map<MapAreaId, { color: string }>;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const jump = (event: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const box = svg.getBoundingClientRect();
    onJump(
      content.x + ((event.clientX - box.left) / box.width) * content.w,
      content.y + ((event.clientY - box.top) / box.height) * content.h,
    );
  };
  return (
    <svg
      ref={svgRef}
      className={styles.minimap}
      viewBox={`${content.x} ${content.y} ${content.w} ${content.h}`}
      aria-hidden="true"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        jump(event);
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) jump(event);
      }}
    >
      <title>{label}</title>
      <rect
        className={styles.minimapSite}
        x={0}
        y={0}
        width={site.width}
        height={site.depth}
      />
      {planAreas.map((area) =>
        area.shapes.map((shape) => (
          <rect
            key={`${area.id}-${shape.x}-${shape.y}`}
            x={shape.x}
            y={shape.y}
            width={shape.w}
            height={shape.h}
            fill={infos.get(area.id)?.color}
          />
        )),
      )}
      <rect
        className={styles.minimapView}
        x={view.x}
        y={view.y}
        width={view.w}
        height={view.h}
      />
    </svg>
  );
}
