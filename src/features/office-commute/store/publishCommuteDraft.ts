import { DEFAULT_PUBLISH_COMMUTE_DRAFT } from '../constants/select-location.constants';
import type {
  CommuteLocationField,
  CommuteSelectedLocation,
  PublishCommuteDraft,
} from '../types';

type DraftListener = (draft: PublishCommuteDraft) => void;

let draft: PublishCommuteDraft = { ...DEFAULT_PUBLISH_COMMUTE_DRAFT };
const listeners = new Set<DraftListener>();

const notify = (): void => {
  listeners.forEach((listener) => listener({ ...draft }));
};

export const publishCommuteDraft = {
  get: (): PublishCommuteDraft => ({ ...draft }),

  reset: (): void => {
    draft = { ...DEFAULT_PUBLISH_COMMUTE_DRAFT };
    notify();
  },

  update: (partial: Partial<PublishCommuteDraft>): void => {
    draft = { ...draft, ...partial };
    notify();
  },

  setLocation: (field: CommuteLocationField, location: CommuteSelectedLocation): void => {
    if (field === 'start') {
      draft = {
        ...draft,
        startLocation: location.placeName || location.address,
        startLocationDetail: location,
      };
    } else {
      draft = {
        ...draft,
        officeLocation: location.placeName || location.address,
        officeLocationDetail: location,
      };
    }
    notify();
  },

  subscribe: (listener: DraftListener): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
