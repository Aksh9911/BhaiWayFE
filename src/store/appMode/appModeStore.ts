export type AppMode = 'riding' | 'driving';

type ModeListener = (mode: AppMode) => void;

let mode: AppMode = 'riding';
const listeners = new Set<ModeListener>();

const notify = (): void => {
  listeners.forEach((listener) => listener(mode));
};

export const appModeStore = {
  get: (): AppMode => mode,

  set: (next: AppMode): void => {
    if (mode === next) {
      return;
    }
    mode = next;
    notify();
  },

  setDriving: (): void => {
    appModeStore.set('driving');
  },

  setRiding: (): void => {
    appModeStore.set('riding');
  },

  subscribe: (listener: ModeListener): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
