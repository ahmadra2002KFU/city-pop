import { useSyncExternalStore } from 'react';
import type { UnitTypeId } from '@/content/units';

/**
 * Tiny shared store between the Spaces cards and the masterplan: "Show on
 * map" puts a unit type here, the map highlights it. `seq` changes on every
 * request so asking for the same type twice still re-focuses the map.
 */
export type PlanSelection = { unitType: UnitTypeId | null; seq: number };

const initial: PlanSelection = { unitType: null, seq: 0 };
let state: PlanSelection = initial;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function showUnitTypeOnMap(unitType: UnitTypeId) {
  state = { unitType, seq: state.seq + 1 };
  emit();
}

export function clearPlanHighlight() {
  if (state.unitType === null) return;
  state = { unitType: null, seq: state.seq + 1 };
  emit();
}

export function usePlanSelection(): PlanSelection {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => initial,
  );
}
