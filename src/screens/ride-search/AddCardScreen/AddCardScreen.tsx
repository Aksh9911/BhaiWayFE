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
import { ADD_CARD_SCREEN } from '@/features/ride-search/constants';
import { useAddCard } from '@/features/ride-search/hooks';
import { styles } from './AddCardScreen.styles';

export const AddCardScreen = () => {
  const {
    cardNumber,
    holderName,
    expiry,
    cvv,
    brandLabel,
    canSave,
    saving,
    setCardNumber,
    setHolderName,
    setExpiry,
    setCvv,
    saveCard,
    goBack,
  } = useAddCard();

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleBack = useCallback(() => {
    triggerLightHaptic();
    goBack();
  }, [goBack]);

  const handleSave = useCallback(() => {
    triggerLightHaptic();
    saveCard();
  }, [saveCard]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.headerWrap}>
        <ScreenHeader
          title={ADD_CARD_SCREEN.title}
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
              accessibilityLabel={ADD_CARD_SCREEN.saveLabel}
            >
              {saving ? (
                <>
                  <ActivityIndicator color="#FFFFFF" />
                  <Text style={styles.saveLabel}>{ADD_CARD_SCREEN.savingLabel}</Text>
                </>
              ) : (
                <Text style={styles.saveLabel}>{ADD_CARD_SCREEN.saveLabel}</Text>
              )}
            </Pressable>
          </View>
        }
      >
        <View style={styles.hero}>
          <Text style={styles.heading}>{ADD_CARD_SCREEN.heading}</Text>
          <Text style={styles.subtitle}>{ADD_CARD_SCREEN.subtitle}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.field}>
            <View style={styles.labelRow}>
              <Text style={styles.fieldLabel}>{ADD_CARD_SCREEN.numberLabel}</Text>
              {cardNumber.length > 0 ? (
                <Text style={styles.brandChip}>{brandLabel}</Text>
              ) : null}
            </View>
            <TextInput
              style={[styles.input, focusedField === 'number' && styles.inputFocused]}
              value={cardNumber}
              onChangeText={setCardNumber}
              placeholder={ADD_CARD_SCREEN.numberPlaceholder}
              placeholderTextColor="#747686"
              keyboardType="number-pad"
              onFocus={() => setFocusedField('number')}
              onBlur={() => setFocusedField(null)}
              accessibilityLabel={ADD_CARD_SCREEN.numberLabel}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>{ADD_CARD_SCREEN.nameLabel}</Text>
            <TextInput
              style={[styles.input, focusedField === 'name' && styles.inputFocused]}
              value={holderName}
              onChangeText={setHolderName}
              placeholder={ADD_CARD_SCREEN.namePlaceholder}
              placeholderTextColor="#747686"
              autoCapitalize="words"
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              accessibilityLabel={ADD_CARD_SCREEN.nameLabel}
            />
          </View>

          <View style={styles.rowFields}>
            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.fieldLabel}>{ADD_CARD_SCREEN.expiryLabel}</Text>
              <TextInput
                style={[styles.input, focusedField === 'expiry' && styles.inputFocused]}
                value={expiry}
                onChangeText={setExpiry}
                placeholder={ADD_CARD_SCREEN.expiryPlaceholder}
                placeholderTextColor="#747686"
                keyboardType="number-pad"
                onFocus={() => setFocusedField('expiry')}
                onBlur={() => setFocusedField(null)}
                accessibilityLabel={ADD_CARD_SCREEN.expiryLabel}
              />
            </View>
            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.fieldLabel}>{ADD_CARD_SCREEN.cvvLabel}</Text>
              <TextInput
                style={[styles.input, focusedField === 'cvv' && styles.inputFocused]}
                value={cvv}
                onChangeText={setCvv}
                placeholder={ADD_CARD_SCREEN.cvvPlaceholder}
                placeholderTextColor="#747686"
                keyboardType="number-pad"
                secureTextEntry
                onFocus={() => setFocusedField('cvv')}
                onBlur={() => setFocusedField(null)}
                accessibilityLabel={ADD_CARD_SCREEN.cvvLabel}
              />
            </View>
          </View>
        </View>

        <View style={styles.secureRow}>
          <Ionicons name="shield-checkmark-outline" size={18} color="#5C5F61" />
          <Text style={styles.secureText}>{ADD_CARD_SCREEN.secureLabel}</Text>
        </View>
      </KeyboardAwareScrollView>

      <AppFooter activeTab="rides" />
    </SafeAreaView>
  );
};
