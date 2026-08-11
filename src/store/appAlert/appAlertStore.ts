export type AppAlertButtonStyle = 'default' | 'cancel' | 'destructive';

export type AppAlertVariant = 'info' | 'success' | 'error' | 'warning';

export interface AppAlertButton {
  text: string;
  style?: AppAlertButtonStyle;
  onPress?: () => void;
}

export interface AppAlertPayload {
  title: string;
  message?: string;
  buttons?: AppAlertButton[];
  variant?: AppAlertVariant;
}

type AlertListener = (payload: AppAlertPayload | null) => void;

let current: AppAlertPayload | null = null;
const listeners = new Set<AlertListener>();

const notify = (): void => {
  listeners.forEach((listener) => listener(current));
};

const inferVariant = (title: string, buttons?: AppAlertButton[]): AppAlertVariant => {
  const hasDestructive = buttons?.some((button) => button.style === 'destructive');
  if (hasDestructive) {
    return 'error';
  }

  const normalized = title.toLowerCase();
  if (
    normalized.includes('success') ||
    normalized.includes('verified') ||
    normalized.includes('sent') ||
    normalized.includes('added') ||
    normalized.includes('published') ||
    normalized.includes('updated') ||
    normalized.includes('uploaded') ||
    normalized.includes('deleted') ||
    normalized.includes('saved')
  ) {
    return 'success';
  }
  if (
    normalized.includes('fail') ||
    normalized.includes('error') ||
    normalized.includes('unable') ||
    normalized.includes('invalid') ||
    normalized.includes('required') ||
    normalized.includes('insufficient') ||
    normalized.includes('denied')
  ) {
    return 'error';
  }
  if (
    normalized.includes('missing') ||
    normalized.includes('coming soon') ||
    normalized.includes('warning') ||
    normalized.includes('confirm')
  ) {
    return 'warning';
  }
  return 'info';
};

export const appAlertStore = {
  get: (): AppAlertPayload | null => current,

  show: (payload: AppAlertPayload): void => {
    current = {
      ...payload,
      variant: payload.variant ?? inferVariant(payload.title, payload.buttons),
      buttons:
        payload.buttons && payload.buttons.length > 0
          ? payload.buttons
          : [{ text: 'OK', style: 'default' }],
    };
    notify();
  },

  hide: (): void => {
    if (!current) {
      return;
    }
    current = null;
    notify();
  },

  subscribe: (listener: AlertListener): (() => void) => {
    listeners.add(listener);
    listener(current);
    return () => {
      listeners.delete(listener);
    };
  },
};

/** Drop-in replacement for React Native `Alert.alert`. */
export const showAppAlert = (
  title: string,
  message?: string,
  buttons?: AppAlertButton[],
  variant?: AppAlertVariant,
): void => {
  appAlertStore.show({
    title,
    message,
    buttons,
    variant,
  });
};
