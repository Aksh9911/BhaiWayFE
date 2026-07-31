import type { RecentSearchItem } from '../../types';

export interface RecentSearchesSectionProps {
  items: readonly RecentSearchItem[];
  onSelect: (item: RecentSearchItem) => void;
  title?: string;
  clearAllLabel?: string;
  emptyLabel?: string;
  onClearAll?: () => void;
  /** `cards` matches the commute find-ride mockup; `list` is the compact outstation style. */
  variant?: 'list' | 'cards';
}
