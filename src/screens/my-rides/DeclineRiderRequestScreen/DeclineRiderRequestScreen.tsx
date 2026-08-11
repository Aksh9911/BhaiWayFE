import React, { useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AppFooter,
  KeyboardAwareScrollView,
  ScreenHeader,
  AppText as Text,
  AppTextInput as TextInput,
} from '@/shared/components';
import { colors } from '@/shared/theme';
import { triggerLightHaptic } from '@/shared/utils';
import { DECLINE_RIDER_SCREEN } from '@/features/my-rides/constants';
import { useDeclineRiderRequest } from '@/features/my-rides/hooks';
import { styles } from './DeclineRiderRequestScreen.styles';

export const DeclineRiderRequestScreen = () => {
  const {
    riderName,
    reasons,
    selectedReason,
    notes,
    canConfirm,
    selectReason,
    setNotes,
    confirmDecline,
    goBack,
  } = useDeclineRiderRequest();

  const handleBack = useCallback(() => {
    triggerLightHaptic();
    goBack();
  }, [goBack]);

  const handleConfirm = useCallback(() => {
    triggerLightHaptic();
    confirmDecline();
  }, [confirmDecline]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.headerWrap}>
        <ScreenHeader title={DECLINE_RIDER_SCREEN.brandName} onBack={handleBack} />
      </View>

      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.intro}>
          <Text style={styles.title}>{DECLINE_RIDER_SCREEN.title}</Text>
          <Text style={styles.subtitle}>{DECLINE_RIDER_SCREEN.subtitle(riderName)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{DECLINE_RIDER_SCREEN.reasonsLabel}</Text>
          <View style={styles.reasonGrid}>
            {reasons.map((reason) => {
              const selected = selectedReason === reason.id;
              return (
                <Pressable
                  key={reason.id}
                  style={[styles.reasonChip, selected && styles.reasonChipSelected]}
                  onPress={() => selectReason(reason.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={reason.label}
                >
                  <Text style={[styles.reasonLabel, selected && styles.reasonLabelSelected]}>
                    {reason.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{DECLINE_RIDER_SCREEN.notesLabel}</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder={DECLINE_RIDER_SCREEN.notesPlaceholder}
            placeholderTextColor={colors.textPlaceholder}
            multiline
            textAlignVertical="top"
            accessibilityLabel={DECLINE_RIDER_SCREEN.notesLabel}
          />
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.confirmBtn,
              !canConfirm && styles.confirmBtnDisabled,
              pressed && canConfirm && { opacity: 0.92 },
            ]}
            onPress={handleConfirm}
            disabled={!canConfirm}
            accessibilityRole="button"
            accessibilityLabel={DECLINE_RIDER_SCREEN.confirmLabel}
          >
            <Text style={styles.confirmLabel}>{DECLINE_RIDER_SCREEN.confirmLabel}</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.85 }]}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel={DECLINE_RIDER_SCREEN.goBackLabel}
          >
            <Text style={styles.backLabel}>{DECLINE_RIDER_SCREEN.goBackLabel}</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>

      <AppFooter activeTab="rides" />
    </SafeAreaView>
  );
};
