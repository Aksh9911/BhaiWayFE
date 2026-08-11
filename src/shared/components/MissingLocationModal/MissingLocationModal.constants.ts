import type { MissingLocationContext, MissingLocationKind } from './MissingLocationModal.types';

const COPY: Record<
  MissingLocationContext,
  Record<MissingLocationKind, { title: string; message: string; actionLabel: string }>
> = {
  ride: {
    origin: {
      title: 'Starting Point Required',
      message: 'Please select a starting point to continue searching for rides.',
      actionLabel: 'Select Starting Point',
    },
    destination: {
      title: 'Destination Required',
      message: 'Please select a destination to continue searching for rides.',
      actionLabel: 'Select Destination',
    },
    both: {
      title: 'Route Incomplete',
      message: 'Please select both a starting point and a destination to continue.',
      actionLabel: 'Select Locations',
    },
  },
  drive: {
    origin: {
      title: 'Starting Point Required',
      message: 'Please select a starting point before publishing your drive.',
      actionLabel: 'Select Starting Point',
    },
    destination: {
      title: 'Destination Required',
      message: 'Please select a destination before publishing your drive.',
      actionLabel: 'Select Destination',
    },
    both: {
      title: 'Route Incomplete',
      message: 'Please select both origin and destination before publishing your drive.',
      actionLabel: 'Select Locations',
    },
  },
  commute: {
    origin: {
      title: 'Starting Point Required',
      message: 'Please select your start location before publishing this commute drive.',
      actionLabel: 'Select Start Location',
    },
    destination: {
      title: 'Destination Required',
      message: 'Please select your office destination before publishing this commute drive.',
      actionLabel: 'Select Destination',
    },
    both: {
      title: 'Route Incomplete',
      message: 'Please select both start and office locations before publishing this commute drive.',
      actionLabel: 'Select Locations',
    },
  },
};

export const getMissingLocationCopy = (
  kind: MissingLocationKind,
  context: MissingLocationContext = 'ride',
) => COPY[context][kind];

export const MISSING_LOCATION_DONE_LABEL = 'Got it';
