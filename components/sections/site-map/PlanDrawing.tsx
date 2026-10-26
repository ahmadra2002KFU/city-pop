import { memo } from 'react';
import { planDetail, site, type Rect } from '@/content/plan-geometry';
import styles from './site-map.module.css';

const box = (rect: Rect, className?: string) => (
  <rect
    className={className}
    x={rect.x}
    y={rect.y}
    width={rect.w}
    height={rect.h}
  />
);

/** Rows × columns of cells inside a rect, drawn as dividing lines. */
function cellLines(rect: Rect, rows: number, cols: number) {
  const lines: React.ReactNode[] = [];
  for (let c = 1; c < cols; c++) {
    const x = rect.x + (rect.w / cols) * c;
    lines.push(
      <line key={`c${c}`} x1={x} y1={rect.y} x2={x} y2={rect.y + rect.h} />,
    );
  }
  for (let r = 1; r < rows; r++) {
    const y = rect.y + (rect.h / rows) * r;
    lines.push(
      <line key={`r${r}`} x1={rect.x} y1={y} x2={rect.x + rect.w} y2={y} />,
    );
  }
  return lines;
}

function tables(rect: Rect) {
  const dots: React.ReactNode[] = [];
  const cols = 7;
  const rows = 3;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(
        <circle
          key={`${r}-${c}`}
          cx={rect.x + (rect.w / cols) * (c + 0.5)}
          cy={rect.y + (rect.h / rows) * (r + 0.5)}
          r={0.9}
        />,
      );
    }
  }
  return dots;
}

/**
 * The non-interactive drawing under the zones: site boundary, hall walls,
 * market cells, seating, stage and karting track, after the V06 p10 CAD.
 */
export const PlanDrawing = memo(function PlanDrawing() {
  const d = planDetail;
  const seatRows = Array.from(
    { length: 16 },
    (_, i) => d.seatingBlock.y + 1.5 + i * 2.7,
  );
  return (
    <g className={styles.drawing} aria-hidden="true">
      <rect
        className={styles.siteEdge}
        x={0}
        y={0}
        width={site.width}
        height={site.depth}
      />
      {box(d.hall, styles.hall)}
      {d.partitions.map(([x1, y1, x2, y2]) => (
        <line key={`${x1}-${y1}-${x2}`} x1={x1} y1={y1} x2={x2} y2={y2} />
      ))}
      {box(d.seatsRow)}
      {d.cellBlocks.map((rect) => (
        <g key={`${rect.x}-${rect.y}`}>
          {box(rect)}
          {cellLines(rect, 2, 6)}
        </g>
      ))}
      <g>
        {box(d.kioskBlock)}
        {cellLines(d.kioskBlock, 2, 3)}
      </g>
      <g>
        {box(d.kioskColumn)}
        {cellLines(d.kioskColumn, 4, 1)}
      </g>
      {d.sponsors.map((rect) => (
        <g key={rect.y}>
          {box(rect)}
          {cellLines(rect, 1, 2)}
        </g>
      ))}
      {d.seating.map((rect) => (
        <g key={rect.x}>
          {box(rect)}
          <g className={styles.dots}>{tables(rect)}</g>
        </g>
      ))}
      {d.islands.map((island) => (
        <circle
          key={`${island.x}-${island.y}`}
          cx={island.x}
          cy={island.y}
          r={island.r}
        />
      ))}
      <circle
        className={styles.planterCore}
        cx={d.islands[0].x}
        cy={d.islands[0].y}
        r={1.4}
      />
      {d.planters.map((path) => (
        <path key={path} className={styles.planter} d={path} />
      ))}
      {box(d.platform)}
      <rect
        x={d.giftShop.x - d.giftShop.w / 2}
        y={d.giftShop.y - d.giftShop.h / 2}
        width={d.giftShop.w}
        height={d.giftShop.h}
        transform={`rotate(${d.giftShop.angle} ${d.giftShop.x} ${d.giftShop.y})`}
      />
      {d.restroomsEast.map((rect) => (
        <g key={rect.y}>
          {box(rect)}
          {cellLines(rect, 2, 1)}
        </g>
      ))}
      {/* Entrance stairs */}
      <g>
        {Array.from({ length: 9 }, (_, i) => 17.6 + i * 1.1).map((x) => (
          <line key={x} x1={x} y1={52} x2={x} y2={76} />
        ))}
        <line x1={16.5} y1={64} x2={26.5} y2={64} />
      </g>
      {/* Stage POP */}
      {box(d.seatingBlock)}
      <g className={styles.seats}>
        {seatRows.map((y) => (
          <line
            key={y}
            x1={d.seatingBlock.x + 1}
            y1={y}
            x2={d.seatingBlock.x + d.seatingBlock.w - 1}
            y2={y}
          />
        ))}
      </g>
      {box(d.stage, styles.stageDeck)}
      {box(d.stageBox)}
      {/* POP OFF */}
      {box(d.karting)}
      <path className={styles.track} d={d.track} />
      {d.games.map((rect) => (
        <g key={rect.x}>{box(rect)}</g>
      ))}
    </g>
  );
});
