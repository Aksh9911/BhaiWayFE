import type { ImageSourcePropType } from 'react-native';

import type { CommuteBadgeVariant } from '../../types';

export interface CommuteOptionCardProps {
  badge: string;
  badgeVariant: CommuteBadgeVariant;
  title: string;
  icon: string;
  description: string;
  actionLabel: string;
  image: ImageSourcePropType;
  onPress: () => void;
}
