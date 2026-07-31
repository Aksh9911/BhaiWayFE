import React, { useCallback } from 'react';
import { Alert, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { Button, Header, KeyboardAwareScrollView, PhoneInput } from '@/shared/components';
import { usePhoneAuth } from '../../hooks';
import { styles } from './PhoneAuthForm.styles';
import type { PhoneAuthFormProps } from './PhoneAuthForm.types';

export const PhoneAuthForm = ({
  flow,
  title,
  heading,
  subtitle,
  helpMessage,
}: PhoneAuthFormProps) => {
  const router = useRouter();
  const { phoneNumber, setPhoneNumber, isValid, loading, submit } = usePhoneAuth(flow);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.welcome);
  }, [router]);

  const handleHelp = useCallback(() => {
    Alert.alert('Help', helpMessage);
  }, [helpMessage]);

  return (
    <View style={styles.screen}>
      <Header title={title} onBack={handleBack} onHelp={handleHelp} variant="light" />

      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInUp.duration(400)}>
          <Text style={styles.heading} accessibilityRole="header">
            {heading}
          </Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(400)} style={styles.inputWrapper}>
          <PhoneInput value={phoneNumber} onChangeText={setPhoneNumber} autoFocus />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(220).duration(400)} style={styles.buttonWrapper}>
          <Button
            label="Continue"
            onPress={submit}
            disabled={!isValid}
            loading={loading}
            accessibilityLabel="Continue to verification"
          />
        </Animated.View>
      </KeyboardAwareScrollView>
    </View>
  );
};
