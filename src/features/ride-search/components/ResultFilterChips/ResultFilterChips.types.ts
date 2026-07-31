import type { RideResultFilterId } from '../../types';

export type RideTypeTabId = Extract<RideResultFilterId, 'regular' | 'assured'>;

export interface ResultFilterChipsProps {
  selectedId: RideTypeTabId;
  onSelect: (id: RideTypeTabId) => void;
}
