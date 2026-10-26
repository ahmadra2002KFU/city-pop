import { tr, type L, type Lang } from '@/content/i18n';
import {
  mapNumbers,
  supportAreas,
  zones,
  type MapAreaId,
} from '@/content/zones';
import { unitTypes, type UnitType, type UnitTypeId } from '@/content/units';
import {
  boundsOf,
  planAreas,
  planTypeAreas,
  planUnits,
  type Rect,
} from '@/content/plan-geometry';

export type AreaInfo = {
  id: MapAreaId;
  number: number;
  name: string;
  subtitle?: string;
  color: string;
  features: string[];
};

/** Legend entries for the eight numbered areas, in legend order. */
export function areaInfos(lang: Lang): AreaInfo[] {
  const entries: AreaInfo[] = [
    ...zones.map((zone) => ({
      id: zone.id,
      number: mapNumbers[zone.id],
      name: zone.name,
      subtitle: tr(zone.subtitle, lang),
      color: zone.color,
      features: zone.features.map((feature) => tr(feature, lang)),
    })),
    ...(['entrance', 'facilities'] as const).map((id) => ({
      id,
      number: mapNumbers[id],
      name: tr(supportAreas[id].name, lang),
      color: supportAreas[id].color,
      features: supportAreas[id].features.map((feature: L) =>
        tr(feature, lang),
      ),
    })),
  ];
  return entries.sort((a, b) => a.number - b.number);
}

export function unitTypeById(id: UnitTypeId): UnitType {
  const type = unitTypes.find((item) => item.id === id);
  if (!type) throw new Error(`Unknown unit type: ${id}`);
  return type;
}

export function areaBounds(id: MapAreaId): Rect {
  const area = planAreas.find((item) => item.id === id);
  if (!area) throw new Error(`Unknown map area: ${id}`);
  return boundsOf(area.shapes);
}

/** Every shape that shows a unit type on the map: its units, or its type area. */
export function unitTypeShapes(id: UnitTypeId): Rect[] {
  const units = planUnits
    .filter((unit) => unit.type === id)
    .map((unit) => unit.rect);
  const areas = planTypeAreas
    .filter((area) => area.type === id)
    .flatMap((area) => area.shapes);
  return [...units, ...areas];
}

/** Text colour for a zone-coloured chip: dark ink on light fills, white on dark ones (WCAG AA). */
export function inkOn(hex: string): string {
  const channel = (i: number) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const luminance =
    0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
  const onWhite = 1.05 / (luminance + 0.05);
  const onDark = (luminance + 0.05) / 0.0525;
  return onWhite >= onDark ? '#fff' : '#05060f';
}
