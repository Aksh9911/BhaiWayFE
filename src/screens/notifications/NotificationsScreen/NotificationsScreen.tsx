import React, { useCallback } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconButton, AppText as Text } from '@/shared/components';
import { colors } from '@/shared/theme';
import { NotificationItem } from '@/features/notifications/components';
import { NOTIFICATIONS_SCREEN } from '@/features/notifications/constants';
import { useNotifications } from '@/features/notifications/hooks';
import type { AppNotification } from '@/features/notifications/types';
import { styles } from './NotificationsScreen.styles';

export const NotificationsScreen = () => {
  const {
    items,
    todayItems,
    earlierItems,
    unreadCount,
    permissionStatus,
    requestPermission,
    markAsRead,
    markAllAsRead,
    goBack,
  } = useNotifications();

  const handlePressItem = useCallback(
    (notification: AppNotification) => {
      markAsRead(notification.id);
    },
    [markAsRead],
  );

  const showPermissionBanner = permissionStatus !== 'granted';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerSide}>
          <IconButton
            icon="arrow-back"
            onPress={goBack}
            color={colors.primary}
            accessibilityLabel="Go back"
          />
        </View>
        <Text style={styles.title} accessibilityRole="header" pointerEvents="none">
          {NOTIFICATIONS_SCREEN.title}
        </Text>
        <View style={styles.headerSideRight}>
          <Pressable
            onPress={markAllAsRead}
            disabled={unreadCount === 0}
            accessibilityRole="button"
            accessibilityLabel={NOTIFICATIONS_SCREEN.markAllRead}
            accessibilityState={{ disabled: unreadCount === 0 }}
            hitSlop={8}
          >
            <Text
              style={[styles.markAll, unreadCount === 0 && styles.markAllDisabled]}
              numberOfLines={2}
            >
              {NOTIFICATIONS_SCREEN.markAllRead}
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.listContent,
          items.length === 0 && styles.listEmptyContent,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {showPermissionBanner ? (
          <View style={styles.permissionBanner}>
            <View style={styles.permissionIcon}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.permissionCopy}>
              <Text style={styles.permissionTitle}>
                {NOTIFICATIONS_SCREEN.permissionTitle}
              </Text>
              <Text style={styles.permissionBody}>
                {permissionStatus === 'denied'
                  ? NOTIFICATIONS_SCREEN.permissionDeniedBody
                  : NOTIFICATIONS_SCREEN.permissionBody}
              </Text>
            </View>
            {permissionStatus !== 'denied' ? (
              <Pressable
                style={styles.permissionCta}
                onPress={() => {
                  void requestPermission();
                }}
                accessibilityRole="button"
                accessibilityLabel={NOTIFICATIONS_SCREEN.permissionCta}
              >
                <Text style={styles.permissionCtaLabel}>
                  {NOTIFICATIONS_SCREEN.permissionCta}
                </Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        {items.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="notifications-outline" size={28} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>{NOTIFICATIONS_SCREEN.emptyTitle}</Text>
            <Text style={styles.emptyMessage}>{NOTIFICATIONS_SCREEN.emptyMessage}</Text>
          </View>
        ) : (
          <>
            {todayItems.length > 0 ? (
              <>
                <Text style={styles.sectionLabel}>{NOTIFICATIONS_SCREEN.sectionToday}</Text>
                {todayItems.map((item) => (
                  <NotificationItem
                    key={item.id}
                    notification={item}
                    onPress={handlePressItem}
                  />
                ))}
              </>
            ) : null}

            {earlierItems.length > 0 ? (
              <>
                <Text style={styles.sectionLabel}>
                  {NOTIFICATIONS_SCREEN.sectionEarlier}
                </Text>
                {earlierItems.map((item) => (
                  <NotificationItem
                    key={item.id}
                    notification={item}
                    onPress={handlePressItem}
                  />
                ))}
              </>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
