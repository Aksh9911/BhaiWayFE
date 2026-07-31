import type { LocationFieldType, SelectedLocation } from '../types';

type LocationListener = (payload: {
  field: LocationFieldType;
  location: SelectedLocation;
}) => void;

let listener: LocationListener | null = null;

/** Bridges the map picker screen back to Find a Ride without remounting form state. */
export const locationPickerBridge = {
  register: (next: LocationListener): (() => void) => {
    listener = next;
    return () => {
      if (listener === next) {
        listener = null;
      }
    };
  },

  publish: (field: LocationFieldType, location: SelectedLocation): void => {
    listener?.({ field, location });
  },
};

/** @deprecated Use locationPickerBridge */
export const destinationPickerBridge = {
  register: (next: (destination: SelectedLocation) => void): (() => void) =>
    locationPickerBridge.register(({ location }) => next(location)),
  publish: (destination: SelectedLocation): void => {
    locationPickerBridge.publish('destination', destination);
  },
};
