import React, { useCallback } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppFooter, IconButton, AppText as Text, AppTextInput as TextInput } from '@/shared/components';
import { triggerLightHaptic } from '@/shared/utils';
import {
  HELP_SUPPORT_SCREEN,
  SUPPORT_TICKET_STATUS_LABEL,
} from '@/features/profile/constants';
import { useHelpSupport } from '@/features/profile/hooks';
import type { SupportTicketStatus } from '@/features/profile/types';
import { helpTokens, styles } from './HelpSupportScreen.styles';

const statusStyles = (status: SupportTicketStatus) => {
  if (status === 'resolved') {
    return {
      badge: styles.statusResolved,
      label: styles.statusLabelResolved,
    };
  }
  return {
    badge: styles.statusProgress,
    label: styles.statusLabelProgress,
  };
};

export const HelpSupportScreen = () => {
  const {
    query,
    setQuery,
    categories,
    tickets,
    goBack,
    openCategory,
    openTicket,
    viewAllTickets,
    chatWithSupport,
    emailSupport,
  } = useHelpSupport();

  const handleGoBack = useCallback(() => {
    triggerLightHaptic();
    goBack();
  }, [goBack]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          onPress={handleGoBack}
          color={helpTokens.PRIMARY}
          accessibilityLabel="Go back"
        />
        <Text style={styles.headerTitle} accessibilityRole="header" numberOfLines={1}>
          {HELP_SUPPORT_SCREEN.title}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchWrap}>
          <Ionicons
            name="search"
            size={22}
            color={helpTokens.OUTLINE}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder={HELP_SUPPORT_SCREEN.searchPlaceholder}
            placeholderTextColor={helpTokens.OUTLINE}
            returnKeyType="search"
            accessibilityLabel={HELP_SUPPORT_SCREEN.searchPlaceholder}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{HELP_SUPPORT_SCREEN.categoriesHeading}</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <Pressable
                key={category.id}
                style={({ pressed }) => [
                  styles.categoryCard,
                  pressed && { borderColor: helpTokens.PRIMARY },
                ]}
                onPress={() => openCategory(category.id)}
                accessibilityRole="button"
                accessibilityLabel={`${category.title}. ${category.subtitle}`}
              >
                <View style={styles.categoryIcon}>
                  <Ionicons name={category.icon} size={22} color={helpTokens.PRIMARY} />
                </View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
              </Pressable>
            ))}
            {categories.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No categories match your search.</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{HELP_SUPPORT_SCREEN.recentHeading}</Text>
            <Pressable
              onPress={viewAllTickets}
              accessibilityRole="button"
              accessibilityLabel={HELP_SUPPORT_SCREEN.viewAllLabel}
              hitSlop={8}
            >
              <Text style={styles.viewAll}>{HELP_SUPPORT_SCREEN.viewAllLabel}</Text>
            </Pressable>
          </View>

          <View style={styles.ticketsList}>
            {tickets.map((ticket) => {
              const statusStyle = statusStyles(ticket.status);
              return (
                <Pressable
                  key={ticket.id}
                  style={({ pressed }) => [
                    styles.ticketCard,
                    pressed && { transform: [{ scale: 1.01 }] },
                  ]}
                  onPress={() => openTicket(ticket.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`${ticket.title}. ${SUPPORT_TICKET_STATUS_LABEL[ticket.status]}`}
                >
                  <View style={styles.ticketLeft}>
                    <View style={styles.ticketIcon}>
                      <Ionicons name={ticket.icon} size={22} color={helpTokens.SECONDARY} />
                    </View>
                    <View style={styles.ticketMeta}>
                      <Text style={styles.ticketTitle}>{ticket.title}</Text>
                      <Text style={styles.ticketDate}>{ticket.submittedLabel}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, statusStyle.badge]}>
                    <Text style={[styles.statusLabel, statusStyle.label]}>
                      {SUPPORT_TICKET_STATUS_LABEL[ticket.status]}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
            {tickets.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No recent issues match your search.</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.contactActions}>
          <Pressable
            style={({ pressed }) => [
              styles.chatButton,
              pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
            ]}
            onPress={chatWithSupport}
            accessibilityRole="button"
            accessibilityLabel={HELP_SUPPORT_SCREEN.chatLabel}
          >
            <Ionicons name="chatbubble-outline" size={22} color="#FFFFFF" />
            <Text style={styles.chatLabel}>{HELP_SUPPORT_SCREEN.chatLabel}</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.emailButton,
              pressed && { backgroundColor: 'rgba(88, 94, 114, 0.05)', transform: [{ scale: 0.97 }] },
            ]}
            onPress={emailSupport}
            accessibilityRole="button"
            accessibilityLabel={HELP_SUPPORT_SCREEN.emailLabel}
          >
            <Ionicons name="mail-outline" size={22} color={helpTokens.SECONDARY} />
            <Text style={styles.emailLabel}>{HELP_SUPPORT_SCREEN.emailLabel}</Text>
          </Pressable>
        </View>
      </ScrollView>

      <AppFooter activeTab="profile" />
    </SafeAreaView>
  );
};
