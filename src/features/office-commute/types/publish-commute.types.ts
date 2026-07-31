import type { CommuteSelectedLocation } from './location.types';

export type WeekdayId = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface WeekdayOption {
  id: WeekdayId;
  label: string;
}

export interface PublishCommuteDraft {
  startLocation: string;
  officeLocation: string;
  startLocationDetail: CommuteSelectedLocation | null;
  officeLocationDetail: CommuteSelectedLocation | null;
  departureTime: string;
  seats: number;
  recurringDays: WeekdayId[];
  returningBack: boolean;
  pricePerSeat: string;
}
