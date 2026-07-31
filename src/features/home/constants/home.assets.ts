import type { ImageSourcePropType } from 'react-native';

import type { ServiceCardVariant } from '../types';

export const HOME_SERVICE_CARD_ILLUSTRATIONS: Record<ServiceCardVariant, ImageSourcePropType> = {
  publish: require('../../../../assets/images/home/publish-carpool-ride.png'),
  office: require('../../../../assets/images/home/daily-commute.png'),
  outstation: require('../../../../assets/images/home/outstation-carpool.png'),
};
