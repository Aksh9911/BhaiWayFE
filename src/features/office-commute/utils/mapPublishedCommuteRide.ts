import {
  publishedRidesSheetStore,
  type PublishedRidesSheetRow,
} from '@/DemoData';
import { authSession } from '@/store';
import {
  getPublishedRideOrganization,
  getPublishedRideVehicleColor,
  mapPublishedRideToResult,
} from '@/features/ride-search/utils';

import type { CommuteRideResultItem } from '../types/commute-ride-result.types';

const normalizeMobile = (value?: string | null): string =>
  (value ?? '').replace(/\D/g, '').slice(-10);

const mapPublishedRideToCommuteResult = (row: PublishedRidesSheetRow): CommuteRideResultItem => {
  const base = mapPublishedRideToResult(row);
  return {
    ...base,
    vehicleColor: getPublishedRideVehicleColor(row),
    seatsNote: `${Math.max(0, row.availableSeats)} seats left`,
    organization: getPublishedRideOrganization(row),
  };
};

/** Published rides for office commute search (DemoData only; excludes own offers). */
export const getPublishedRidesForCommuteSearch = (): CommuteRideResultItem[] => {
  const sessionPhone = normalizeMobile(authSession.getUser()?.phone);
  return publishedRidesSheetStore
    .getAll()
    .filter((row) => row.status === 'published')
    .filter((row) => {
      if (!sessionPhone) {
        return true;
      }
      return normalizeMobile(row.mobile) !== sessionPhone;
    })
    .map(mapPublishedRideToCommuteResult);
};
