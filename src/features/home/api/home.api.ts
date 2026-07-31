import { ENDPOINTS, httpClient } from '@/network';
import type { HomeDashboard } from '../types';

export const fetchDashboard = (): Promise<HomeDashboard> =>
  httpClient.get<HomeDashboard>(ENDPOINTS.home.dashboard);
