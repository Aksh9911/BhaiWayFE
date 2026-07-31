import { useCallback } from 'react';
import { Alert } from 'react-native';

export const useOptionPicker = () =>
  useCallback((title: string, options: readonly string[], onSelect: (value: string) => void) => {
    Alert.alert(
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
