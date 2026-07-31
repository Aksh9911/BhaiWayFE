import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppFooter } from '@/shared/components';
import { LEGAL_SCREEN } from '@/features/profile/constants';
import { useLegalPolicies } from '@/features/profile/hooks';
import { legalTokens, styles } from './LegalPoliciesScreen.styles';

export const LegalPoliciesScreen = () => {
  const { items, goBack, openPolicy } = useLegalPolicies();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed && { backgroundColor: legalTokens.SURFACE_LOW },
          ]}
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={legalTokens.PRIMARY} />
        </Pressable>
        <Text style={styles.headerTitle} accessibilityRole="header" numberOfLines={1}>
          {LEGAL_SCREEN.title}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="hammer-outline" size={36} color={legalTokens.ON_PRIMARY_CONTAINER} />
          </View>
          <Text style={styles.heroTitle}>{LEGAL_SCREEN.heroTitle}</Text>
          <Text style={styles.heroSubtitle}>{LEGAL_SCREEN.heroSubtitle}</Text>
        </View>

        <View style={styles.list}>
          {items.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.card,
                pressed && {
                  borderColor: legalTokens.PRIMARY,
                  opacity: 0.96,
                },
              ]}
              onPress={() => openPolicy(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`${item.title}. ${item.subtitle}`}
            >
              <View style={styles.cardLeft}>
                <View style={styles.cardIcon}>
                  <Ionicons name={item.icon} size={24} color={legalTokens.PRIMARY} />
                </View>
                <View style={styles.cardMeta}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={22} color={legalTokens.ON_SURFACE_VARIANT} />
            </Pressable>
          ))}
        </View>

        <View style={styles.footerInfo}>
          <Text style={styles.versionLabel}>{LEGAL_SCREEN.versionLabel}</Text>
          <Text style={styles.copyrightLabel}>{LEGAL_SCREEN.copyrightLabel}</Text>
        </View>
      </ScrollView>

      <AppFooter activeTab="profile" />
    </SafeAreaView>
  );
};
