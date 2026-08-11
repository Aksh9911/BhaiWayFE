export type MyRidesSurface = 'standard' | 'office-commute';

type Listener = (surface: MyRidesSurface) => void;

let surface: MyRidesSurface = 'standard';
const listeners = new Set<Listener>();

const notify = (): void => {
  listeners.forEach((listener) => listener(surface));
};

export const myRidesSurfaceStore = {
  get: (): MyRidesSurface => surface,

  set: (next: MyRidesSurface): void => {
    if (surface === next) {
      return;
    }
    surface = next;
    notify();
  },

  setStandard: (): void => {
    myRidesSurfaceStore.set('standard');
  },

  setOfficeCommute: (): void => {
    myRidesSurfaceStore.set('office-commute');
  },

  isOfficeCommute: (): boolean => surface === 'office-commute',

  subscribe: (listener: Listener): (() => void) => {
    listeners.add(listener);
    listener(surface);
    return () => {
      listeners.delete(listener);
    };
  },
};
