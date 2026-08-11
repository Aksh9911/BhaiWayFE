import React, { useCallback } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppFooter, IconButton, BhaiWayCoinIcon, AppText as Text } from '@/shared/components';
import { triggerLightHaptic } from '@/shared/utils';
import { WALLET_TRANSACTIONS_SCREEN } from '@/features/profile/constants';
import { useWalletTransactions } from '@/features/profile/hooks';
import type { WalletTransaction } from '@/features/profile/types';
import { styles, walletTxTokens } from './WalletTransactionsScreen.styles';

const transactionIcon = (icon: WalletTransaction['icon']) => {
  if (icon === 'car') return 'car-outline' as const;
  if (icon === 'card') return 'card-outline' as const;
  if (icon === 'business') return 'business-outline' as const;
  return 'star' as const;
};

export const WalletTransactionsScreen = () => {
  const {
    title,
    subtitle,
    filters,
    activeFilter,
    transactions,
    setFilter,
    openTransaction,
    goBack,
  } = useWalletTransactions();

  const handleBack = useCallback(() => {
    triggerLightHaptic();
    goBack();
  }, [goBack]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          onPress={handleBack}
          color={walletTxTokens.PRIMARY}
          accessibilityLabel="Go back"
        />
        <Text style={styles.headerTitle} accessibilityRole="header" numberOfLines={1}>
          {title}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>{subtitle}</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {filters.map((filter) => {
            const active = filter.id === activeFilter;
            return (
              <Pressable
                key={filter.id}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setFilter(filter.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={filter.label}
              >
                <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.list}>
          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>{WALLET_TRANSACTIONS_SCREEN.emptyTitle}</Text>
              <Text style={styles.emptyMessage}>{WALLET_TRANSACTIONS_SCREEN.emptyMessage}</Text>
            </View>
          ) : (
            transactions.map((tx) => {
              const isCredit = tx.type === 'credit';
              return (
                <Pressable
                  key={tx.id}
                  style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
                  onPress={() => openTransaction(tx)}
                  accessibilityRole="button"
                  accessibilityLabel={`${tx.title}, ${tx.amountLabel}, ${tx.type}`}
                >
                  <View style={styles.left}>
                    <View style={isCredit ? styles.iconCredit : styles.iconDebit}>
                      <Ionicons
                        name={transactionIcon(tx.icon)}
                        size={22}
                        color={isCredit ? walletTxTokens.CREDIT_ICON : walletTxTokens.ERROR}
                      />
                    </View>
                    <View style={styles.meta}>
                      <Text style={styles.title} numberOfLines={1}>
                        {tx.title}
                      </Text>
                      <Text style={styles.date} numberOfLines={1}>
                        {tx.dateLabel}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.right}>
                    <View style={styles.amountRow}>
                      <BhaiWayCoinIcon size={14} />
                      <Text style={isCredit ? styles.amountCredit : styles.amountDebit}>
                        {tx.amountLabel}
                      </Text>
                    </View>
                    <Text style={styles.typeLabel}>{tx.type}</Text>
                  </View>
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>

      <AppFooter activeTab="profile" />
    </SafeAreaView>
  );
};
