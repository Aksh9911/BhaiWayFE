import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AppFooter,
  ScreenHeader,
  AppText as Text,
  AppTextInput as TextInput,
} from '@/shared/components';
import { triggerLightHaptic } from '@/shared/utils';
import { SEE_ALL_BANKS_SCREEN } from '@/features/ride-search/constants';
import { useSeeAllBanks } from '@/features/ride-search/hooks';
import type { PaymentBankOption } from '@/features/ride-search/types';
import { styles } from './SeeAllBanksScreen.styles';

export const SeeAllBanksScreen = () => {
  const { query, setQuery, filteredBanks, selectBank, goBack } = useSeeAllBanks();
  const [searchFocused, setSearchFocused] = useState(false);

  const handleBack = useCallback(() => {
    triggerLightHaptic();
    goBack();
  }, [goBack]);

  const renderBank = useCallback(
    ({ item }: { item: PaymentBankOption }) => (
      <Pressable
        style={({ pressed }) => [styles.bankRow, pressed && { opacity: 0.9 }]}
        onPress={() => selectBank(item.id)}
        accessibilityRole="button"
        accessibilityLabel={`Pay with ${item.label}`}
      >
        <View style={[styles.bankIcon, { backgroundColor: `${item.color}18` }]}>
          <Ionicons name="business" size={22} color={item.color} />
        </View>
        <Text style={styles.bankLabel}>{item.label}</Text>
        <Ionicons name="chevron-forward" size={18} color="#747686" />
      </Pressable>
    ),
    [selectBank],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.headerWrap}>
        <ScreenHeader
          title={SEE_ALL_BANKS_SCREEN.title}
          onBack={handleBack}
          right={<View style={{ width: 40 }} />}
        />
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          style={[styles.searchInput, searchFocused && styles.searchInputFocused]}
          value={query}
          onChangeText={setQuery}
          placeholder={SEE_ALL_BANKS_SCREEN.searchPlaceholder}
          placeholderTextColor="#747686"
          autoCorrect={false}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          accessibilityLabel={SEE_ALL_BANKS_SCREEN.searchPlaceholder}
        />
      </View>

      <FlatList
        data={filteredBanks}
        keyExtractor={(item) => item.id}
        renderItem={renderBank}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <Text style={styles.sectionLabel}>{SEE_ALL_BANKS_SCREEN.allLabel}</Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyLabel}>{SEE_ALL_BANKS_SCREEN.emptyLabel}</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      <AppFooter activeTab="rides" />
    </SafeAreaView>
  );
};
