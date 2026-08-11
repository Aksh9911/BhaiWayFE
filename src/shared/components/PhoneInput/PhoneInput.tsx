import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COUNTRIES, DEFAULT_COUNTRY } from '@/shared/constants';
import { colors } from '@/shared/theme';
import type { CountryOption } from '@/shared/types';
import { formatPhoneNumber, sanitizePhoneNumber } from '@/shared/utils';
import { styles } from './PhoneInput.styles';
import type { PhoneInputProps } from './PhoneInput.types';
import { AppText as Text, AppTextInput as TextInput } from '../AppText';

export const PhoneInput = ({
  value,
  onChangeText,
  autoFocus = false,
  error,
}: PhoneInputProps) => {
  const [country, setCountry] = useState<CountryOption>(DEFAULT_COUNTRY);
  const [pickerVisible, setPickerVisible] = useState(false);

  const displayValue = useMemo(() => formatPhoneNumber(value), [value]);

  const handleChange = useCallback(
    (text: string) => {
      onChangeText(sanitizePhoneNumber(text));
    },
    [onChangeText],
  );

  const handleSelectCountry = useCallback((selected: CountryOption) => {
    setCountry(selected);
    setPickerVisible(false);
  }, []);

  return (
    <View>
      <View style={[styles.container, error ? styles.containerError : null]}>
        <Pressable
          style={styles.countrySection}
          onPress={() => setPickerVisible(true)}
          accessibilityRole="button"
          accessibilityLabel={`Country code ${country.dialCode}, ${country.name}. Tap to change.`}
        >
          <Text style={styles.flag}>{country.flag}</Text>
          <Text style={styles.dialCode}>{country.dialCode}</Text>
          <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
        </Pressable>

        <View style={styles.divider} />

        <TextInput
          style={styles.input}
          value={displayValue}
          onChangeText={handleChange}
          placeholder="000 000 0000"
          placeholderTextColor={colors.textPlaceholder}
          keyboardType="phone-pad"
          maxLength={12}
          autoFocus={autoFocus}
          accessibilityLabel="Phone number"
          accessibilityHint="Enter your 10 digit mobile number"
        />
      </View>

      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}

      <Modal
        visible={pickerVisible}
        animationType="slide"
        transparent
        statusBarTranslucent
        onRequestClose={() => setPickerVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setPickerVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={(event) => event.stopPropagation()}>
            <SafeAreaView edges={['bottom']}>
              <Text style={styles.modalTitle}>Select country</Text>
              <FlatList
                data={COUNTRIES}
                keyExtractor={(item) => item.code}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.countryRow}
                    onPress={() => handleSelectCountry(item)}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.name}, ${item.dialCode}`}
                    android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
                  >
                    <Text style={styles.flag}>{item.flag}</Text>
                    <Text style={styles.countryName}>{item.name}</Text>
                    <Text style={styles.countryDial}>{item.dialCode}</Text>
                  </Pressable>
                )}
              />
            </SafeAreaView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
