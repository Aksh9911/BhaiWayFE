import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/shared/theme';
import { AppFooter } from '../AppFooter/AppFooter';
import { Button } from '../Button/Button';
import { Header } from '../Header/Header';
import { styles } from './ComingSoonScreen.styles';
import type { ComingSoonScreenProps } from './ComingSoonScreen.types';

export const ComingSoonScreen = ({
  title,
  message = 'This experience is on the way. Stay tuned!',
  icon = 'construct-outline',
  footerActiveTab,
}: ComingSoonScreenProps) => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Header variant="light" title={title} onBack={() => router.back()} />
      <View style={styles.content}>
        <Ionicons name={icon as never} size={56} color={colors.primary} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <Button
          label="Go Back"
          onPress={() => router.back()}
          variant="secondary"
          fullWidth={false}
          style={styles.action}
          accessibilityLabel="Go back"
        />
      </View>
      {footerActiveTab ? <AppFooter activeTab={footerActiveTab} /> : null}
    </SafeAreaView>
  );
};
