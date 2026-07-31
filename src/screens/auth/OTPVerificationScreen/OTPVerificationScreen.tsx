import React, { useCallback } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Button, Header, KeyboardAwareScrollView, OTPInput } from '@/shared/components';
import { colors, spacing } from '@/shared/theme';
import { AUTH_CONSTANTS } from '@/features/auth/constants';
import { useOtpVerification } from '@/features/auth/hooks';
import { styles } from './OTPVerificationScreen.styles';

export const OTPVerificationScreen = () => {
  const router = useRouter();
  const {
    maskedPhone,
    code,
    setCode,
    error,
    loading,
    isValid,
    secondsLeft,
    canResend,
    verify,
    resend,
  } = useOtpVerification();

  const handleHelp = useCallback(() => {
    Alert.alert('Help', `Enter the ${AUTH_CONSTANTS.otpLength}-digit code sent to your mobile number.`);
  }, []);

  return (
    <View style={styles.screen}>
      <Header
        title="Verify Phone"
        onBack={() => router.back()}
        onHelp={handleHelp}
        variant="light"
      />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        bottomInset={spacing.xxxl}
      >
        <View style={styles.content}>
          <Animated.View entering={FadeIn.duration(400)} style={styles.lockWrapper}>
            <View style={styles.lockCircle}>
              <Ionicons name="lock-closed" size={36} color={colors.primary} />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(100).duration(400)}>
            <Text style={styles.heading} accessibilityRole="header">
              Verify Phone
            </Text>
            <Text style={styles.subtitle}>
              Enter the {AUTH_CONSTANTS.otpLength}-digit code sent to your number
              {maskedPhone ? `\n${maskedPhone}` : ''}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(180).duration(400)} style={styles.otpWrapper}>
            <OTPInput
              value={code}
              onChange={setCode}
              cellCount={AUTH_CONSTANTS.otpLength}
              error={error}
            />
          </Animated.View>

          <Pressable
            onPress={resend}
            disabled={!canResend}
            accessibilityRole="button"
            accessibilityLabel={
              canResend ? 'Resend verification code' : `Resend code in ${secondsLeft} seconds`
            }
            style={styles.resendButton}
            android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
          >
            <Text style={[styles.resendText, !canResend && styles.resendDisabled]}>
              {canResend ? 'Resend Code' : `Resend Code (${secondsLeft}s)`}
            </Text>
          </Pressable>

          <Animated.View entering={FadeInDown.delay(260).duration(400)} style={styles.buttonWrapper}>
            <Button
              label="Verify"
              onPress={verify}
              disabled={!isValid}
              loading={loading}
              accessibilityLabel="Verify phone number"
            />
          </Animated.View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
