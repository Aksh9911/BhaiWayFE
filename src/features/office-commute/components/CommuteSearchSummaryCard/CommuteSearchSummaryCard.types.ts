import type { CommuteSearchSummary } from '../../types/commute-ride-result.types';

export interface CommuteSearchSummaryCardProps {
  summary: CommuteSearchSummary;
  editLabel?: string;
  onEdit: () => void;
}
