import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppFooter, IconButton, KeyboardAwareScrollView, OTPInput, AppText as Text, AppTextInput as TextInput } from '@/shared/components';
import { triggerLightHaptic } from '@/shared/utils';
import { AadhaarOtpResentModal } from '@/features/profile/components';
import { VERIFY_AADHAAR_SCREEN } from '@/features/profile/constants';
import { useVerifyAadhaar } from '@/features/profile/hooks';
import { styles, verifyAadhaarTokens } from './VerifyAadhaarScreen.styles';

export const VerifyAadhaarScreen = () => {
  const pathname = usePathname();
  const isAuthFlow = pathname.includes('/login');
  const {
    step,
    otpValue,
    otpError,
    submitState,
    maskedMobile,
    formattedAadhaar,
    setAadhaarNumber,
    setOtpValue,
    continueToOtp,
    verifyOtp,
    resendOtp,
    resendModalVisible,
    closeResendModal,
    backToDetails,
    goBack,
  } = useVerifyAadhaar();

  const [focused, setFocused] = useState(false);
  const isBusy = submitState !== 'idle';

  const handleBack = useCallback(() => {
    triggerLightHaptic();
    goBack();
  }, [goBack]);

  const handleGetOtp = useCallback(() => {
    void continueToOtp();
  }, [continueToOtp]);

  const handleVerify = useCallback(() => {
    void verifyOtp();
  }, [verifyOtp]);

  const handleResend = useCallback(() => {
    resendOtp();
  }, [resendOtp]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          onPress={handleBack}
          color={verifyAadhaarTokens.PRIMARY}
          accessibilityLabel="Go back"
        />
        <Text style={styles.headerTitle} accessibilityRole="header" numberOfLines={1}>
          {VERIFY_AADHAAR_SCREEN.headerTitle}
        </Text>
      </View>

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        bottomInset={40}
      >
        {step === 'details' ? (
          <>
            <View style={styles.heroCard}>
              <View style={styles.heroIconWrap}>
                <Ionicons name="finger-print" size={40} color={verifyAadhaarTokens.PRIMARY} />
              </View>
              <View style={styles.heroText}>
                <Text style={styles.heroTitle}>{VERIFY_AADHAAR_SCREEN.heroTitle}</Text>
                <Text style={styles.heroBody}>{VERIFY_AADHAAR_SCREEN.heroBody}</Text>
              </View>
            </View>

            <View style={styles.formBlock}>
              <View style={styles.field}>
                <Text style={styles.label}>{VERIFY_AADHAAR_SCREEN.aadhaarLabel}</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={[styles.input, focused && styles.inputFocused]}
                    value={formattedAadhaar}
                    onChangeText={setAadhaarNumber}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={VERIFY_AADHAAR_SCREEN.aadhaarPlaceholder}
                    placeholderTextColor={verifyAadhaarTokens.OUTLINE_VARIANT}
                    keyboardType="number-pad"
                    maxLength={14}
                    editable={!isBusy}
                    accessibilityLabel={VERIFY_AADHAAR_SCREEN.aadhaarLabel}
                  />
                  <Ionicons
                    name="id-card-outline"
                    size={22}
                    color={verifyAadhaarTokens.ON_SURFACE_VARIANT}
                    style={styles.inputIcon}
                  />
                </View>
              </View>

              <View style={styles.otpNote}>
                <Ionicons
                  name="information-circle-outline"
                  size={22}
                  color={verifyAadhaarTokens.ON_SECONDARY_CONTAINER}
                />
                <Text style={styles.otpNoteText}>{VERIFY_AADHAAR_SCREEN.otpNote}</Text>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.ctaButton,
                  isBusy && styles.ctaDisabled,
                  pressed && !isBusy && { opacity: 0.92, transform: [{ scale: 0.98 }] },
                ]}
                onPress={handleGetOtp}
                disabled={isBusy}
                accessibilityRole="button"
                accessibilityLabel={VERIFY_AADHAAR_SCREEN.getOtpLabel}
              >
                {submitState === 'submitting' ? (
                  <ActivityIndicator color={verifyAadhaarTokens.ON_PRIMARY_CONTAINER} />
                ) : (
                  <>
                    <Text style={styles.ctaLabel}>{VERIFY_AADHAAR_SCREEN.getOtpLabel}</Text>
                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color={verifyAadhaarTokens.ON_PRIMARY_CONTAINER}
                    />
                  </>
                )}
              </Pressable>
            </View>

            <View style={styles.securityBlock}>
              <View style={styles.secureBadge}>
                <Ionicons name="lock-closed" size={14} color={verifyAadhaarTokens.PRIMARY} />
                <Text style={styles.secureBadgeText}>{VERIFY_AADHAAR_SCREEN.secureBadge}</Text>
              </View>
              <Text style={styles.secureFooter}>{VERIFY_AADHAAR_SCREEN.secureFooter}</Text>
            </View>
          </>
        ) : (
          <View style={styles.otpCard}>
            <View style={styles.otpHero}>
              <Ionicons name="lock-closed" size={36} color={verifyAadhaarTokens.PRIMARY} />
            </View>

            <View style={styles.otpIntro}>
              <Text style={styles.otpTitle}>{VERIFY_AADHAAR_SCREEN.otpTitle}</Text>
              <Text style={styles.otpSubtitle}>
                {VERIFY_AADHAAR_SCREEN.otpSubtitle(maskedMobile)}
              </Text>
            </View>

            <View style={styles.otpInputWrap}>
              <OTPInput
                value={otpValue}
                onChange={setOtpValue}
                cellCount={VERIFY_AADHAAR_SCREEN.otpLength}
                error={otpError ?? undefined}
              />
            </View>

            <View style={styles.hintChip}>
              <Text style={styles.hintText}>
                {VERIFY_AADHAAR_SCREEN.otpHint}: {VERIFY_AADHAAR_SCREEN.demoOtp}
              </Text>
            </View>

            <View style={styles.otpActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.verifyButton,
                  isBusy && styles.ctaDisabled,
                  pressed && !isBusy && { opacity: 0.92, transform: [{ scale: 0.98 }] },
                ]}
                onPress={handleVerify}
                disabled={isBusy}
                accessibilityRole="button"
                accessibilityLabel={VERIFY_AADHAAR_SCREEN.otpConfirmLabel}
              >
                {submitState === 'submitting' ? (
                  <ActivityIndicator color={verifyAadhaarTokens.ON_PRIMARY} />
                ) : (
                  <Text style={styles.verifyLabel}>{VERIFY_AADHAAR_SCREEN.otpConfirmLabel}</Text>
                )}
              </Pressable>

              <View style={styles.secondaryActions}>
                <Pressable
                  style={styles.linkButton}
                  onPress={handleResend}
                  disabled={isBusy}
                  accessibilityRole="button"
                  accessibilityLabel={VERIFY_AADHAAR_SCREEN.otpResendLabel}
                >
                  <Text style={styles.linkLabel}>{VERIFY_AADHAAR_SCREEN.otpResendLabel}</Text>
                </Pressable>
                <Pressable
                  style={styles.linkButton}
                  onPress={backToDetails}
                  disabled={isBusy}
                  accessibilityRole="button"
                  accessibilityLabel={VERIFY_AADHAAR_SCREEN.otpBackLabel}
                >
                  <Text style={[styles.linkLabel, styles.linkMuted]}>
                    {VERIFY_AADHAAR_SCREEN.otpBackLabel}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </KeyboardAwareScrollView>

      {!isAuthFlow ? <AppFooter activeTab="profile" /> : null}

      <AadhaarOtpResentModal
        visible={resendModalVisible}
        maskedMobile={maskedMobile}
        onClose={closeResendModal}
      />
    </SafeAreaView>
  );
};
