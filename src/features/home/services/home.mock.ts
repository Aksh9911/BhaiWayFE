import { delay } from '@/shared/utils';
import { DEFAULT_HOME_LOCATION, HOME_MOCK_DELAY_MS, HOME_SERVICE_CARDS } from '../constants';
import type { HomeDashboard } from '../types';

export const fetchDashboard = async (): Promise<HomeDashboard> => {
  await delay(HOME_MOCK_DELAY_MS);
  return {
    location: DEFAULT_HOME_LOCATION,
    cardIds: HOME_SERVICE_CARDS.map((card) => card.id),
  };
};
