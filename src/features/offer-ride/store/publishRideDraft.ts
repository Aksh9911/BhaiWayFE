import { DEFAULT_PUBLISH_DRAFT } from '../constants/publish-ride.constants';
import type {
  LocationFieldType,
  OutstationRideTypeId,
  PublishRideDraft,
  SelectedLocation,
} from '../types';

type DraftListener = (draft: PublishRideDraft) => void;

let draft: PublishRideDraft = { ...DEFAULT_PUBLISH_DRAFT };
const listeners = new Set<DraftListener>();

const notify = (): void => {
  listeners.forEach((listener) => listener({ ...draft }));
};

export const publishRideDraft = {
  get: (): PublishRideDraft => ({ ...draft }),

  reset: (rideType: OutstationRideTypeId = 'regular'): void => {
    draft = {
      ...DEFAULT_PUBLISH_DRAFT,
      rideType,
    };
    notify();
  },

  update: (partial: Partial<PublishRideDraft>): void => {
    draft = { ...draft, ...partial };
    notify();
  },

  setLocation: (field: LocationFieldType, location: SelectedLocation): void => {
    if (field === 'origin') {
      draft = {
        ...draft,
        origin: location.address,
        originLocation: location,
      };
    } else {
      draft = {
        ...draft,
        destination: location.address,
        destinationLocation: location,
      };
    }
    notify();
  },

  subscribe: (listener: DraftListener): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
