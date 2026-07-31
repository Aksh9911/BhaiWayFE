import type { ImageSourcePropType } from 'react-native';

import type { AppRoute } from '@/config';

export type CommuteOptionId = 'publish' | 'book';
export type CommuteBadgeVariant = 'primary' | 'light';

export interface CommuteOption {
  id: CommuteOptionId;
  badge: string;
  badgeVariant: CommuteBadgeVariant;
  title: string;
  icon: string;
  description: string;
  actionLabel: string;
  image: ImageSourcePropType;
  route: AppRoute;
  searchMode: 'publish' | 'office';
}
