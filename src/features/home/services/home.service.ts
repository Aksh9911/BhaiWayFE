import { env } from '@/config';
import * as homeApi from '../api';
import type { HomeDashboard } from '../types';
import * as homeMock from './home.mock';

const impl = env.useMocks ? homeMock : homeApi;

export const homeService = {
  fetchDashboard: (): Promise<HomeDashboard> => impl.fetchDashboard(),
};
