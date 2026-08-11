import { useCallback } from 'react';
import { showAppAlert } from '@/store';

export const useOptionPicker = () =>
  useCallback((title: string, options: readonly string[], onSelect: (value: string) => void) => {
    showAppAlert(
      title,
      undefined,
      [
        ...options.map((option) => ({
          text: option,
          onPress: () => onSelect(option),
        })),
        { text: 'Cancel', style: 'cancel' as const },
      ],
    );
  }, []);
