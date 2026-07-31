import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/shared/theme';
import {
  PAYMENT_METHODS,
  PAYMENT_SCREEN,
  POPULAR_BANKS,
  WALLET_BALANCE,
} from '../../constants';
import type { PaymentMethodId } from '../../types';
import { styles } from './PaymentMethodList.styles';

export interface PaymentMethodListProps {
  selectedId: PaymentMethodId;
  onSelect: (id: PaymentMethodId) => void;
  onAddUpi: () => void;
  onAddCard: () => void;
  onSeeAllBanks: () => void;
}

const Radio = ({ selected }: { selected: boolean }) => (
  <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
    {selected ? <View style={styles.radioInner} /> : null}
  </View>
);

const SectionTitle = ({ title }: { title: string }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

export const PaymentMethodList = React.memo(
  ({
    selectedId,
    onSelect,
    onAddUpi,
    onAddCard,
    onSeeAllBanks,
  }: PaymentMethodListProps) => {
    const wallet = PAYMENT_METHODS.find((m) => m.kind === 'wallet')!;
    const upiMethods = PAYMENT_METHODS.filter((m) => m.kind === 'upi');
    const card = PAYMENT_METHODS.find((m) => m.kind === 'card')!;
    const payAfter = PAYMENT_METHODS.find((m) => m.kind === 'pay-after')!;

    return (
      <>
        {/* Wallet */}
        <View style={styles.section}>
          <SectionTitle title={PAYMENT_SCREEN.walletTitle} />
          <View style={styles.card}>
            <Pressable
              style={styles.row}
              onPress={() => onSelect(wallet.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: selectedId === wallet.id }}
              android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
            >
              <View style={styles.iconWrap}>
                <Ionicons name="wallet" size={22} color={colors.primary} />
              </View>
              <View style={styles.meta}>
                <Text style={styles.label}>{wallet.label}</Text>
                <Text style={styles.subtitle}>
                  Balance:{' '}
                  <Text style={styles.balanceValue}>₹{WALLET_BALANCE.toFixed(2)}</Text>
                </Text>
              </View>
              <Radio selected={selectedId === wallet.id} />
            </Pressable>
          </View>
        </View>

        {/* UPI */}
        <View style={styles.section}>
          <SectionTitle title={PAYMENT_SCREEN.upiTitle} />
          <View style={styles.card}>
            {upiMethods.map((method, index) => (
              <React.Fragment key={method.id}>
                {index > 0 ? <View style={styles.rowDivider} /> : null}
                <Pressable
                  style={styles.row}
                  onPress={() => onSelect(method.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: selectedId === method.id }}
                  android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
                >
                  <View style={styles.upiIconWrap}>
                    <Ionicons
                      name={method.icon as keyof typeof Ionicons.glyphMap}
                      size={28}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.meta}>
                    <Text style={styles.labelMedium}>{method.label}</Text>
                  </View>
                  <Radio selected={selectedId === method.id} />
                </Pressable>
              </React.Fragment>
            ))}
            <View style={styles.rowDivider} />
            <Pressable
              style={styles.addRow}
              onPress={onAddUpi}
              accessibilityRole="button"
              android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
            >
              <View style={styles.addIcon}>
                <Ionicons name="add" size={22} color={colors.primary} />
              </View>
              <Text style={styles.addLabel}>{PAYMENT_SCREEN.addUpiLabel}</Text>
            </Pressable>
          </View>
        </View>

        {/* Saved Cards */}
        <View style={styles.section}>
          <SectionTitle title={PAYMENT_SCREEN.cardsTitle} />
          <View style={styles.card}>
            <Pressable
              style={styles.row}
              onPress={() => onSelect(card.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: selectedId === card.id }}
              android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
            >
              <View style={styles.visaBadge}>
                <Text style={styles.visaText}>VISA</Text>
              </View>
              <View style={styles.meta}>
                <Text style={styles.labelMedium}>{card.label}</Text>
                <Text style={styles.subtitle}>{card.subtitle}</Text>
              </View>
              <Radio selected={selectedId === card.id} />
            </Pressable>
            <View style={styles.rowDivider} />
            <Pressable
              style={styles.addRow}
              onPress={onAddCard}
              accessibilityRole="button"
              android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
            >
              <View style={styles.addIcon}>
                <Ionicons name="card-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.addLabel}>{PAYMENT_SCREEN.addCardLabel}</Text>
            </Pressable>
          </View>
        </View>

        {/* Net Banking */}
        <View style={styles.section}>
          <SectionTitle title={PAYMENT_SCREEN.bankingTitle} />
          <View style={styles.card}>
            <View style={styles.banksGrid}>
              {POPULAR_BANKS.map((bank, index) => (
                <Pressable
                  key={bank.id}
                  style={[styles.bankItem, index === POPULAR_BANKS.length - 1 && styles.bankItemLast]}
                  accessibilityRole="button"
                  accessibilityLabel={`Pay with ${bank.label}`}
                  android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
                >
                  <View style={styles.bankIcon}>
                    <Ionicons name="business" size={28} color={bank.color} />
                  </View>
                  <Text style={styles.bankLabel}>{bank.label}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              style={styles.seeAll}
              onPress={onSeeAllBanks}
              accessibilityRole="button"
              android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
            >
              <Text style={styles.seeAllLabel}>{PAYMENT_SCREEN.seeAllBanksLabel}</Text>
              <Ionicons name="chevron-down" size={20} color="#45464D" />
            </Pressable>
          </View>
        </View>

        {/* Pay After Ride */}
        <View style={styles.section}>
          <SectionTitle title={PAYMENT_SCREEN.payAfterTitle} />
          <View style={styles.card}>
            <Pressable
              style={styles.row}
              onPress={() => onSelect(payAfter.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: selectedId === payAfter.id }}
              android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
            >
              <View style={styles.iconWrap}>
                <Ionicons name="repeat-outline" size={22} color={colors.primary} />
              </View>
              <View style={styles.meta}>
                <Text style={styles.label}>{payAfter.label}</Text>
                <Text style={styles.subtitle}>{payAfter.subtitle}</Text>
              </View>
              <Radio selected={selectedId === payAfter.id} />
            </Pressable>
          </View>
        </View>
      </>
    );
  },
);

PaymentMethodList.displayName = 'PaymentMethodList';
