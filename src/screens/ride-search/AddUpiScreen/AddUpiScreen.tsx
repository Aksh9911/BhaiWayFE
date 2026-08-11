import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AppFooter,
  KeyboardAwareScrollView,
  ScreenHeader,
  AppText as Text,
  AppTextInput as TextInput,
} from '@/shared/components';
import { triggerLightHaptic } from '@/shared/utils';
import { ADD_UPI_SCREEN } from '@/features/ride-search/constants';
import { useAddUpi } from '@/features/ride-search/hooks';
import { styles } from './AddUpiScreen.styles';

export const AddUpiScreen = () => {
  const {
    upiId,
    displayName,
    canSave,
    saving,
    setUpiId,
    setDisplayName,
    saveUpi,
    goBack,
  } = useAddUpi();

  const [upiFocused, setUpiFocused] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);

  const handleBack = useCallback(() => {
    triggerLightHaptic();
    goBack();
  }, [goBack]);

  const handleSave = useCallback(() => {
    triggerLightHaptic();
    saveUpi();
  }, [saveUpi]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.headerWrap}>
        <ScreenHeader
          title={ADD_UPI_SCREEN.title}
          onBack={handleBack}
          right={<View style={{ width: 40 }} />}
        />
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        footer={
          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                (!canSave || saving) && styles.saveButtonDisabled,
                pressed && canSave && !saving && { opacity: 0.92, transform: [{ scale: 0.98 }] },
              ]}
              onPress={handleSave}
              disabled={!canSave || saving}
              accessibilityRole="button"
              accessibilityLabel={ADD_UPI_SCREEN.saveLabel}
            >
              {saving ? (
                <>
                  <ActivityIndicator color="#FFFFFF" />
                  <Text style={styles.saveLabel}>{ADD_UPI_SCREEN.savingLabel}</Text>
                </>
              ) : (
                <Text style={styles.saveLabel}>{ADD_UPI_SCREEN.saveLabel}</Text>
              )}
            </Pressable>
          </View>
        }
      >
        <View style={styles.hero}>
          <Text style={styles.heading}>{ADD_UPI_SCREEN.heading}</Text>
          <Text style={styles.subtitle}>{ADD_UPI_SCREEN.subtitle}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>{ADD_UPI_SCREEN.upiLabel}</Text>
            <TextInput
              style={[styles.input, upiFocused && styles.inputFocused]}
              value={upiId}
              onChangeText={setUpiId}
              placeholder={ADD_UPI_SCREEN.upiPlaceholder}
              placeholderTextColor="#747686"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="username"
              onFocus={() => setUpiFocused(true)}
              onBlur={() => setUpiFocused(false)}
              accessibilityLabel={ADD_UPI_SCREEN.upiLabel}
            />
            <Text style={styles.hint}>{ADD_UPI_SCREEN.upiHint}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>{ADD_UPI_SCREEN.nameLabel}</Text>
            <TextInput
              style={[styles.input, nameFocused && styles.inputFocused]}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder={ADD_UPI_SCREEN.namePlaceholder}
              placeholderTextColor="#747686"
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              accessibilityLabel={ADD_UPI_SCREEN.nameLabel}
            />
          </View>
        </View>

        <View style={styles.secureRow}>
          <Ionicons name="shield-checkmark-outline" size={18} color="#5C5F61" />
          <Text style={styles.secureText}>{ADD_UPI_SCREEN.secureLabel}</Text>
        </View>
      </KeyboardAwareScrollView>

      <AppFooter activeTab="rides" />
    </SafeAreaView>
  );
};
