import type { ImageSourcePropType } from 'react-native';
import type { ServiceCardData } from '../../types';

export interface ServiceCardProps {
  data: ServiceCardData;
  index: number;
  illustration?: ImageSourcePropType;
  onPress: (data: ServiceCardData) => void;
}
