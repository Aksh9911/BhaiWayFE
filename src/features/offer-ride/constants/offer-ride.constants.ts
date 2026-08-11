import type { OutstationRideTypeOption } from '../types';

export const OUTSTATION_RIDE_SCREEN = {
  title: 'Publish Carpool Ride',
} as const;

export const OUTSTATION_RIDE_INTRO = {
  title: 'Choose your ride type',
  subtitle: 'Select Regular Ride or Assured Ride to continue publishing.',
} as const;

export const OUTSTATION_INCENTIVE = {
  message: 'Assured rides help you earn 1.5x more',
} as const;

export const OUTSTATION_HERO_IMAGE = require('../../../../assets/images/offer-ride/outstation-hero.png');

export const OUTSTATION_RIDE_TYPES: readonly OutstationRideTypeOption[] = [
  {
    id: 'regular',
    title: 'Regular Ride',
    icon: 'car-outline',
    iconVariant: 'muted',
    description: 'Standard intercity ride sharing. Flexible for both you and your passengers.',
    buttonLabel: 'Select Regular',
    buttonVariant: 'accent',
  },
  {
    id: 'assured',
    title: 'Assured Ride',
    icon: 'shield-checkmark',
    iconVariant: 'dark',
    description: 'Guaranteed rides for passengers. Earn a premium booking amount upfront.',
    buttonLabel: 'Select Assured',
    buttonVariant: 'primary',
    highlighted: true,
    badge: 'Best for Drivers',
    note: '*Note: Cancellation fees apply for assured rides.*',
  },
] as const;

export {
  DEFAULT_PUBLISH_DRAFT,
  PUBLISH_RIDE_SCREEN,
  SELECT_LOCATION_SCREEN,
  PUBLISH_SEAT_LIMITS,
  getPublishRidePath,
  getSelectLocationPath,
  getRidePreferencesPath,
  formatTimeLabel,
  parseTimeLabel,
} from './publish-ride.constants';
