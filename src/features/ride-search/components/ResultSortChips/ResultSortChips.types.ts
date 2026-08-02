import type { RideResultSortId } from '../../types';

export interface ResultSortChipsProps {
  selectedId: RideResultSortId;
  onSelect: (id: RideResultSortId) => void;
}
