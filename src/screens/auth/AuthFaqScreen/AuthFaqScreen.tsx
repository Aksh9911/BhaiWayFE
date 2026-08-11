import React, { useCallback } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconButton, AppText as Text } from '@/shared/components';
import { colors } from '@/theme';
import { triggerLightHaptic } from '@/shared/utils';
import { AUTH_FAQ_SCREEN } from '@/features/auth/constants/auth-faq.constants';
import { useAuthFaq } from '@/features/auth/hooks/useAuthFaq';
import { styles } from './AuthFaqScreen.styles';

export const AuthFaqScreen = () => {
  const { subtitle, items, expandedId, toggleItem, goBack } = useAuthFaq();

  const handleBack = useCallback(() => {
    triggerLightHaptic();
    goBack();
  }, [goBack]);

  const handleToggle = useCallback(
    (id: string) => {
      triggerLightHaptic();
      toggleItem(id);
    },
    [toggleItem],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          onPress={handleBack}
          color={colors.primary}
          accessibilityLabel="Go back"
        />
        <Text style={styles.headerTitle} accessibilityRole="header">
          {AUTH_FAQ_SCREEN.title}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>{subtitle}</Text>

        {items.map((item) => {
          const expanded = expandedId === item.id;
          return (
            <View
              key={item.id}
              style={[styles.card, expanded && styles.cardExpanded]}
            >
              <Pressable
                style={styles.questionRow}
                onPress={() => handleToggle(item.id)}
                accessibilityRole="button"
                accessibilityState={{ expanded }}
                accessibilityLabel={item.question}
              >
                <Text style={styles.question}>{item.question}</Text>
                <Ionicons
                  name={expanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.primary}
                />
              </Pressable>
              {expanded ? (
                <View style={styles.answerWrap}>
                  <Text style={styles.answer}>{item.answer}</Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};
