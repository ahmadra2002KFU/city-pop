import type { MapAreaId } from './zones';
import type { UnitTypeId } from './units';

/**
 * Masterplan geometry, in metres, traced from the V06 p10 CAD drawing
 * (assets/source/masterplan-cad.jpg, 10.334 px per metre, site origin at
 * px 2.5 / 95.5) and checked against the zoned render (masterplan-zoned.png).
 * x runs west → east (entrance → stage), y runs north → south, as drawn.
 *
 * Positioned units are only those that sit in the same place on both the V06
 * plan and the partnerships deck plan: Main Stores 01–20, Quality Dining 1–4
 * and the Lounge. The deck's Secondary Stores and F&B kiosks have no matching
 * cells on V06, so they are shown as type areas, never as numbered cells.
 */

export type Rect = { x: number; y: number; w: number; h: number };
export type Point = { x: number; y: number };

/** Site boundary (V06 p9–10: 380.20 × 121.92 m). */
export const site = { width: 380.2, depth: 121.92 } as const;

const r = (x: number, y: number, w: number, h: number): Rect => ({
  x,
  y,
  w,
  h,
});

export type PlanArea = {
  id: MapAreaId;
  shapes: readonly Rect[];
  /** Where the legend number sits (V06 p10 puts one marker per block). */
  badges: readonly Point[];
  /** Optional name label for the larger areas. */
  label?: Point;
};

/** Zone blocks as coloured on V06 p10. */
export const planAreas: readonly PlanArea[] = [
  {
    id: 'entrance',
    shapes: [r(16.5, 52, 10, 24)],
    badges: [{ x: 21.5, y: 64 }],
  },
  {
    id: 'hub',
    shapes: [
      r(36.6, 23.9, 70, 20),
      r(116.5, 23.9, 70, 20),
      r(36.6, 84, 70, 20),
      r(116.5, 84, 70, 20),
    ],
    badges: [
      { x: 71.6, y: 33.9 },
      { x: 151.5, y: 33.9 },
      { x: 71.6, y: 94 },
      { x: 151.5, y: 94 },
    ],
  },
  {
    id: 'social',
    shapes: [
      r(64.8, 49, 113.2, 28),
      r(201.6, 42, 20.4, 43),
      r(261.6, 42, 20.4, 43),
      r(238.2, 46, 6.8, 3.4),
      r(238.2, 78.4, 6.8, 3.4),
    ],
    badges: [
      { x: 111.6, y: 64 },
      { x: 211.8, y: 63.5 },
      { x: 271.8, y: 63.5 },
    ],
    label: { x: 111.6, y: 54.5 },
  },
  {
    id: 'tiny',
    shapes: [r(196.5, 93.9, 110.1, 19.85)],
    badges: [
      { x: 211.5, y: 103.8 },
      { x: 251.5, y: 103.8 },
      { x: 291.5, y: 103.8 },
    ],
  },
  {
    id: 'fnb',
    shapes: [
      r(196.5, 13.8, 110.1, 23.2),
      r(232.6, 61.5, 18, 4.9),
      r(297.4, 49.6, 9.2, 28.3),
    ],
    badges: [
      { x: 251.5, y: 23.8 },
      { x: 241.6, y: 56.5 },
      { x: 292.2, y: 63.7 },
    ],
  },
  {
    id: 'popoff',
    shapes: [r(306.6, 63.3, 73.6, 58.62)],
    badges: [{ x: 316.6, y: 100 }],
    label: { x: 316.6, y: 70 },
  },
  {
    id: 'stage',
    shapes: [r(306.6, 0, 73.6, 63.3)],
    badges: [{ x: 361.2, y: 36.2 }],
    label: { x: 339.2, y: 7 },
  },
  {
    id: 'facilities',
    shapes: [
      r(26.5, 6, 17, 7.8),
      r(99.6, 6, 17, 7.8),
      r(178.5, 6, 17, 7.8),
      r(26.5, 113.75, 17, 7.7),
      r(99.6, 113.75, 17, 7.7),
      r(178.5, 113.75, 17, 7.7),
      r(11.6, 81.8, 14.9, 32.2),
    ],
    badges: [
      { x: 35, y: 9.9 },
      { x: 108.1, y: 9.9 },
      { x: 187, y: 9.9 },
      { x: 35, y: 117.6 },
      { x: 108.1, y: 117.6 },
      { x: 187, y: 117.6 },
      { x: 19, y: 98 },
    ],
  },
];

export type PlanUnit = {
  /** DOM id and enquiry key, e.g. `unit-main-store-07`. */
  id: string;
  type: UnitTypeId;
  /** Unit number exactly as in content/units.ts. */
  unit: string;
  rect: Rect;
};

const hubBlocks = [
  { x: 36.6, y: 23.9, numbers: ['06', '07', '08', '09', '10'] },
  { x: 116.5, y: 23.9, numbers: ['16', '17', '18', '19', '20'] },
  { x: 36.6, y: 84, numbers: ['01', '02', '03', '04', '05'] },
  { x: 116.5, y: 84, numbers: ['11', '12', '13', '14', '15'] },
];
/** Store widths along each block, west → east (20 m ends, 10 m middles). */
const hubWidths = [20, 10, 10, 10, 20];

function hubUnits(): PlanUnit[] {
  return hubBlocks.flatMap((block) => {
    let x = block.x;
    return block.numbers.map((unit, i) => {
      const w = hubWidths[i];
      const type: UnitTypeId = w === 20 ? 'main-store-large' : 'main-store';
      const placed: PlanUnit = {
        id: `unit-main-store-${unit}`,
        type,
        unit,
        rect: r(x, block.y, w, 20),
      };
      x += w;
      return placed;
    });
  });
}

/** Units drawn individually at their deck positions (25 of the 54). */
export const planUnits: readonly PlanUnit[] = [
  ...hubUnits(),
  ...['01', '02', '03', '04'].map((unit, i) => ({
    id: `unit-quality-dining-${unit}`,
    type: 'quality-dining' as const,
    unit,
    rect: r(196.5 + i * 20, 13.8, 20, 20),
  })),
  {
    id: 'unit-lounge-01',
    type: 'lounge',
    unit: '01',
    rect: r(276.5, 13.8, 30.1, 20),
  },
];

export type PlanTypeArea = {
  id: string;
  type: UnitTypeId;
  shapes: readonly Rect[];
};

/**
 * Unit types whose individual cells the source does not place on V06: the
 * "Social street" 3 m cell blocks (Social POP) and the F&B kiosk cells.
 */
export const planTypeAreas: readonly PlanTypeArea[] = [
  {
    id: 'area-secondary-store',
    type: 'secondary-store',
    shapes: [
      r(67.6, 61.5, 18, 5),
      r(135.2, 61.5, 18, 5),
      r(202.6, 46, 18, 4.9),
      r(202.6, 77, 18, 4.9),
      r(262.6, 46, 18, 4.9),
      r(262.6, 77, 18, 4.9),
    ],
  },
  {
    id: 'area-fnb-kiosk',
    type: 'fnb-kiosk',
    shapes: [
      r(232.6, 61.5, 18, 4.9),
      r(303.9, 52, 2.6, 24),
      r(297.6, 50.1, 6, 2.3),
      r(297.6, 75.6, 6, 2.3),
    ],
  },
];

/** Drawing detail (not interactive): walls, cells, seating, track. */
export const planDetail = {
  hall: r(26.5, 13.8, 280.1, 99.95),
  /** Interior partitions of the eastern hall. */
  partitions: [
    [196.5, 13.8, 196.5, 37],
    [196.5, 93.9, 196.5, 113.75],
    [226.5, 93.9, 226.5, 113.75],
    [276.5, 93.9, 276.5, 113.75],
    [306.6, 63.3, 380.2, 63.3],
  ] as const,
  /** Seats row in front of the dining units. */
  seatsRow: r(196.5, 34, 110.1, 3),
  /** Social street blocks: rect plus 2 rows × 6 columns of cells. */
  cellBlocks: [
    r(67.6, 61.5, 18, 5),
    r(135.2, 61.5, 18, 5),
    r(202.6, 46, 18, 4.9),
    r(202.6, 77, 18, 4.9),
    r(262.6, 46, 18, 4.9),
    r(262.6, 77, 18, 4.9),
  ],
  /** F&B centre block: 2 rows × 3 kiosks of about 6 m. */
  kioskBlock: r(232.6, 61.5, 18, 4.9),
  kioskColumn: r(303.9, 52, 2.6, 24),
  sponsors: [r(238.6, 46.5, 6, 2.4), r(238.6, 79, 6, 2.3)],
  seating: [r(202.9, 58, 17.4, 11.9), r(262.8, 58, 17.5, 11.9)],
  islands: [
    { x: 111.6, y: 64, r: 5.5 },
    { x: 41.6, y: 64.1, r: 2.4 },
    { x: 94.5, y: 73.3, r: 2.9 },
    { x: 186.5, y: 53.9, r: 2.9 },
  ],
  planters: [
    'M104.3 56.5 Q111.4 49.5 118.6 56.5',
    'M104.3 71.6 Q111.4 78.6 118.6 71.6',
  ],
  platform: r(171.5, 61, 6.1, 6),
  giftShop: { x: 31.2, y: 45.6, w: 6.2, h: 3.4, angle: -40 },
  restroomsEast: [r(306.6, 11.1, 3, 12.1), r(306.6, 49.2, 3, 12.1)],
  /** Stage POP: seating block, stage, back-of-house box. */
  seatingBlock: r(324.7, 14.2, 29, 43.9),
  stage: r(357.5, 16.2, 7.4, 40),
  stageBox: r(367.4, 26.1, 10.1, 20.1),
  /** POP OFF: karting enclosure, schematic figure-of-eight track, game structures. */
  karting: r(326.7, 71.9, 53.5, 49.5),
  track:
    'M331 110 L331 86 Q331 75 340 75 Q348 75 352.5 85 Q357 75 366 75 Q377 75 377 86 L377 108 Q377 117.5 367 117.5 L341 117.5 Q331 117.5 331 110 Z M335 109 L335 87 Q335 79 340 79 Q345 79 349 88 L352.5 95 L356 88 Q360 79 366 79 Q373 79 373 87 L373 107 Q373 113.5 366 113.5 L342 113.5 Q335 113.5 335 109 Z',
  games: [r(306.6, 83.2, 7.6, 5.6), r(319, 83.2, 7.7, 5.6)],
} as const;

export function rectCenter(rect: Rect): Point {
  return { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 };
}

/** Bounding box of several rects. */
export function boundsOf(rects: readonly Rect[]): Rect {
  const x0 = Math.min(...rects.map((item) => item.x));
  const y0 = Math.min(...rects.map((item) => item.y));
  const x1 = Math.max(...rects.map((item) => item.x + item.w));
  const y1 = Math.max(...rects.map((item) => item.y + item.h));
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}
